from sentence_transformers import SentenceTransformer
from resume_parser.pipeline import parse_resume
from resume_parser.jd_parser import parse_jd
from resume_parser.formatter import resume_to_text, jd_to_text

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def resume_embedding(resume_text):
  resume_embedding = model.encode(resume_text,convert_to_tensor=False)
  return resume_embedding 

def jd_embedding(jd_text):
  jd_embedding = model.encode(jd_text,convert_to_tensor=False)
  return jd_embedding 
