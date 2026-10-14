
import re
from pathlib import Path

import spacy
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")

# Resolve the dataset path independently of the working directory.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEGREE_FILE = PROJECT_ROOT / "datasets" / "degree.txt"


def load_degree():
    if not DEGREE_FILE.exists():
        return []

    with open(DEGREE_FILE, "r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]


degrees = load_degree()

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(degree) for degree in degrees]

if patterns:
    matcher.add("DEGREE", patterns)


degree_regex = re.compile(
    r"\b("
    r"Bachelor(?:'s)?(?:\s+degree)?(?:\s+(?:of|in)\s+"
    r"[A-Za-z][A-Za-z &/-]{0,50})?"
    r"|Master(?:'s)?(?:\s+degree)?(?:\s+(?:of|in)\s+"
    r"[A-Za-z][A-Za-z &/-]{0,50})?"
    r"|Diploma(?:\s+in\s+[A-Za-z][A-Za-z &/-]{0,50})?"
    r"|B\s*\.?\s*Tech"
    r"|M\s*\.?\s*Tech"
    r"|B\s*\.?\s*E"
    r"|M\s*\.?\s*E"
    r"|BCA|MCA|MBA|BBA"
    r"|B\s*\.?\s*Sc"
    r"|M\s*\.?\s*Sc"
    r"|B\s*\.?\s*Com"
    r"|M\s*\.?\s*Com"
    r"|Ph\s*\.?\s*D"
    r")\b",
    re.IGNORECASE,
)

institution_keywords = [
    "University",
    "Institute",
    "College",
    "School",
    "Academy",
]


def extract_entry(block):
    entry = {
        "degree": None,
        "institution": None,
        "graduation_year": None,
        "cgpa": None,
        "percentage": None,
    }

    # Degree extraction: prefer full degree names.
    match = degree_regex.search(block)

    if match:
        entry["degree"] = match.group(1).strip()

    else:
        doc = nlp(block)
        matches = matcher(doc)

        if matches:
            # Prefer the longest matching degree phrase.
            _, start, end = max(
                matches,
                key=lambda item: item[2] - item[1],
            )
            entry["degree"] = doc[start:end].text.strip()

    # Find a plausible institution line, rather than blindly taking
    # the first ORG entity (which may be the degree name).
    for line in block.splitlines():
        line = line.strip()

        if not line:
            continue

        if any(
            keyword.lower() in line.lower()
            for keyword in institution_keywords
        ):
            entry["institution"] = line
            break

    # Graduation year: use the final year mentioned in this block.
    years = re.findall(r"\b(?:19|20)\d{2}\b", block)

    if years:
        entry["graduation_year"] = years[-1]

    cgpa_match = re.search(
        r"\bCGPA\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
        block,
        re.IGNORECASE,
    )

    if cgpa_match:
        entry["cgpa"] = cgpa_match.group(1)

    percentage_match = re.search(
        r"\b(?:Percentage|Marks)\s*[:=\-]?\s*(\d+(?:\.\d+)?%?)",
        block,
        re.IGNORECASE,
    )

    if percentage_match:
        entry["percentage"] = percentage_match.group(1)

    return entry


def extract_education(text):
    # Keep the existing block-based strategy for now.
    blocks = re.split(r"\n\s*\n", text)
    education = []

    for block in blocks:
        block = block.strip()

        if not block:
            continue

        entry = extract_entry(block)

        if entry["degree"] is not None:
            education.append(entry)

    return education
