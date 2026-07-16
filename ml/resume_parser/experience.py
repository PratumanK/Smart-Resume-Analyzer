import re
from datetime import datetime
JOB_KEYWORDS = {
    "engineer",
    "developer",
    "intern",
    "analyst",
    "scientist",
    "manager",
    "consultant",
    "architect",
    "specialist",
    "associate",
    "designer",
    "administrator",
    "lead",
    "head",
    "director",
    "officer",
    "researcher",
    "programmer",
    "executive",
    "trainee",
    "sde",
    "swe",
    "mle"
    
}
SEPARATORS = ["|", ",", " - ","-"]


MONTHS = {
    "Jan": 1, "January": 1,
    "Feb": 2, "February": 2,
    "Mar": 3, "March": 3,
    "Apr": 4, "April": 4,
    "May": 5,
    "Jun": 6, "June": 6,
    "Jul": 7, "July": 7,
    "Aug": 8, "August": 8,
    "Sep": 9, "September": 9,
    "Oct": 10, "October": 10,
    "Nov": 11, "November": 11,
    "Dec": 12, "December": 12,
}

date_pattern = re.compile(
    r"(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|"
    r"Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)"
    r"\s+\d{4}\s*[-–]\s*"
    r"(?:Present|(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|"
    r"Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)"
    r"\s+\d{4})"
)
def looks_like_job_title(text):
    text = text.lower()
    return any(word in text for word in JOB_KEYWORDS)
def months_between(start, end):
    start_month, start_year = start.split()

    start_date = datetime(int(start_year), MONTHS[start_month], 1)

    if end.lower() == "present":

        end_date = datetime.today()
    else:
        end_month, end_year = end.split()
        end_date = datetime(int(end_year), MONTHS[end_month], 1)

    return max(
        0,
        (end_date.year - start_date.year) * 12
        + (end_date.month - start_date.month),
    )
def extract_experience(doc):

   
    
    if not doc.strip():
        return({
    "total_experience_months": 0,
    "total_experience_years": 0.0,
    "last_role": None,
    "last_company": None
     })
    total_months = 0
    last_role = None
    last_company = None

   
    
    lines = [line.strip() for line in doc.splitlines() if line.strip()]
    for i, line in enumerate(lines):

        match = date_pattern.search(line)

        if not match:
            continue

        date_range = match.group()

        start, end = [x.strip() for x in re.split(r"\s*[-–]\s*", date_range)]

        total_months += months_between(start, end)

        if last_role is None:
            candidate = lines[i - 1] if i >= 1 else ""
            for sep in SEPARATORS:
                if sep in candidate:
                    left, right = [x.strip() for x in candidate.split(sep, 1)]
                    if looks_like_job_title(left):
                        last_role = left
                        last_company = right
                    elif looks_like_job_title(right):
                        last_role = right
                        last_company = left
                    break
            
            if last_role is None:
                candidate1 = lines[i - 2] if i >= 2 else ""
                candidate2 = lines[i - 1] if i >= 1 else ""

                if looks_like_job_title(candidate1):
                    last_role = candidate1
                    last_company = candidate2
                elif looks_like_job_title(candidate2):
                    last_role = candidate2
                    last_company = candidate1
                else:
                    last_role = candidate2
                    last_company = candidate1

    return {
        "total_experience_months": total_months,
        "total_experience_years": round(total_months / 12, 1),
        "last_role": last_role,
        "last_company": last_company,
    }

    
        
    
    
    
    
   
