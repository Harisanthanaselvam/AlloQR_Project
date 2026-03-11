from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session, selectinload 

from backend.database import get_db
from backend.models import Patient
from backend.schemas import PatientCreate, PatientDetail, PatientOut, RegisterPatientResponse
from backend.services.qr_service import generate_patient_qr

router = APIRouter(tags=["patients"])

QR_DIR = Path("qrcodes")


@router.post("/register_patient", response_model=RegisterPatientResponse)
def register_patient(payload: PatientCreate, request: Request, db: Session = Depends(get_db)):
    patient = Patient(
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        phone=payload.phone,
        address=payload.address,
        medical_history=payload.medical_history,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # QR should point to the React frontend dashboard
    frontend_url = f"http://localhost:5173/patient/{patient.patient_id}"
    qr_filename = generate_patient_qr(patient.patient_id, frontend_url, QR_DIR)

    return RegisterPatientResponse(
        patient=patient,
        qr_code_url=f"/qrcodes/{qr_filename}",
        patient_url=frontend_url,
    )


@router.get("/patient/{patient_id}", response_model=PatientDetail, name="get_patient")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = (
        db.query(Patient)
        .options(selectinload(Patient.reports))
        .filter(Patient.patient_id == patient_id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/patients", response_model=list[PatientOut])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.patient_id.desc()).all()


@router.get("/scan/{patient_id}")
def scan_qr(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient:
        return RedirectResponse(url=f"http://localhost:5173/patient/{patient_id}", status_code=307)
    return RedirectResponse(url="http://localhost:5173/register", status_code=307)
