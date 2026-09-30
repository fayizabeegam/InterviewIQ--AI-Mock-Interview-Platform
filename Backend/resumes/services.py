from pathlib import Path

from pypdf import PdfReader
from docx import Document
from rest_framework.exceptions import ValidationError


def extract_pdf_text(file_path):
    reader = PdfReader(file_path)

    text = []

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text.append(page_text)

    return "\n".join(text)


def extract_docx_text(file_path):
    document = Document(file_path)

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n".join(paragraphs)


def extract_resume_text(resume):
    file_path = resume.resume_file.path

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        text = extract_pdf_text(file_path)

    elif extension == ".docx":
        text = extract_docx_text(file_path)

    else:
        raise ValidationError(
            {"resume_file": "Unsupported resume format."}
        )

    if not text.strip():
        raise ValidationError(
            {
                "resume_file":
                "Could not extract text from the resume."
            }
        )

    return text.strip()