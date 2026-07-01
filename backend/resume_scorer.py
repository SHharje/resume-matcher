"""
resume_scorer.py
----------------
Heuristic-based resume quality scorer.
Rates a resume across four categories — each out of 10 — and produces
a total score out of 100 with a letter grade.
"""

import re

# ── Action verbs / experience-related phrases ──
EXPERIENCE_KEYWORDS = [
    "years of experience", "years experience", "year experience",
    "led", "managed", "developed", "built", "designed", "implemented",
    "architected", "optimised", "optimized", "delivered", "collaborated",
    "mentored", "supervised", "coordinated", "executed", "launched",
    "maintained", "improved", "reduced", "increased", "created",
    "established", "streamlined", "automated", "scaled", "deployed",
    "contributed", "spearheaded", "initiated", "transformed", "achieved",
    "negotiated", "resolved", "analysed", "analyzed", "engineered",
    "integrated", "migrated", "refactored", "tested", "debugged",
    "published", "presented", "trained", "hired", "onboarded",
]

# ── Education-related terms ──
EDUCATION_KEYWORDS = [
    "bachelor", "bachelors", "bachelor's", "b.sc", "b.s.", "b.a.",
    "master", "masters", "master's", "m.sc", "m.s.", "m.a.", "mba",
    "phd", "ph.d", "doctorate", "doctoral",
    "degree", "diploma", "certificate", "certification", "certified",
    "university", "college", "institute", "school",
    "gpa", "cgpa", "coursework", "thesis", "dissertation",
    "honours", "honors", "cum laude", "magna cum laude", "summa cum laude",
    "graduate", "undergraduate", "postgraduate",
]

# ── Section headings that indicate a well-structured resume ──
SECTION_PATTERNS = {
    "contact": [
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",   # email
        r"(\+?\d[\d\s\-().]{7,}\d)",                            # phone
    ],
    "experience": [
        r"\b(experience|work\s*history|employment|professional\s*experience)\b",
    ],
    "education": [
        r"\b(education|academic|qualifications?)\b",
    ],
    "skills": [
        r"\b(skills?|technical\s*skills?|technologies|proficiencies)\b",
    ],
    "summary": [
        r"\b(summary|objective|profile|about\s*me|overview)\b",
    ],
}


def _score_skills_depth(skills: list[str]) -> dict:
    """Score based on how many distinct skills were extracted."""
    count = len(skills)
    if count >= 15:
        score = 10
    elif count >= 10:
        score = 8
    elif count >= 6:
        score = 6
    elif count >= 3:
        score = 4
    else:
        score = 2

    return {
        "score": score,
        "max": 10,
        "details": f"{count} skill{'s' if count != 1 else ''} detected",
    }


def _score_experience_keywords(text_lower: str) -> dict:
    """Score based on unique experience-related action verbs found."""
    found = []
    for kw in EXPERIENCE_KEYWORDS:
        if kw in text_lower and kw not in found:
            found.append(kw)

    count = len(found)
    if count >= 15:
        score = 10
    elif count >= 12:
        score = 9
    elif count >= 9:
        score = 8
    elif count >= 7:
        score = 7
    elif count >= 5:
        score = 6
    elif count >= 3:
        score = 4
    elif count >= 1:
        score = 2
    else:
        score = 0

    return {
        "score": score,
        "max": 10,
        "details": f"{count} action verb{'s' if count != 1 else ''} found",
    }


def _score_education_keywords(text_lower: str) -> dict:
    """Score based on unique education-related terms found."""
    found = []
    for kw in EDUCATION_KEYWORDS:
        if kw in text_lower and kw not in found:
            found.append(kw)

    count = len(found)
    if count >= 8:
        score = 10
    elif count >= 6:
        score = 8
    elif count >= 4:
        score = 6
    elif count >= 2:
        score = 4
    elif count >= 1:
        score = 2
    else:
        score = 0

    return {
        "score": score,
        "max": 10,
        "details": f"{count} education term{'s' if count != 1 else ''} found",
    }


def _score_completeness(text: str) -> dict:
    """Score based on how many standard resume sections are detected."""
    text_lower = text.lower()
    sections_found = 0

    for _section_name, patterns in SECTION_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                sections_found += 1
                break  # only count each section once

    total_sections = len(SECTION_PATTERNS)
    score = min(sections_found * 2, 10)

    return {
        "score": score,
        "max": 10,
        "details": f"{sections_found}/{total_sections} sections detected",
    }


def _letter_grade(total: int) -> str:
    """Convert a 0-100 score to a letter grade."""
    if total >= 95:
        return "A+"
    elif total >= 85:
        return "A"
    elif total >= 75:
        return "B+"
    elif total >= 65:
        return "B"
    elif total >= 55:
        return "C+"
    elif total >= 45:
        return "C"
    elif total >= 30:
        return "D"
    else:
        return "F"


def score_resume(text: str, skills: list[str]) -> dict:
    """
    Analyse resume text and return quality scores.

    Returns a dict with four category scores (each out of 10),
    a total score out of 100, and a letter grade.
    """
    text_lower = text.lower()

    skills_depth = _score_skills_depth(skills)
    experience = _score_experience_keywords(text_lower)
    education = _score_education_keywords(text_lower)
    completeness = _score_completeness(text)

    raw_sum = (
        skills_depth["score"]
        + experience["score"]
        + education["score"]
        + completeness["score"]
    )
    # Scale from /40 to /100
    total = round(raw_sum * 2.5)

    return {
        "skills_depth": skills_depth,
        "experience_keywords": experience,
        "education_keywords": education,
        "resume_completeness": completeness,
        "total_score": total,
        "max_score": 100,
        "grade": _letter_grade(total),
    }
