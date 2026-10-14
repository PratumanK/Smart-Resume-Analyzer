
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile

from nlp.main import complete_analysis

app = FastAPI(
    title="Resume Analyzer AI Service",
    description="Analyzes a resume against a job description.",
    version="1.0.0",
)


@app.get("/")
def health_check():
    return {
        "message": "Resume Analyzer AI Service is running"
    }


@app.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jobDescription: UploadFile = File(...),
):
    # Basic filename validation
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file.",
        )

    if (
        not jobDescription.filename
        or not jobDescription.filename.lower().endswith(".pdf")
    ):
        raise HTTPException(
            status_code=400,
            detail="Job description must be a PDF file.",
        )

    # Store uploaded PDFs temporarily inside ml/
    temp_dir = Path(__file__).resolve().parent / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)

    resume_path = None
    jd_path = None

    try:
        # Create unique temporary files for concurrent requests
        with tempfile.NamedTemporaryFile(
            suffix=".pdf",
            dir=temp_dir,
            delete=False,
        ) as resume_temp:
            resume_path = Path(resume_temp.name)
            resume_temp.write(await resume.read())

        with tempfile.NamedTemporaryFile(
            suffix=".pdf",
            dir=temp_dir,
            delete=False,
        ) as jd_temp:
            jd_path = Path(jd_temp.name)
            jd_temp.write(await jobDescription.read())

        # Call the existing AI pipeline
        result = complete_analysis(
            str(resume_path),
            str(jd_path),
        )

        return result

    except HTTPException:
        raise

    except Exception as e:
     import traceback
     traceback.print_exc()

     raise HTTPException(
        status_code=500,
        detail=f"{type(e).__name__}: {e}"
     )

    finally:
        # Delete temporary files, even if analysis fails
        for path in (resume_path, jd_path):
            if path is not None:
                path.unlink(missing_ok=True)

        await resume.close()
        await jobDescription.close()
