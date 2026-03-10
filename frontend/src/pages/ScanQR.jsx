import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ScanLine, ArrowLeft, VideoOff, AlertCircle, Upload, CheckCircle2, Activity, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';
import { api } from '../api';

const ScanQR = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [error, setError] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Core navigation and verification logic
  const processPatientId = async (text) => {
    if (!text) return;
    
    setIsProcessing(true);
    setScannedData(text);
    setError(null); // Clear previous errors
    console.log("Analyzing data:", text);

    try {
      let patientId = null;

      // Extract Patient ID from text (URL or raw ID)
      if (text.includes('://') || text.includes('/patient/')) {
        try {
          const url = new URL(text.startsWith('http') ? text : `http://${text}`);
          const parts = url.pathname.split('/');
          const patientIndex = parts.indexOf('patient');
          patientId = (patientIndex !== -1 && parts[patientIndex + 1]) 
            ? parts[patientIndex + 1] 
            : parts[parts.length - 1];
        } catch (e) {
          const matches = text.match(/\/patient\/(\d+)/);
          if (matches) patientId = matches[1];
        }
      } 
      
      if (!patientId) {
        const numericMatch = text.match(/\d+/);
        if (numericMatch) patientId = numericMatch[0];
      }

      if (patientId && !isNaN(patientId)) {
        // Verify patient existence in database
        try {
          await api.get(`/patient/${patientId}`);
          // Success! Navigate to dashboard
          setTimeout(() => navigate(`/patient/${patientId}`), 600);
        } catch (err) {
          setError(`Patient with ID ${patientId} does not exist in our records.`);
          setIsProcessing(false);
          setScannedData(null);
        }
      } else {
        setError("Invalid QR code. Could not identify a patient ID.");
        setIsProcessing(false);
        setScannedData(null);
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError("An error occurred while processing the QR code.");
      setIsProcessing(false);
    }
  };

  const handleCameraScan = (text) => {
    if (!text || isProcessing) return;
    processPatientId(text);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setScannedData(null); // Clear previous scanned data

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        setIsUploading(false);
        if (code) {
          processPatientId(code.data);
        } else {
          setError("Could not find a QR code in this image. Please ensure the code is clear and well-lit.");
        }
      };
      img.onerror = () => {
        setIsUploading(false);
        setError("Failed to load image. Please try another file.");
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setIsUploading(false);
      setError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
    event.target.value = null; // Clear the input so the same file can be selected again
  };

  const handleError = (err) => {
    setError(err?.message || "Failed to access camera.");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 flex justify-center items-start">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-200 bg-white border border-slate-200 text-slate-700 rounded-xl transition-colors font-medium shadow-sm"
            onClick={() => navigate(`/`)}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-md shadow-blue-200"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isUploading}
          >
            <Upload size={18} /> {isProcessing || isUploading ? 'Processing...' : 'Upload Image'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-900 p-6 text-center relative">
            <ScanLine className={`mx-auto mb-2 transition-colors ${isProcessing ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} size={32} />
            <h2 className="text-xl font-bold text-white mb-1">
              {isProcessing ? 'Verifying Patient...' : 'Scan Patient QR'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isProcessing ? 'Connecting to database...' : 'Align code in frame or upload an image.'}
            </p>
          </div>

          <div className="p-4 bg-black relative min-h-[300px] flex items-center justify-center">
            {isUploading ? (
              <div className="text-center text-white flex flex-col items-center p-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Decoding image...</p>
              </div>
            ) : error && !isProcessing ? (
              <div className="p-8 text-center text-white flex flex-col items-center">
                <VideoOff size={48} className="text-red-500 mb-4" />
                <h3 className="font-bold mb-2 text-lg">Oops! Something went wrong</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-[250px]">{error}</p>
                <div className="flex gap-3">
                  <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-white font-medium transition-colors">Retry Camera</button>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 px-6 py-2 rounded-xl text-white font-medium">Try Another File</button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-inner relative w-full h-full">
                <Scanner 
                  onResult={handleCameraScan} 
                  onError={handleError}
                  options={{ delayBetweenScanSuccess: 3000 }}
                  components={{ audio: false, onOff: true, torch: true, finder: true }}
                />
                
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm"
                    >
                      <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center">
                        {error ? (
                          <AlertCircle size={40} className="text-red-500 mb-3" />
                        ) : (
                          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        )}
                        <p className="font-bold text-slate-800 text-center">
                          {error ? 'Validation Failed' : 'Patient Found'}
                        </p>
                        {scannedData && !error && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" /> Redirecting shortly...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
          </div>
          <div className="p-6 text-center border-t border-slate-100">
            {scannedData && isProcessing ? (
              <p className="text-sm font-medium text-blue-600 flex items-center justify-center gap-2">
                <Activity size={16} className="animate-pulse" /> Validating ID: {scannedData.substring(0, 15)}...
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                  <QrCode size={16} /> QR detection is automatic
                </p>
              </div>
            )}
          </div>
        </motion.div>
        
        <p className="mt-8 text-center text-slate-400 text-xs px-6 leading-relaxed">
          Tip: If camera access is slow, you can take a photo of the QR code and use the upload option above for instant results.
        </p>
      </div>
    </div>
  );
};

export default ScanQR;
