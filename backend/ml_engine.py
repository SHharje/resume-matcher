"""
ml_engine.py
------------
Loads the sentence-transformer model once at import time and exposes
functions for computing semantic similarity and skill-gap analysis.
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load the model once at startup (not per request)
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_similarity(resume_text: str, job_description: str) -> float:
    """
    Convert *resume_text* and *job_description* into embeddings,
    compute cosine similarity, and return a match percentage (0-100).
    """
    embeddings = model.encode([resume_text, job_description])
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return round(float(similarity) * 100, 2)


def analyse_skill_gap(
    resume_skills: list[str],
    job_skills: list[str],
) -> dict[str, list[str]]:
    """
    Compare *resume_skills* against *job_skills* and return a dict with:
      - matching_skills: skills present in both lists
      - missing_skills:  skills required by the job but absent from the resume
    """
    resume_set = set(s.lower() for s in resume_skills)
    job_set = set(s.lower() for s in job_skills)

    matching = sorted(resume_set & job_set)
    missing = sorted(job_set - resume_set)

    return {
        "matching_skills": matching,
        "missing_skills": missing,
    }
