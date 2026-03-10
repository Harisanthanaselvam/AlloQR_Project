import qrcode
import os

QR_DIR = "uploads/qr_codes"

# Ensure directory exists
os.makedirs(QR_DIR, exist_ok=True)

def generate_patient_qr(patient_id: int) -> str:
    """Generates a QR code for a patient and returns the file path."""
    # This URL points to the frontend patient dashboard.
    url = f"http://127.0.0.1:5174/patient/{patient_id}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    file_path = os.path.join(QR_DIR, f"{patient_id}.png")
    img.save(file_path)
    
    return file_path
