from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(resume_embedding, jd_embedding):
    score = cosine_similarity(
        [resume_embedding],
        [jd_embedding]
    )[0][0]

    return float(score)