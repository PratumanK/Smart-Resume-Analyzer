import spacy
import re
from spacy.matcher import PhraseMatcher
from parser import extract_text

nlp = spacy.load("en_core_web_sm")
def load_skills():
    with open("../datasets/skills_extended.txt", "r", encoding="utf-8") as file:
        skills = [line.strip() for line in file if line.strip()]
    print (skills)

    return skills

skills = load_skills()
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

patterns = [nlp(skill) for skill in skills]

matcher.add("SKILL", patterns)


def extract_entry(block):
    entry = {
        "title": None,
        "description": None,
        "skills_contained": []
    }
    
    lines = block.split("\n")
    entry["title"] = lines[0].strip()
    entry["description"] = "\n".join(lines[1:]).strip()
    doc = nlp(entry["description"])
    matches = matcher(doc)
    skills_contained=set()
    for match_id, start, end in matches:
        skills_contained.add( doc[start:end].text)    
    entry["skills_contained"] = sorted(skills_contained)
    return entry

def extract_projects(doc):
    blocks = re.split(r"\n\s*\n", doc)
    projects = []

    for block in blocks:

        block = block.strip()

        if not block:
            continue

        entry = extract_entry(block)

        if entry["title"] :
            projects.append(entry)

    return projects
