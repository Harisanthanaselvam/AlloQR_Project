import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPatient } from "../api";

function QRPage() {
  const { patientId } = useParams();
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const checkPatient = async () => {
      try {
        await getPatient(patientId);
        setExists(true);
      } catch (_err) {
        setExists(false);
      }
    };
    checkPatient();
  }, [patientId]);

  if (!exists) {
    return (
      <section className="card">
        <h2>QR Code</h2>
        <p className="error">Patient does not exist.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Patient QR Code</h2>
      <img
        className="qr-image"
        src={`http://localhost:8000/qrcodes/patient_${patientId}.png`}
        alt={`Patient ${patientId} QR`}
      />
      <p>Scan target: http://localhost:8000/scan/{patientId}</p>
    </section>
  );
}

export default QRPage;