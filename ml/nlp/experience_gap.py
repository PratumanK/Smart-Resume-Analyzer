import re
from embeddings import resume_embedding,jd_embedding
from similarity import calculate_similarity
def parse_experience_requirement(exp):
    if exp is None:
        return None

    exp = exp.lower()

    if "fresher" in exp:
        return 0

    nums = list(map(int, re.findall(r"\d+", exp)))

    if len(nums) == 1:
        return nums[0]

    if len(nums) >= 2:
        return nums[0]      # minimum required

    return None
def match_experience(resume_experience,jd_experience):
    candidate=resume_experience["total_experience_years"]
    required=parse_experience_requirement(jd_experience)
    difference = None
    if required is not None:
        difference = round(candidate - required, 1)
    meets_requirement=False
    if required is not None:
        meets_requirement = candidate >= required
    similarity=0
    if (resume_experience["last_role"] and jd_experience["job_title"]):
        role_vec = resume_embedding(resume_experience["last_role"] )
        jd_vec = jd_embedding(jd_experience["job_title"])
        similarity = calculate_similarity(role_vec, jd_vec)
    score = 0
    if meets_requirement:
       score += 50
    score += similarity * 50
    score = round(score, 1)
    similarity=round(similarity * 100, 1)
    return{
    "required_experience":required,
    "candidate_experience":candidate,
    "difference":difference,
    "meets_requirement":meets_requirement,
    "last_role":resume_experience["last_role"],
    "job_title":jd_experience["job_title"],
    "role_similarity":similarity,
    "experience_score":score

    }

    