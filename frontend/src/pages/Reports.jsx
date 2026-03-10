import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { FileText, Calendar, User, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        console.error("Failed to fetch all reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.ai_summary.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.patient_id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <FileText className="text-blue-600" size={36} /> Medical AI Repositories
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Central hub for all AI-summarized clinical records.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by diagnosis or Patient ID..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredReports.map((report, idx) => (
                <motion.div
                  key={report.report_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group lg:flex gap-8 items-start"
                >
                  <div className="hidden lg:flex w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl items-center justify-center shrink-0 ring-8 ring-blue-50/30">
                    <FileText size={32} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                          <User size={14} className="text-slate-600" /> Patient #{report.patient_id}
                        </span>
                        <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                          <Calendar size={14} className="text-slate-600" /> {new Date(report.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a 
                        href={`http://127.0.0.1:8000${report.file_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                      >
                        VIEW ORIGINAL <ExternalLink size={14} />
                      </a>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-blue-500 relative">
                       <h4 className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-2">
                           AI SUMMARY ANALYSIS
                       </h4>
                       <p className="text-slate-700 leading-relaxed font-medium capitalize-first">{report.ai_summary}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredReports.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                <FileText size={64} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-bold text-slate-800">No matching reports found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Either you haven't uploaded any reports yet or your search criteria didn't match any exist clinical summaries.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
