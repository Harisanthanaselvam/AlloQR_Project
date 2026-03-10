from datetime import datetime
from pydantic import BaseModel, Field


class ReportOut(BaseModel):
    report_id: int
    patient_id: int
    file_path: str
    ai_summary: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class PatientCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=0, le=130)
    gender: str = Field(..., min_length=1, max_length=20)
    phone: str = Field(..., min_length=7, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    medical_history: str | None = Field(default=None)


class PatientOut(BaseModel):
    patient_id: int
    name: str
    age: int
    gender: str
    phone: str
    address: str | None = None
    medical_history: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PatientDetail(PatientOut):
    reports: list[ReportOut] = Field(default_factory=list)


class RegisterPatientResponse(BaseModel):
    patient: PatientOut
    qr_code_url: str
    patient_url: str
