
import re
from pathlib import Path

import spacy
from spacy.matcher import PhraseMatcher

from .parser import extract_text
from .cleaner import ResumeCleaner
from .skills import extract_skills


nlp = spacy.load("en_core_web_sm")


# --------------------------------------------------
# Degree dataset
# --------------------------------------------------

# Resolve the dataset path relative to the project,
# not relative to whichever directory runs Python.
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


# --------------------------------------------------
# Job title extraction
# --------------------------------------------------

JOB_KEYWORDS = {
    "engineer",
    "developer",
    "intern",
    "analyst",
    "scientist",
    "manager",
    "consultant",
    "architect",
    "specialist",
    "associate",
    "designer",
    "administrator",
    "lead",
    "head",
    "director",
    "officer",
    "researcher",
    "programmer",
    "executive",
    "trainee",
    "technician",
    "tester",
    "accountant",
    "nurse",
    "teacher",
    "product",
    "sde",
    "swe",
    "mle",
    "qa",
    "sqa",
}

LABELED_TITLE_REGEX = re.compile(
    r"^\s*(?:job\s*title|position|role|vacancy)\s*[:\-–]\s*(.+?)\s*$",
    re.IGNORECASE,
)

GENERIC_HEADING_REGEX = re.compile(
    r"\b("
    r"company name|"
    r"engineering team|"
    r"position overview|"
    r"key responsibilities|"
    r"required qualifications|"
    r"technical competency matrix|"
    r"about us|"
    r"what we offer|"
    r"table of contents|"
    r"job description"
    r")\b",
    re.IGNORECASE,
)


def extract_job_title(clean_text):
    lines = [
        line.strip()
        for line in clean_text.splitlines()
        if line.strip()
    ]

    # 1. Prefer an explicitly labeled title.
    for line in lines[:40]:
        match = LABELED_TITLE_REGEX.match(line)

        if match:
            title = match.group(1).strip()

            if title and not GENERIC_HEADING_REGEX.search(title):
                return title

    # 2. Otherwise, look for plausible role headings.
    candidates = []

    for index, line in enumerate(lines[:40]):
        if len(line) > 120:
            continue

        if GENERIC_HEADING_REGEX.search(line):
            continue

        # Avoid treating full paragraphs as titles.
        if len(line.split()) > 12:
            continue

        words = {
            word.lower()
            for word in re.findall(r"[A-Za-z]+", line)
        }

        if not words.intersection(JOB_KEYWORDS):
            continue

        # Prefer concise headings near the beginning.
        score = 0

        if len(line.split()) <= 8:
            score += 2

        if index < 10:
            score += 3
        elif index < 20:
            score += 1

        # A title containing multiple role-related terms
        # is more likely to be a meaningful job heading.
        score += min(len(words.intersection(JOB_KEYWORDS)), 2)

        candidates.append((score, index, line))

    if candidates:
        candidates.sort(key=lambda item: (-item[0], item[1]))
        return candidates[0][2]

    return None


# --------------------------------------------------
# Experience requirement extraction
# --------------------------------------------------

experience_regex = re.compile(
    r"\b(?:"
    r"freshers?|"
    r"\d+\s*\+?\s*(?:years?|yrs?)|"
    r"\d+\s*[-–]\s*\d+\s*(?:years?|yrs?)|"
    r"\d+\s+to\s+\d+\s*(?:years?|yrs?)|"
    r"at\s+least\s+\d+\s*(?:years?|yrs?)|"
    r"minimum\s+of\s+\d+\s*(?:years?|yrs?)"
    r")\b",
    re.IGNORECASE,
)


def extract_experience_requirement(clean_text):
    # Prefer experience statements over unrelated numbers elsewhere.
    lines = clean_text.splitlines()

    for line in lines:
        if re.search(
            r"\b(experience|experienced|employment history|"
            r"work history|freshers?)\b",
            line,
            re.IGNORECASE,
        ):
            match = experience_regex.search(line)

            if match:
                return match.group().strip()

    # Fallback: search the whole document.
    match = experience_regex.search(clean_text)

    return match.group().strip() if match else None


# --------------------------------------------------
# Education requirement extraction
# --------------------------------------------------


# --------------------------------------------------
# Education requirement extraction
# --------------------------------------------------

degree_regex = re.compile(
    r"\b(?:"
    r"bachelor(?:'s)?\s+degree"
    r"|bachelor(?:'s)?\s+(?:of|in)\s+[^.\n,;]{1,60}"
    r"|master(?:'s)?\s+degree"
    r"|master(?:'s)?\s+(?:of|in)\s+[^.\n,;]{1,60}"
    r"|diploma(?:\s+in\s+[^.\n,;]{1,60})?"
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


def extract_education_requirement(clean_text, doc):
    # Prefer education-related lines to avoid matching degrees
    # mentioned incidentally elsewhere in the document.
    education_lines = []

    for line in clean_text.splitlines():
        if re.search(
            r"\b(education|educational|degree|bachelor|master|"
            r"qualification|qualifications|diploma)\b",
            line,
            re.IGNORECASE,
        ):
            education_lines.append(line)

    # Look for explicit degree requirements in relevant lines.
    for line in education_lines:
        match = degree_regex.search(line)
        if match:
            return match.group(0).strip()

    # Handle requirements such as "bachelor's degree or equivalent
    # practical experience", even if formatting varies.
    if re.search(
        r"\b(bachelor(?:'s)?\s+degree|undergraduate\s+degree)\b",
        clean_text,
        re.IGNORECASE,
    ):
        return "Bachelor's degree or equivalent practical experience"

    # Fallback to the configured degree vocabulary only when
    # a relevant education line contains a degree match.
    for line in education_lines:
        line_doc = nlp(line)
        matches = matcher(line_doc)

        if matches:
            _, start, end = min(matches, key=lambda item: item[1])
            return line_doc[start:end].text.strip()

    return None

    # First, look for explicit degree phrases.
    match = degree_regex.search(clean_text)

    if match:
        return match.group(0).strip()

    # Fallback to the configured degree vocabulary.
    matches = matcher(doc)

    if matches:
        # Prefer the earliest matched degree phrase.
        _, start, end = min(matches, key=lambda item: item[1])
        return doc[start:end].text.strip()

    # No identifiable degree requirement.
    return None


# --------------------------------------------------
# Main JD parser
# --------------------------------------------------

def parse_jd(jd_path):
    raw_text = extract_text(jd_path)
    clean_text = ResumeCleaner.clean(raw_text)
    doc = nlp(clean_text)

    
    company = None

    for line in clean_text.splitlines()[:15]:
      line = line.strip()

    # Ignore placeholders and generic document headings.
      if re.search(r"\[COMPANY NAME\]", line, re.IGNORECASE):
         continue

      if re.match(
        r"^(company|employer|organization)\s*[:\-]\s*\S",
        line,
        re.IGNORECASE,
       ):
        company = re.split(r"[:\-]", line, maxsplit=1)[1].strip()
        break


    # Skills.
    skills = extract_skills(doc)

    # Job title.
    title = extract_job_title(clean_text)

    # Experience.
    experience = extract_experience_requirement(clean_text)

    # Education.
    education = extract_education_requirement(clean_text, doc)

    return {
        "skills_required": skills,
        "experience_required": experience,
        "education_required": education,
        "job_title": title,
        "company": company,
    }


if __name__ == "__main__":
    from pprint import pprint

    jd_data = parse_jd(r"C:\Users\Pratuman\Downloads\Software Quality Assurance Engineer Job Description.pdf")
    print(jd_data)
