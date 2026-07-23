from resume_parser.pipeline import parse_resume
from resume_parser.jd_parser import parse_jd
from resume_parser.formatter import resume_to_text, jd_to_text
from embeddings import resume_embedding,jd_embedding
from similarity import calculate_similarity
from skill_gap import match_skills



resume_data = parse_resume("resume.pdf")
jd_data = parse_jd("jd.pdf")

resume_text = resume_to_text(resume_data)
jd_text = jd_to_text(jd_data)

resume_embedding1 = resume_embedding(resume_text)
jd_embedding2 = jd_embedding(jd_text)

similarity_score=calculate_similarity(resume_embedding1, jd_embedding2)

resume_skills = set(resume_data["skills"])
jd_skills = set(jd_data["skills"])
skillMatcher_result = match_skills(resume_skills, jd_skills)
