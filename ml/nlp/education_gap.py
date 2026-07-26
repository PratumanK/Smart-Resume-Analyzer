DEGREE_MAP = {
    # ----------------------------
    # Secondary Education
    # ----------------------------
    "class 10": "secondary",
    "10th": "secondary",
    "10th grade": "secondary",
    "matric": "secondary",
    "matriculation": "secondary",
    "secondary school certificate": "secondary",
    "ssc": "secondary",
    "class 10th (secondary school certificate / metric)": "secondary",

    # ----------------------------
    # Higher Secondary
    # ----------------------------
    "class 12": "higher_secondary",
    "12th": "higher_secondary",
    "12th grade": "higher_secondary",
    "intermediate": "higher_secondary",
    "higher secondary": "higher_secondary",
    "higher secondary certificate": "higher_secondary",
    "hsc": "higher_secondary",
    "class 12th (higher secondary certificate / intermediate)": "higher_secondary",

    # ----------------------------
    # Diploma
    # ----------------------------
    "diploma": "diploma",
    "diploma in engineering": "diploma",
    "polytechnic": "diploma",
    "diploma in computer applications": "diploma",
    "diploma in business administration": "diploma",
    "diploma in engineering (polytechnic)": "diploma",

    # ----------------------------
    # Bachelor's Degree
    # ----------------------------
    "b.tech": "bachelor",
    "btech": "bachelor",
    "bachelor of technology": "bachelor",
    "b.tech (bachelor of technology)": "bachelor",

    "b.e.": "bachelor",
    "b.e": "bachelor",
    "be": "bachelor",
    "bachelor of engineering": "bachelor",
    "b.e. (bachelor of engineering)": "bachelor",

    "b.sc": "bachelor",
    "bsc": "bachelor",
    "bachelor of science": "bachelor",
    "b.sc (bachelor of science)": "bachelor",

    "bca": "bachelor",
    "bachelor of computer applications": "bachelor",
    "bca (bachelor of computer applications)": "bachelor",

    "bba": "bachelor",
    "bachelor of business administration": "bachelor",
    "bba (bachelor of business administration)": "bachelor",

    "b.com": "bachelor",
    "bcom": "bachelor",
    "bachelor of commerce": "bachelor",
    "b.com (bachelor of commerce)": "bachelor",

    "b.a.": "bachelor",
    "b.a": "bachelor",
    "ba": "bachelor",
    "bachelor of arts": "bachelor",
    "b.a. (bachelor of arts)": "bachelor",

    # ----------------------------
    # Master's Degree
    # ----------------------------
    "m.tech": "master",
    "mtech": "master",
    "master of technology": "master",
    "m.tech (master of technology)": "master",

    "m.e.": "master",
    "m.e": "master",
    "me": "master",
    "master of engineering": "master",
    "m.e. (master of engineering)": "master",

    "m.sc": "master",
    "msc": "master",
    "master of science": "master",
    "m.sc (master of science)": "master",

    "mca": "master",
    "master of computer applications": "master",
    "mca (master of computer applications)": "master",

    "mba": "master",
    "master of business administration": "master",
    "mba (master of business administration)": "master",

    "m.com": "master",
    "mcom": "master",
    "master of commerce": "master",
    "m.com (master of commerce)": "master",

    "m.a.": "master",
    "m.a": "master",
    "ma": "master",
    "master of arts": "master",
    "m.a. (master of arts)": "master",

    # ----------------------------
    # Doctorate
    # ----------------------------
    "phd": "doctorate",
    "ph.d.": "doctorate",
    "ph.d": "doctorate",
    "doctor of philosophy": "doctorate",
    "ph.d. (doctor of philosophy)": "doctorate",

    # ----------------------------
    # Post Doctorate
    # ----------------------------
    "postdoc": "post_doctorate",
    "post doctoral fellowship": "post_doctorate",
    "post doctoral fellowship (postdoc)": "post_doctorate",
}
DEGREE_LEVEL = {
    "secondary": 0,
    "higher_secondary": 1,
    "diploma": 2,
    "bachelor": 3,
    "master": 4,
    "doctorate": 5,
    "post_doctorate": 6,
}

def normalize_degree(degree):

    if degree is None:
        return None

    degree = degree.lower().strip()

    return DEGREE_MAP.get(degree)
def highest_resume_degree(resume_education):

    highest = -1

    for entry in resume_education:

        degree = normalize_degree(entry["degree"])

        if degree is None:
            continue

        highest = max(highest, DEGREE_LEVEL[degree])

    return highest
def jd_degree_level(jd_degree):

    degree = normalize_degree(jd_degree)

    if degree is None:
        return None

    return DEGREE_LEVEL[degree]

def education_match(resume_education, jd_degree):

    resume_level = highest_resume_degree(resume_education)
    jd_level = jd_degree_level(jd_degree)
    matched=False
    score=0
    if resume_level == -1:
        return {
        "matched": False,
        "score": 0
    }
    if jd_level is None:
       return {
        "matched": True,
        "score": 100
    }

    if (resume_level >= jd_level):
        matched=True
        score=100
    return {
    "matched": matched,
    "score": score
}

