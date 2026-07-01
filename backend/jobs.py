"""
jobs.py
-------
Acts as the application's database. Contains a list of job dictionaries,
each with a title, description, and required_skills list.
"""

jobs = [
    {
        "title": "Data Scientist",
        "description": (
            "Analyse large datasets to extract actionable insights and build predictive models. "
            "Design and run A/B tests, create dashboards, and communicate findings to stakeholders. "
            "Collaborate with engineering teams to deploy models into production pipelines. "
            "Strong statistical reasoning and storytelling with data are essential."
        ),
        "required_skills": [
            "python", "sql", "pandas", "numpy", "scikit-learn",
            "statistics", "matplotlib", "seaborn", "jupyter",
            "machine learning", "data visualization", "r"
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "description": (
            "Design, build, and maintain scalable machine learning systems end-to-end. "
            "Optimise model training pipelines, manage experiment tracking, and ensure reproducibility. "
            "Work closely with data scientists to take prototypes from notebooks to production-grade services. "
            "Experience with MLOps tooling and cloud infrastructure is highly valued."
        ),
        "required_skills": [
            "python", "tensorflow", "pytorch", "scikit-learn", "docker",
            "kubernetes", "aws", "mlflow", "sql", "git",
            "machine learning", "deep learning", "linux"
        ],
    },
    {
        "title": "Backend Developer",
        "description": (
            "Build and maintain robust RESTful APIs and microservices that power web and mobile applications. "
            "Design database schemas, write efficient queries, and implement authentication and authorization. "
            "Ensure high availability, low latency, and strong security across all backend services. "
            "Participate in code reviews, on-call rotations, and continuous integration workflows."
        ),
        "required_skills": [
            "python", "fastapi", "django", "flask", "sql",
            "postgresql", "redis", "docker", "git", "rest api",
            "linux", "aws", "ci/cd"
        ],
    },
    {
        "title": "NLP Engineer",
        "description": (
            "Develop natural language processing pipelines for tasks like text classification, "
            "named entity recognition, sentiment analysis, and question answering. "
            "Fine-tune large language models and evaluate their performance with rigorous metrics. "
            "Stay current with the latest research in transformers and generative AI."
        ),
        "required_skills": [
            "python", "nlp", "spacy", "transformers", "pytorch",
            "tensorflow", "hugging face", "deep learning", "machine learning",
            "pandas", "numpy", "git", "linux"
        ],
    },
    {
        "title": "Data Analyst",
        "description": (
            "Transform raw data into clear, compelling reports and interactive dashboards. "
            "Write complex SQL queries to pull data from multiple sources and clean it for analysis. "
            "Identify trends, anomalies, and opportunities that drive business decisions. "
            "Present findings to non-technical audiences with clarity and confidence."
        ),
        "required_skills": [
            "sql", "excel", "python", "tableau", "power bi",
            "pandas", "data visualization", "statistics",
            "google sheets", "r", "jupyter"
        ],
    },
    {
        "title": "Computer Vision Engineer",
        "description": (
            "Design and implement image and video processing pipelines for object detection, "
            "segmentation, and recognition tasks. Train and fine-tune convolutional and "
            "vision-transformer models on large-scale datasets. Optimise inference speed for "
            "real-time deployment on edge devices. Collaborate with product teams to integrate "
            "vision capabilities into user-facing features."
        ),
        "required_skills": [
            "python", "opencv", "pytorch", "tensorflow", "computer vision",
            "deep learning", "numpy", "cuda", "docker",
            "machine learning", "linux", "git"
        ],
    },
    {
        "title": "Full Stack Developer",
        "description": (
            "Build end-to-end web applications spanning frontend interfaces and backend services. "
            "Create responsive, accessible UIs using modern JavaScript frameworks and connect them "
            "to RESTful or GraphQL APIs. Manage cloud deployments and CI/CD pipelines. "
            "Write tests at every layer to ensure reliability and maintainability."
        ),
        "required_skills": [
            "javascript", "typescript", "react", "next.js", "node.js",
            "html", "css", "tailwind css", "sql", "postgresql",
            "git", "docker", "rest api", "aws"
        ],
    },
    {
        "title": "DevOps Engineer",
        "description": (
            "Automate infrastructure provisioning, deployment, and monitoring across cloud environments. "
            "Build and maintain CI/CD pipelines that enable rapid, reliable releases. "
            "Implement container orchestration, infrastructure-as-code, and observability tooling. "
            "Collaborate with development teams to improve system reliability and developer productivity."
        ),
        "required_skills": [
            "docker", "kubernetes", "aws", "terraform", "linux",
            "ci/cd", "git", "python", "bash", "jenkins",
            "monitoring", "networking", "ansible"
        ],
    },
    {
        "title": "Frontend Developer",
        "description": (
            "Craft performant, accessible, and visually polished user interfaces for web applications. "
            "Translate design mockups into pixel-perfect components using modern frameworks. "
            "Optimise bundle sizes, implement lazy loading, and ensure cross-browser compatibility. "
            "Work closely with designers and backend engineers to deliver seamless user experiences."
        ),
        "required_skills": [
            "javascript", "typescript", "react", "next.js", "html",
            "css", "tailwind css", "figma", "git",
            "responsive design", "redux", "webpack"
        ],
    },
    {
        "title": "Data Engineer",
        "description": (
            "Design and build reliable data pipelines that ingest, transform, and serve data at scale. "
            "Architect data warehouses and lakes using modern cloud-native tools. "
            "Ensure data quality, lineage, and governance across the organisation. "
            "Partner with analysts and scientists to make data accessible and trustworthy."
        ),
        "required_skills": [
            "python", "sql", "spark", "airflow", "aws",
            "kafka", "postgresql", "docker", "git",
            "data modeling", "etl", "linux", "snowflake"
        ],
    },
    {
        "title": "AI Research Scientist",
        "description": (
            "Conduct original research in artificial intelligence and publish findings at top venues. "
            "Prototype novel architectures and training strategies for deep neural networks. "
            "Mentor junior researchers and contribute to the broader research community. "
            "Translate cutting-edge research into practical applications that advance company products."
        ),
        "required_skills": [
            "python", "pytorch", "tensorflow", "deep learning",
            "machine learning", "mathematics", "statistics",
            "numpy", "research", "nlp", "computer vision", "git"
        ],
    },
    {
        "title": "Cloud Solutions Architect",
        "description": (
            "Design secure, scalable, and cost-effective cloud architectures for enterprise workloads. "
            "Evaluate and recommend cloud services across compute, storage, networking, and AI/ML. "
            "Lead migration strategies from on-premise to cloud-native environments. "
            "Establish best practices for security, compliance, and disaster recovery."
        ),
        "required_skills": [
            "aws", "azure", "gcp", "terraform", "docker",
            "kubernetes", "networking", "linux", "security",
            "ci/cd", "python", "architecture"
        ],
    },
]
