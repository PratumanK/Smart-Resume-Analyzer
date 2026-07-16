import re
import spacy
from spacy.matcher import PhraseMatcher
from parser import extract_text

nlp = spacy.load("en_core_web_sm")


def load_degree():
    with open("../datasets/degree.txt", "r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]


degrees = load_degree()

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(degree) for degree in degrees]
matcher.add("DEGREE", patterns)



degree_regex = re.compile(
    r"""
    (
        Bachelor'?s?\s+of\s+[A-Za-z ]+
        |
        Bachelor'?s?\s+in\s+[A-Za-z ]+
        |
        Master'?s?\s+of\s+[A-Za-z ]+
        |
        Master'?s?\s+in\s+[A-Za-z ]+
        |
        Diploma\s+in\s+[A-Za-z ]+
        |
        B\.?\s?Tech
        |
        M\.?\s?Tech
        |
        B\.?\s?E
        |
        M\.?\s?E
        |
        BCA
        |
        MCA
        |
        MBA
        |
        BBA
        |
        B\.?\s?Sc
        |
        M\.?\s?Sc
        |
        B\.?\s?Com
        |
        M\.?\s?Com
        |
        Ph\.?\s?D
    )
    """,
    re.IGNORECASE | re.VERBOSE,
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
        "percentage":None
    }

    doc = nlp(block)

   
    match = degree_regex.search(block)

    if match:
        entry["degree"] = match.group().strip()

    
    if entry["degree"] is None:
        matches = matcher(doc)

        if matches:
            _, start, end = matches[0]
            entry["degree"] = doc[start:end].text

  
    for ent in doc.ents:
        if ent.label_ == "ORG":
            entry["institution"] = ent.text
            break

   
    if entry["institution"] is None:
        for line in block.split("\n"):
            for keyword in institution_keywords:
                if keyword.lower() in line.lower():
                    entry["institution"] = line.strip()
                    break

            if entry["institution"]:
                break

   
    years = re.findall(r"\b(?:19|20)\d{2}\b", block)

    if years:
        entry["graduation_year"] = years[-1]

    
    cgpa_match = re.search(
    r"CGPA\s*[:=\-]?\s*([\d.]+)",
    block,
    re.IGNORECASE,
)

    if cgpa_match:
     entry["cgpa"] = cgpa_match.group(1)
    percentage_match = re.search(
    r"(?:Percentage|Marks)\s*[:=\-]?\s*([\d.]+%?)",
    block,
    re.IGNORECASE,
)

    if percentage_match:
     entry["percentage"] = percentage_match.group(1)
    

    return entry



def extract_education(text):

   
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


