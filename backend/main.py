from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import Base, engine
from backend.routes.patients import router as patients_router
from backend.routes.reports import router as reports_router
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AlloQR API",
    description="QR-Based Patient Registration and AI Medical Report Summary System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for folder in ["uploads", "qrcodes"]:
    Path(folder).mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/qrcodes", StaticFiles(directory="qrcodes"), name="qrcodes")

app.include_router(patients_router)
app.include_router(reports_router)


@app.get("/")
def health_check():
    return {"message": "AlloQR backend is running"}
