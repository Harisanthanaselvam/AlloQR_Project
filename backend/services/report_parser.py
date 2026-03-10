from pathlib import Path

from pypdf import PdfReader
from PIL import Image
import pytesseract


class ReportExtractionError(Exception):
    pass


def extract_text_from_pdf(file_path: Path) -> str:
    try:
        reader = PdfReader(str(file_path))
        pages_text = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages_text).strip()
    except Exception as exc:
        raise ReportExtractionError(f"Failed to parse PDF: {exc}") from exc


def extract_text_from_image(file_path: Path) -> str:
    try:
        with Image.open(file_path) as image:
            return pytesseract.image_to_string(image).strip()
    except pytesseract.TesseractNotFoundError:
        return "Tesseract OCR tool not found on this system. Please install Tesseract-OCR manually to enable image-to-text extraction for medical reports."
    except Exception as exc:
        raise ReportExtractionError(
            f"Failed to parse image: {exc}. Ensure Tesseract OCR is installed and available in PATH."
        ) from exc


def extract_text(file_path: Path) -> str:
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        return extract_text_from_pdf(file_path)
    if suffix in {".jpg", ".jpeg", ".png"}:
        return extract_text_from_image(file_path)

    raise ReportExtractionError("Unsupported report format. Allowed: PDF, JPG, JPEG, PNG.")