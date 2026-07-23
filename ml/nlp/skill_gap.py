ALIASES = {
    "js": "javascript",
    "node": "node.js",
    "nodejs": "node.js",
    "reactjs": "react",
    "react.js": "react",
    "py": "python",
    "postgres": "postgresql",
    "postgresql db": "postgresql",
    "tf": "tensorflow",
    "tf2": "tensorflow",
    "aws ec2": "aws",
    "aws s3": "aws",
    "git hub": "github",
    "gitlab": "git",
    "ml": "machine learning",
    "ai": "artificial intelligence"
}

PARENT_SKILLS = {
    "fastapi": {"python"},
    "flask": {"python"},
    "django": {"python"},

    "tensorflow": {"machine learning"},
    "pytorch": {"machine learning"},
    "scikit-learn": {"machine learning"},

    "express": {"node.js"},
    "nestjs": {"node.js"},

    "numpy": {"python"},
    "pandas": {"python"},
}

def skills_preprocessing(skills: set[str]) -> set[str]:
     total = set()

     for skill in skills:
        skill = skill.lower().strip()

        # Replace alias if one exists
        skill = ALIASES.get(skill, skill)
        total.add(skill)
        if skill in PARENT_SKILLS:
            total.update(PARENT_SKILLS[skill])

        
     return total
    
def match_skills(resume_skills, jd_skills):
    resume_skillsP=skills_preprocessing(resume_skills)
    jd_skillsP=skills_preprocessing(jd_skills)
    matched_skills = resume_skillsP & jd_skillsP
    missing_skills = jd_skillsP - resume_skillsP
    extra_skills = resume_skillsP - jd_skillsP
    match_percentage=(len(matched_skills) / len(jd_skills)) * 100
    return {
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "extra_skills": sorted(extra_skills),
        "match_percentage": match_percentage
    }