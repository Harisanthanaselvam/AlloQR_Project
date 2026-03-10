import { useState } from "react";
import { Link } from "react-router-dom";

import { registerPatient } from "../api";
import VoiceAssistant from "../components/VoiceAssistant";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  phone: "",
};

function RegistrationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };
      const response = await registerPatient(payload);
      setResult(response.data);
      setFormData(initialForm);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to register patient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <h2>Patient Registration</h2>
        <VoiceAssistant />
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
        <input
          placeholder="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          required
        />
        <input
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Patient Registered</h3>
          <p>Patient ID: {result.patient.patient_id}</p>
          <img
            className="qr-image"
            src={`http://localhost:8000${result.qr_code_url}`}
            alt="Patient QR"
          />
          <div className="actions">
            <Link to={`/dashboard/${result.patient.patient_id}`}>Open Dashboard</Link>
            <Link to={`/qr/${result.patient.patient_id}`}>QR Display</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default RegistrationPage;