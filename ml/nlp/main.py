
from resume_parser.pipeline import parse_resume
from resume_parser.jd_parser import parse_jd
from resume_parser.formatter import resume_to_text, jd_to_text

from .embeddings import resume_embedding, jd_embedding
from .similarity import calculate_similarity
from .skill_gap import match_skills
from .experience_gap import match_experience
from .education_gap import match_education
from .ats_score import calculate_ats_score

from llm.report_generator import report_generation


def analyze_resume(resume_path: str, jd_path: str):
    # Parse both documents
    resume_data = parse_resume(resume_path)
    jd_data = parse_jd(jd_path)

    # Convert parsed data into text
    resume_text = resume_to_text(resume_data)
    jd_text = jd_to_text(jd_data)

    # Generate embeddings and calculate similarity
    resume_embedding1 = resume_embedding(resume_text)
    jd_embedding2 = jd_embedding(jd_text)

    similarity_score = calculate_similarity(
        resume_embedding1,
        jd_embedding2
    )

    # Match skills
    resume_skills = set(resume_data["skills"])
    jd_skills = set(jd_data["skills_required"])

    skillMatcher_result = match_skills(
        resume_skills,
        jd_skills
    )

    # Match experience
    resume_experience = resume_data["experience"]

    jd_experience = {
      "experience_required": jd_data["experience_required"],
       "job_title": jd_data["job_title"]
     }

    experienceMatcher_result = match_experience(
      resume_experience,
      jd_experience
    )


    # Match education
    resume_education = resume_data["education"]
    jd_education = jd_data["education_required"]

    educationMatcher_result = match_education(
        resume_education,
        jd_education
    )

    # Calculate ATS score
    skill_score = skillMatcher_result["match_percentage"]
    experience_score = experienceMatcher_result["experience_score"]
    education_score = educationMatcher_result["score"]

    ats = calculate_ats_score(
        similarity_score,
        skill_score,
        experience_score,
        education_score
    )

    analysis = {
        "ats_score": ats,
        "semantic_similarity": similarity_score,
        "skills": skillMatcher_result,
        "experience": experienceMatcher_result,
        "education": educationMatcher_result,
        "resume": {
            "skills": list(resume_skills),
            "experience": resume_experience,
            "education": resume_education
        },
        "job_description": {
            "skills": list(jd_skills),
            "experience": jd_experience,
            "education": jd_education
        }
    }

    return analysis, resume_data


def complete_analysis(resume_path: str, jd_path: str):
    analysis, resume_data = analyze_resume(resume_path, jd_path)

    report = report_generation(analysis)

    return {
        "Analysis": analysis,
        "Report": report,
        "Data": resume_data
    }
