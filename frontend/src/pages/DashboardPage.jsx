import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPatient } from "../api";

function DashboardPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatient(patientId);
        setPatient(response.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to fetch patient.");
      }
    };

    fetchPatient();
  }, [patientId]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!patient) {
    return <p>Loading patient dashboard...</p>;
  }

  return (
    <section className="card">
      <h2>Patient Dashboard</h2>
      <div className="patient-grid">
        <p><strong>ID:</strong> {patient.patient_id}</p>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
      </div>

      <div className="card-header">
        <h3>Medical Reports</h3>
        <Link to="/upload">Upload New Report</Link>
      </div>

      {patient.reports.length === 0 ? (
        <p>No reports uploaded yet.</p>
      ) : (
        <div className="report-list">
          {patient.reports.map((report) => (
            <article className="report-item" key={report.report_id}>
              <p>
                <strong>Report ID:</strong> {report.report_id}
              </p>
              <p>
                <a href={`http://localhost:8000${report.file_path}`} target="_blank" rel="noreferrer">
                  View Uploaded File
                </a>
              </p>
              <p><strong>AI Summary:</strong> {report.ai_summary}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardPage;