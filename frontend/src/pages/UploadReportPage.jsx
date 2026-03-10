import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadReport } from "../api";

function UploadReportPage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!patientId || !file) {
      setError("Patient ID and report file are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("file", file);

    try {
      await uploadReport(formData);
      navigate(`/dashboard/${patientId}`);
    } catch (err) {
      setError(err?.response?.data?.detail || "Report upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Upload Medical Report</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload and Summarize"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default UploadReportPage;