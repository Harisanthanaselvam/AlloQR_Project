import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, HeartPulse, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.number({ invalid_type_error: "Age must be a number" }).min(0).max(130),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(7, "Phone number is too short").max(20),
  address: z.string().optional(),
  medical_history: z.string().optional()
});

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: "Male",
    }
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const response = await api.post('/register_patient', data);
      navigate(`/patient/${response.data.patient.patient_id}`);
    } catch (err) {
      console.error(err);
      setServerError("Failed to register patient. Please verify your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-6 text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">New Patient Registration</h2>
            <p className="text-blue-50 text-sm opacity-90">Enter details to generate AI-linked medical records.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          {serverError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
              <ShieldAlert className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium">{serverError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                {...register("name")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Enter patient's full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Age</label>
              <input 
                type="number"
                {...register("age", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Years"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <select 
                {...register("gender")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input 
                {...register("phone")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="e.g. +1 555-0123"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Address (Optional)</label>
              <textarea 
                {...register("address")}
                rows="2"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                placeholder="Patient's residential address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <HeartPulse size={16} className="text-rose-500" />
                Medical History
              </label>
              <textarea 
                {...register("medical_history")}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                placeholder="Any known allergies, past surgeries, or chronic conditions..."
              />
              {errors.medical_history && <p className="text-red-500 text-xs mt-1">{errors.medical_history.message}</p>}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UserPlus size={20} />
                Register & Generate QR
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
