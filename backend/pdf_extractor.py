"""
pdf_extractor.py
----------------
Extracts and cleans text from a PDF file using PyMuPDF (fitz).
"""

import re
import fitz  # PyMuPDF


def extract_text_from_pdf(file_path: str) -> str:
    """
    Open a PDF at *file_path*, extract text from every page,
    join it together, clean up extra whitespace, and return
    a single clean string.
    """
    doc = fitz.open(file_path)
    full_text = ""

    for page in doc:
        full_text += page.get_text()

    doc.close()

    # Light cleaning: collapse multiple blank lines and extra spaces
    full_text = re.sub(r"\n{3,}", "\n\n", full_text)   # 3+ newlines → 2
    full_text = re.sub(r"[ \t]{2,}", " ", full_text)    # multiple spaces/tabs → 1
    full_text = full_text.strip()

    return full_text
