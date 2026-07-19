import spacy
import re

from parser import extract_text
from cleaner import ResumeCleaner
from skills import extract_skills
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")


def load_degree():
    with open("../datasets/degree.txt", "r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]


degrees = load_degree()

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(degree) for degree in degrees]
matcher.add("DEGREE", patterns)


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
    "sde",
    "swe",
    "mle",
}

experience_regex = re.compile(
    r"\b(?:"
    r"freshers?|"
    r"\d+\+?\s*(?:years?|yrs?)|"
    r"\d+\s*[-–]\s*\d+\s*(?:years?|yrs?)|"
    r"\d+\s*to\s*\d+\s*(?:years?|yrs?)"
    r")\b",
    re.IGNORECASE,
)

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


def parse_jd(jd_path):
    raw_text = extract_text(jd_path)
    clean_text = ResumeCleaner.clean(raw_text)
    doc = nlp(clean_text)

    company = None
    title = None
    education = None

    # Company
    for ent in doc.ents:
        if ent.label_ == "ORG":
            company = ent.text
            break

    # Skills
    skills = extract_skills(doc)

    # Job Title
    for line in clean_text.splitlines():
        for word in JOB_KEYWORDS:
            if word in line.lower():
                title = line.strip()
                break
        if title:
            break

    # Experience
    match = experience_regex.search(clean_text.lower())
    experience = match.group() if match else None

    # Education
    edu_match = degree_regex.search(clean_text)
    if edu_match:
        education = edu_match.group().strip()
    else:
        matches = matcher(doc)
        if matches:
            _, start, end = matches[0]
            education = doc[start:end].text

    jd_data = {
        "skills_required": skills,
        "experience_required": experience,
        "education_required": education,
        "job_title": title,
        "company": company,
    }

    return jd_data


if __name__ == "__main__":
    from pprint import pprint

    jd_data = parse_jd("jd.pdf")
    pprint(jd_data)