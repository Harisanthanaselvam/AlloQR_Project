import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Home, UserPlus, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-md shadow-blue-500/20">
              <QrCode size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-emerald-600">
              AlloQR
            </span>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                location.pathname === '/' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link 
              to="/register" 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                location.pathname === '/register' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10'
              }`}
            >
              <UserPlus size={18} />
              <span className="hidden sm:inline">New Patient</span>
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
