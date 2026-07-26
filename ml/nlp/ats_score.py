def calculate_ats_score(
    similarity_score,
    skill_score,
    experience_score,
    education_score
):
    ats = round(
        similarity_score * 0.30 +
        skill_score * 0.40 +
        experience_score * 0.20 +
        education_score * 0.10,
        2
    )

    if ats >= 90:
        rating = "Excellent"
    elif ats >= 80:
        rating = "Very Strong"
    elif ats >= 70:
        rating = "Strong"
    elif ats >= 60:
        rating = "Average"
    else:
        rating = "Needs Improvement"

    return {
        "ats": ats,
        "rating": rating
    }