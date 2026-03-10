import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, File, CheckCircle, ArrowLeft, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadReport } from '../api';

const UploadReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, generating, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage("Only PDF, JPG, and PNG files are allowed.");
      return;
    }
    
    setErrorMessage('');
    setFile(selectedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setUploadState('uploading');
      // For this app, backend does summarization instantly upon upload
      setUploadState('generating');
      
      await uploadReport(id, file);
      
      setUploadState('success');
      setTimeout(() => {
        navigate(`/patient/${id}`);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setUploadState('error');
      setErrorMessage("Failed to upload or summarize. The AI process encountered an error.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-200 bg-slate-100 text-slate-700 rounded-xl mb-6 transition-colors font-medium"
          onClick={() => navigate(`/patient/${id}`)}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
        >
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mb-10 -ml-10"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner text-white">
                <Upload size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Upload Medical Report</h2>
              <p className="text-blue-50 text-sm max-w-sm mx-auto">Upload a PDF or image of the medical report for Patient ID #{id}. Our AI will extract data and generate a summary.</p>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {errorMessage && uploadState !== 'success' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-start gap-3"
                >
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {uploadState === 'idle' || uploadState === 'error' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div 
                  className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  
                  {!file ? (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 mb-4 border border-slate-100">
                        <Upload size={32} />
                      </div>
                      <p className="text-lg font-semibold text-slate-700 mb-2">Click or drag file to upload</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">Supported formats: PDF, JPG, PNG (Max size: 10MB)</p>
                      <span className="inline-flex px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm">
                        Browse Files
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 ring-8 ring-blue-50">
                        <File size={32} />
                      </div>
                      <p className="text-lg font-bold text-slate-800 break-all px-4">{file.name}</p>
                      <p className="text-sm text-slate-500 font-medium mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-blue-200">
                        Choose a different file
                      </button>
                    </div>
                  )}
                </div>

                <motion.button 
                  whileHover={file ? { scale: 1.02 } : {}}
                  whileTap={file ? { scale: 0.98 } : {}}
                  className={`w-full mt-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-lg ${
                    file 
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 shadow-blue-500/30' 
                      : 'bg-slate-300 cursor-not-allowed shadow-none'
                  }`}
                  onClick={handleSubmit}
                  disabled={!file}
                >
                  <Sparkles size={20} /> Upload & Generate AI Summary
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                {uploadState === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                      <Upload size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Uploading Document...</h3>
                    <p className="text-slate-500">Securely transferring your file.</p>
                  </div>
                )}
                
                {uploadState === 'generating' && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-8">
                      <motion.div 
                        className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 text-white"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Bot size={48} />
                      </motion.div>
                      <motion.div 
                        className="absolute -top-2 -right-2 text-yellow-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Sparkles size={32} />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">AI Analyzing...</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Extracting clinical data, identifying key diagnoses, and generating an intelligent summary.</p>
                    
                    <div className="w-full max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden relative">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        initial={{ width: "0%", left: "0%" }}
                        animate={{ width: ["0%", "50%", "100%", "50%"], left: ["0%", "0%", "0%", "50%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Success!</h3>
                    <p className="text-slate-500">Report analyzed and summary generated.</p>
                    <p className="text-emerald-600 font-medium mt-4 text-sm animate-pulse">Redirecting to Dashboard...</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadReport;
