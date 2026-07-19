# formatter.py

def resume_to_text(resume_data):

    lines = []

    skills = resume_data.get("skills", [])
    if skills:
        lines.append("Skills:")
        lines.extend(sorted(skills))
        lines.append("")


    experience = resume_data.get("experience", {})

    if experience:
        lines.append("Experience:")

        if experience.get("last_role"):
            lines.append(f"Last Role: {experience['last_role']}")

        if experience.get("last_company"):
            lines.append(f"Company: {experience['last_company']}")

        if experience.get("total_experience"):
            lines.append(
                f"Total Experience: {experience['total_experience']}"
            )

        lines.append("")


    education = resume_data.get("education", [])

    if education:
        lines.append("Education:")

        for edu in education:
            if edu.get("degree"):
                lines.append(f"Degree: {edu['degree']}")

            if edu.get("institution"):
                lines.append(f"Institution: {edu['institution']}")

            if edu.get("graduation_year"):
                lines.append(
                    f"Graduation Year: {edu['graduation_year']}"
                )

            if edu.get("cgpa"):
                lines.append(f"CGPA: {edu['cgpa']}")

            lines.append("")

   
    projects = resume_data.get("projects", [])

    if projects:
        lines.append("Projects:")

        for project in projects:
            if project.get("title"):
                lines.append(f"Title: {project['title']}")

            if project.get("description"):
                lines.append(
                    f"Description: {project['description']}"
                )

            skills = project.get("skills_contained", [])

            if skills:
                lines.append(
                    "Skills Used: " + ", ".join(sorted(skills))
                )

            lines.append("")

    return "\n".join(lines).strip()


def jd_to_text(jd_data):
    

    lines = []

    if jd_data.get("job_title"):
        lines.append(f"Job Title: {jd_data['job_title']}")

    if jd_data.get("company"):
        lines.append(f"Company: {jd_data['company']}")

    if jd_data.get("experience_required"):
        lines.append(
            f"Experience Required: {jd_data['experience_required']}"
        )

    if jd_data.get("education_required"):
        lines.append(
            f"Education Required: {jd_data['education_required']}"
        )

    skills = jd_data.get("skills_required", [])

    if skills:
        lines.append("Required Skills:")
        lines.extend(sorted(skills))

    return "\n".join(lines).strip()