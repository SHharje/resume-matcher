"""
main.py
-------
FastAPI server for Resume Matcher.
Provides health-check, jobs listing, and resume-matching endpoints.
"""

import os
import tempfile

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from jobs import jobs
from pdf_extractor import extract_text_from_pdf
from skill_extractor import extract_skills
from ml_engine import calculate_similarity, analyse_skill_gap
from resume_scorer import score_resume
from skill_categories import build_radar_data

app = FastAPI(title="Resume Matcher API")

# --------------- CORS ---------------
origins = [
    "http://localhost:3000",
    "https://resume-matcher-7449.onrender.com",
    "https://resume-matcher-two-iota.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------- Routes ---------------


@app.get("/")
def health_check():
    """Simple health-check endpoint."""
    return {"message": "Resume Matcher API is running!"}


@app.get("/jobs")
def get_jobs():
    """Return the full list of job descriptions."""
    return jobs


@app.post("/match")
async def match_resume(file: UploadFile = File(...)):
    """
    Receive a PDF resume, extract text & skills, compare against
    every job using semantic similarity + skill-gap analysis,
    and return the top 5 matches.
    """
    # Save the uploaded PDF to a temporary file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        contents = await file.read()
        tmp.write(contents)
        tmp.close()

        # Extract text from the PDF
        resume_text = extract_text_from_pdf(tmp.name)

        # Extract skills from the resume text
        resume_skills = extract_skills(resume_text)

        # Score the resume itself
        resume_score = score_resume(resume_text, resume_skills)

        # Score every job
        results = []
        for job in jobs:
            skill_gap = analyse_skill_gap(resume_skills, job["required_skills"])
            radar_data = build_radar_data(resume_skills, job["required_skills"])

            # --- Blended match score ---
            # 70% skill overlap: how many required skills does the resume cover?
            n_required = len(job["required_skills"])
            n_matching = len(skill_gap["matching_skills"])
            skill_score = (n_matching / n_required * 100) if n_required > 0 else 0

            # 30% text similarity: TF-IDF cosine (raw ~0-0.3), scaled to 0-100
            raw_tfidf = calculate_similarity(resume_text, job["description"])
            text_score = min(raw_tfidf * 5, 100)   # scale up, cap at 100

            match_percentage = round(skill_score * 0.7 + text_score * 0.3, 1)

            results.append({
                "title": job["title"],
                "match_percentage": match_percentage,
                "matching_skills": skill_gap["matching_skills"],
                "missing_skills": skill_gap["missing_skills"],
                "radar_data": radar_data,
            })

        # Sort by match percentage (highest first) and keep top 5
        results.sort(key=lambda r: r["match_percentage"], reverse=True)
        top_results = results[:5]

    finally:
        # Clean up the temporary file
        os.unlink(tmp.name)

    return {"results": top_results, "score_card": resume_score}
