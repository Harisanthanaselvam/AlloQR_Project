import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, UserPlus, ScanLine, Users, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white pt-10 pb-20 px-6 sm:px-12 lg:px-24 w-full h-full relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -m-32 w-[500px] h-[500px] rounded-full bg-green-50 opacity-50 blur-3xl pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold tracking-wide shadow-sm">
          <Activity size={16} /> 
          Next-Generation Healthcare
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Streamline Patient Care with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">AlloQR</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed">
          The ultimate QR-based patient registration and AI medical report summarization system. Access records instantly, manage patients effortlessly.
        </motion.p>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          
          <ActionCard 
            icon={<UserPlus size={32} className="text-blue-500" />}
            title="Register Patient"
            description="Add a new patient and automatically generate their unique QR code."
            onClick={() => navigate('/register')}
            color="hover:border-blue-300 hover:shadow-blue-100"
          />

          <ActionCard 
            icon={<ScanLine size={32} className="text-emerald-500" />}
            title="Scan QR Code"
            description="Instantly verify patient existence and access their dashboard."
            onClick={() => navigate('/scan')}
            color="hover:border-emerald-300 hover:shadow-emerald-100"
          />

          <ActionCard 
            icon={<Users size={32} className="text-purple-500" />}
            title="View Patients"
            description="Browse and manage the full directory of registered patients."
            onClick={() => navigate('/patients')}
            color="hover:border-purple-300 hover:shadow-purple-100"
          />

          <ActionCard 
            icon={<FileText size={32} className="text-rose-500" />}
            title="AI Summaries"
            description="Upload medical reports and get instant AI-powered summaries."
            onClick={() => navigate('/reports')}
            color="hover:border-rose-300 hover:shadow-rose-100"
          />

        </motion.div>
      </motion.div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, onClick, color }) => {
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 ${color}`}
    >
      <div className="mb-5 p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </motion.button>
  );
};

export default Home;
