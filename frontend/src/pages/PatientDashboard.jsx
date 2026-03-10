import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, User, Calendar, Phone, Activity, Upload, MapPin, HeartPulse, ChevronRight, FileSymlink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const PatientDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patient/${id}`);
        setPatient(response.data);
      } catch (err) {
        setError('Failed to load patient data. They may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error || !patient) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-red-100">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Patient Not Found</h3>
        <p className="text-slate-500 mb-6">{error || 'The requested patient profile does not exist.'}</p>
        <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
          Return Home
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="h-24 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6 gap-6">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center border-4 border-white shrink-0 overflow-hidden">
                  {/* QR Code as Avatar */}
                  <img
                    src={`http://127.0.0.1:8000/qrcodes/patient_${patient.patient_id}.png`}
                    alt="Patient QR Code"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-slate-900 capitalize">{patient.name}</h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                      ID: {patient.patient_id}
                    </span>
                  </div>
                  <p className="text-slate-500 flex items-center gap-2">
                    <User size={16} /> {patient.age} yrs • <span className="capitalize">{patient.gender}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/patient/${patient.patient_id}/upload`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20 shrink-0"
              >
                <Upload size={18} /> Upload Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 mt-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500"><Phone size={20} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-slate-700 font-medium">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-slate-700 font-medium">{patient.address || 'No address provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="p-3 bg-white rounded-xl shadow-sm text-purple-500"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Registered</p>
                  <p className="text-slate-700 font-medium">{new Date(patient.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {patient.medical_history && (
              <div className="mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-500 shrink-0"><HeartPulse size={20} /></div>
                <div>
                  <p className="text-sm font-semibold text-rose-800 mb-1">Medical Background</p>
                  <p className="text-rose-600/90 text-sm leading-relaxed">{patient.medical_history}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Medical Reports</h2>
          </div>

          {patient.reports && patient.reports.length > 0 ? (
            <div className="grid gap-6">
              <AnimatePresence>
                {patient.reports.map((report, index) => (
                  <motion.div
                    key={report.report_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all bg-white"
                  >
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">Report #{report.report_id}</h3>
                          <p className="text-sm text-slate-500">{new Date(report.uploaded_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <a
                        href={`http://127.0.0.1:8000${report.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors self-start md:self-auto"
                      >
                        <FileSymlink size={16} /> View Document
                      </a>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-emerald-400"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-emerald-500" />
                        <h4 className="font-bold text-slate-700 text-sm tracking-wide uppercase">AI Extracted Summary</h4>
                      </div>
                      <p id="latest-report-summary" className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {report.ai_summary || "Processing AI summary..."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <FileText size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No Reports Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">Upload medical reports, prescriptions, or lab results to generate AI summaries.</p>
              <button
                onClick={() => navigate(`/patient/${patient.patient_id}/upload`)}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-all"
              >
                Upload First Report <ChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
