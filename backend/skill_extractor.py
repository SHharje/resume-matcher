"""
skill_extractor.py
------------------
Extracts technical skills from text via keyword matching against
a comprehensive hardcoded skills list.
"""

# ~100 common tech skills — lowercase for case-insensitive matching
SKILLS_LIST = [
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
    "bash", "perl", "lua", "dart", "elixir",

    # Web & frontend
    "html", "css", "react", "angular", "vue", "next.js", "svelte",
    "tailwind css", "bootstrap", "sass", "webpack", "figma",
    "responsive design", "redux", "graphql",

    # Backend & APIs
    "node.js", "express", "fastapi", "django", "flask", "spring boot",
    "rest api", "grpc", "rabbitmq", "celery",

    # Data & ML libraries
    "pandas", "numpy", "scipy", "scikit-learn", "matplotlib", "seaborn",
    "plotly", "jupyter", "statsmodels",

    # Machine learning & AI
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
    "transformers", "hugging face", "nlp", "computer vision", "opencv",
    "spacy", "nltk", "langchain", "mlflow", "onnx",

    # Databases
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "cassandra", "dynamodb", "sqlite", "snowflake",

    # Big data & pipelines
    "spark", "hadoop", "kafka", "airflow", "dbt", "etl", "data modeling",

    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "ansible", "jenkins", "ci/cd", "linux", "nginx", "github actions",

    # Other tools & concepts
    "git", "jira", "confluence", "agile", "scrum",
    "data visualization", "statistics", "mathematics",
    "excel", "power bi", "tableau", "google sheets",
    "cuda", "networking", "security", "monitoring",
    "microservices", "architecture", "research",
]


def extract_skills(text: str) -> list[str]:
    """
    Given a block of text, return a deduplicated list of skills
    that appear anywhere in the text (case-insensitive).
    """
    text_lower = text.lower()
    found_skills: list[str] = []

    for skill in SKILLS_LIST:
        if skill in text_lower and skill not in found_skills:
            found_skills.append(skill)

    return found_skills
