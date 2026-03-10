# 🏥 AlloQR – AI-Powered Healthcare Portal

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![AI](https://img.shields.io/badge/AI-Transformers-FFD21E?style=flat&logo=huggingface)](https://huggingface.co/models)

**AlloQR** is a sophisticated full-stack healthcare application designed to streamline patient registration and medical report management. By combining **QR technology** with **State-of-the-Art AI (HuggingFace Transformers)**, AlloQR provides an automated workflow for digitizing and summarizing medical records.

---

## ✨ Key Features

- 📝 **Smart Patient Registration**: capture demographic details and instantly generate a unique patient QR code.
- 🔍 **QR-Linked Dashboards**: Scan a patient's QR code to jump directly to their clinical history and reports.
- 📁 **Seamless Report Management**: Upload medical reports in multiple formats (PDF, JPG, PNG).
- 🤖 **AI Clinical Summarizer**: Integrated `distilbart-cnn` transformer model automatically extracts and summarizes complex medical text into concise clinical notes.
- 🎙️ **Voice-Activated Navigation**: Built-in voice assistant allows hands-free navigation (e.g., *"Register patient"*, *"Show home"*).
- 💎 **Premium UI/UX**: Modern glassmorphism design, polished indigo/slate theme, and responsive layouts.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Axios, Lucide Icons, Web Speech API |
| **Backend** | FastAPI (Python 3.9+), SQLAlchemy ORM |
| **Database** | SQLite (Default) / PostgreSQL (Optional) |
| **AI/ML** | HuggingFace Transformers, PyTorch, Tesseract OCR |
| **OCR/Parsing** | `pypdf` (PDF Extraction), `pytesseract` (Image OCR) |

---

## 🚀 Getting Started

### Prerequisites

1.  **Python 3.9+** & **Node.js 16+**
2.  **Tesseract OCR**: Required for image-to-text extraction.
    - *Windows:* [Tesseract at UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
    - *Linux:* `sudo apt install tesseract-ocr`
3.  **PostgreSQL** (Optional): SQLite is used by default for a zero-config setup.

---

### 1. Backend Installation

Navigate to the `backend` folder and set up the environment:

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate # Unix

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```
> [!TIP]
> The API documentation will be available at `http://localhost:8000/docs`.

---

### 2. Frontend Installation

Navigate to the `frontend` folder and install dependencies:

```bash
cd frontend

# Install packages
npm install

# Start development server
npm run dev
```
> [!NOTE]
> The application will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```text
savemom/
├── backend/
│   ├── main.py            # FastAPI entry point
│   ├── database.py        # SQLAlchemy configuration
│   ├── models.py          # Database schemas
│   ├── routes/            # API endpoints (patients, reports)
│   ├── services/          # Business logic (AI summary, OCR, QR)
│   ├── uploads/           # Stored medical reports
│   └── qrcodes/           # Generated patient QR codes
└── frontend/
    ├── src/
    │   ├── pages/         # Dashboard, Registration, Upload
    │   ├── components/    # Reusable UI components
    │   └── api.js         # Axios API client
    └── package.json       # React dependencies
```

---

## 📖 Usage Guide

1.  **Register**: Go to the **Register** page to add a new patient.
2.  **QR Code**: Once registered, go to the patient dashboard to view/print their unique QR code.
3.  **Upload**: Upload a medical PDF or Image in the **Upload Report** section.
4.  **AI Summary**: The system will automatically parse the file, run it through the Transformer model, and present a summary on the dashboard within seconds.
5.  **Voice Control**: Click the microphone icon and speak commands to navigate the portal.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ for the healthcare community.*
