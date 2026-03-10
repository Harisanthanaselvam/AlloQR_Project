import os
import pdfplumber
import pytesseract
from PIL import Image
from transformers import pipeline
import warnings

warnings.filterwarnings('ignore')

# Load the summarization pipeline lazily
summarizer = None

def get_summarizer():
    global summarizer
    if summarizer is None:
        # Using a small summarizer for demonstration purposes
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    return summarizer

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text

def extract_text_from_image(file_path: str) -> str:
    try:
        # User needs Tesseract installed on system for this to work
        text = pytesseract.image_to_string(Image.open(file_path))
        return text
    except Exception as e:
        print(f"Error extracting Image: {e}")
        return ""

def generate_summary(text: str) -> str:
    if not text or len(text.strip()) < 50:
        return "Not enough text found in the report to generate an AI summary."
    
    # Truncate text to avoid model max length limitations
    truncated_text = text[:3000] 
    
    try:
        summarizer_model = get_summarizer()
        max_len = min(130, max(30, len(truncated_text) // 4))
        min_len = min(30, max_len // 2) if max_len > 30 else 5
        
        summary = summarizer_model(truncated_text, max_length=max_len, min_length=min_len, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Summarizer error: {e}")
        return "Failed to generate AI summary."

def process_file_and_summarize(file_path: str) -> str:
    ext = file_path.lower().split('.')[-1]
    
    if ext == 'pdf':
        text = extract_text_from_pdf(file_path)
    elif ext in ['jpg', 'jpeg', 'png']:
        text = extract_text_from_image(file_path)
    else:
        return "Unsupported file format for AI text extraction."
        
    return generate_summary(text)
