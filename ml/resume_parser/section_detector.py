import spacy

from .parser import extract_text
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")


# raw_text = extract_text("resume.pdf")
# clean_text = ResumeCleaner.clean(raw_text)
# doc = nlp(clean_text)


def detect_sections(doc):

    matcher = PhraseMatcher(
        nlp.vocab,
        attr="LOWER"
    )

    skill_patterns = [
        nlp("Skills"),
        nlp("Technical Skills"),
        nlp("Skill Set"),
        nlp("Core Skills"),
        nlp("Technical Expertise"),
        nlp("Key Skills")
    ]

    matcher.add(
        "SKILLS",
        skill_patterns
    )

    experience_patterns = [
        nlp("Experience"),
        nlp("Work Experience"),
        nlp("Professional Experience"),
        nlp("Employment History"),
        nlp("Career History"),
        nlp("Relevant Experience"),
    ]

    matcher.add(
        "EXPERIENCE",
        experience_patterns
    )

    education_patterns = [
        nlp("Education"),
        nlp("Academic Background"),
        nlp("Qualifications"),
        nlp("Educational Qualifications")
    ]

    matcher.add(
        "EDUCATION",
        education_patterns
    )

    project_patterns = [
        nlp("Projects"),
        nlp("Personal Projects"),
        nlp("Academic Projects")
    ]

    matcher.add(
        "PROJECTS",
        project_patterns
    )

    matches = matcher(doc)

    for match_id, start, end in matches:
        print(doc[start:end].text)

    sections = []

    for match_id, start, end in matches:
        sections.append({
            "section": nlp.vocab.strings[match_id],
            "start": start,
            "end": end
        })

    sections.sort(
        key=lambda x: x["start"]
    )

    section_text = {}

    for i, section in enumerate(sections):

        current_section = section["section"]

        start = section["end"]

        if i < len(sections) - 1:
            end = sections[i + 1]["start"]
        else:
            end = len(doc)

        text = doc[start:end].text.strip()

        section_text[current_section] = text

    return section_text