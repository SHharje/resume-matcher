"""
skill_categories.py
-------------------
Maps skills into high-level categories for radar chart visualisation.
Each category groups related skills so the radar chart axes are meaningful.
"""

# ── Category definitions ──
# Each key is a radar-chart axis; the value is the set of skills that belong to it.
SKILL_CATEGORIES = {
    "Programming": {
        "python", "java", "javascript", "typescript", "c++", "c#", "go",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
        "bash", "perl", "lua", "dart", "elixir",
    },
    "ML & AI": {
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "transformers", "hugging face", "nlp", "computer vision",
        "opencv", "spacy", "nltk", "langchain", "mlflow", "onnx",
        "statistics", "mathematics", "research",
    },
    "Data Tools": {
        "sql", "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
        "jupyter", "statsmodels", "spark", "hadoop", "kafka", "airflow", "dbt",
        "etl", "data modeling", "data visualization",
        "excel", "power bi", "tableau", "google sheets",
        "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "cassandra", "dynamodb", "sqlite", "snowflake",
    },
    "Cloud & DevOps": {
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
        "ansible", "jenkins", "ci/cd", "linux", "nginx", "github actions",
        "monitoring", "networking", "security", "cuda",
        "microservices", "architecture",
    },
    "Web & Software": {
        "html", "css", "react", "angular", "vue", "next.js", "svelte",
        "tailwind css", "bootstrap", "sass", "webpack", "figma",
        "responsive design", "redux", "graphql",
        "node.js", "express", "fastapi", "django", "flask", "spring boot",
        "rest api", "grpc", "rabbitmq", "celery",
        "git", "jira", "confluence", "agile", "scrum",
    },
}

# Category display order (used by the frontend)
CATEGORY_ORDER = [
    "Programming",
    "ML & AI",
    "Data Tools",
    "Cloud & DevOps",
    "Web & Software",
]


def categorize_skills(skills: list[str]) -> dict[str, int]:
    """
    Count how many of the given *skills* fall into each category.

    Returns a dict like:
        {"Programming": 3, "ML & AI": 5, "Data Tools": 2, ...}
    """
    skills_lower = {s.lower() for s in skills}
    counts: dict[str, int] = {}

    for category in CATEGORY_ORDER:
        category_skills = SKILL_CATEGORIES[category]
        counts[category] = len(skills_lower & category_skills)

    return counts


def build_radar_data(
    resume_skills: list[str],
    job_skills: list[str],
) -> list[dict]:
    """
    Build radar-chart data comparing *resume_skills* against *job_skills*
    across all skill categories.

    Each entry contains:
      - category:  axis label
      - resume:    % of the category's job-required skills the resume covers (0-100)
      - job:       always 100 (the job defines the full requirement)
      - resumeCount: raw count of matching skills from the resume
      - jobCount:    raw count of skills the job requires in this category

    If a job has 0 skills in a category, both resume and job are set to 0
    (the axis is effectively hidden / neutral).
    """
    resume_set = {s.lower() for s in resume_skills}
    job_set = {s.lower() for s in job_skills}

    data: list[dict] = []

    for category in CATEGORY_ORDER:
        category_skills = SKILL_CATEGORIES[category]

        # How many skills does the job require in this category?
        job_in_cat = job_set & category_skills
        # How many of those does the resume have?
        resume_in_cat = resume_set & job_in_cat

        job_count = len(job_in_cat)
        resume_count = len(resume_in_cat)

        if job_count > 0:
            resume_pct = round((resume_count / job_count) * 100)
            job_pct = 100
        else:
            resume_pct = 0
            job_pct = 0

        data.append({
            "category": category,
            "resume": resume_pct,
            "job": job_pct,
            "resumeCount": resume_count,
            "jobCount": job_count,
        })

    return data
