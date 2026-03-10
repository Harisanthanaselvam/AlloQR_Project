import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from models import Patient, Report
from schemas import ReportOut
from services.ai_summary import summarize_text
from services.report_parser import ReportExtractionError, extract_text

router = APIRouter(tags=["reports"])

UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


@router.post("/upload_report", response_model=ReportOut)
def upload_report(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, JPG, JPEG, PNG files are allowed")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{patient_id}_{uuid4().hex}{ext}"
    saved_path = UPLOAD_DIR / filename

    try:
        with saved_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    try:
        extracted_text = extract_text(saved_path)
        summary = summarize_text(extracted_text)
    except ReportExtractionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {exc}") from exc

    report = Report(
        patient_id=patient_id,
        file_path=f"/uploads/{filename}",
        ai_summary=summary,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return report


@router.get("/reports", response_model=list[ReportOut])
def list_all_reports(db: Session = Depends(get_db)):
    """Returns all medical reports stored in the system."""
    return db.query(Report).order_by(Report.uploaded_at.desc()).all()

