import spacy

from parser import extract_text
from cleaner import ResumeCleaner

from section_detector import detect_sections
from skills import extract_skills
from experience import extract_experience
from education import extract_education
from projects import extract_projects

nlp = spacy.load("en_core_web_sm")
raw_text = extract_text("resume.pdf")
clean_text = ResumeCleaner.clean(raw_text)
doc = nlp(clean_text)
sections = detect_sections(doc)
skills = extract_skills(
    nlp(sections.get("SKILLS", ""))
)

experience = extract_experience(
    sections.get("EXPERIENCE", "")
)

education = extract_education(
    sections.get("EDUCATION", "")
)

projects = extract_projects(
    sections.get("PROJECTS", "")
)
all_skills = list(
    skills.union(
        {
            skill
            for project in projects
            for skill in project["skills_contained"]
        }
    )
)


resume_data = {

    "skills": all_skills,

    "experience": experience,

    "education": education,

    "projects": projects
}

from pprint import pprint

pprint(resume_data)