from pathlib import Path

import qrcode


def generate_patient_qr(patient_id: int, patient_url: str, output_dir: Path) -> str:
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"patient_{patient_id}.png"
    filepath = output_dir / filename

    qr_img = qrcode.make(patient_url)
    qr_img.save(filepath)

    return filename