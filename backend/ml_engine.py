"""
ml_engine.py
------------
Lightweight similarity engine using TF-IDF + cosine similarity (sklearn).
Replaces sentence-transformers + torch to stay within Render's 512MB free tier.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(resume_text: str, job_description: str) -> float:
    """
    Convert resume_text and job_description into TF-IDF vectors,
    compute cosine similarity, and return a match percentage (0-100).
    """
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    return round(float(similarity) * 100, 2)


def analyse_skill_gap(
    resume_skills: list[str],
    job_skills: list[str],
) -> dict[str, list[str]]:
    """
    Compare resume_skills against job_skills and return a dict with:
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
