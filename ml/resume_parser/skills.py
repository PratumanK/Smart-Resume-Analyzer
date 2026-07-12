import spacy
from parser import extract_text
from spacy.matcher import PhraseMatcher
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

def extract_skills(doc):
    matches = matcher(doc)
    skills_contained=set()
    for match_id, start, end in matches:
        # print(doc[start:end].text)
        skills_contained.add( doc[start:end].text)
    return skills_contained

