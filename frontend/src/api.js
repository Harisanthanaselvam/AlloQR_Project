import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Patient endpoints
export const registerPatient = (patientData) => api.post('/register_patient', patientData);
export const getPatient = (patientId) => api.get(`/patient/${patientId}`);
export const getPatients = () => api.get('/patients');

// Report endpoints
export const uploadReport = (patientId, file) => {
  const formData = new FormData();
  formData.append('patient_id', patientId);
  formData.append('file', file);
  
  return api.post('/upload_report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};