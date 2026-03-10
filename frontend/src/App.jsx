import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import Home from './pages/Home';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import UploadReport from './pages/UploadReport';
import ScanQR from './pages/ScanQR';
import Patients from './pages/Patients';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/patient/:id" element={<PatientDashboard />} />
            <Route path="/patient/:id/upload" element={<UploadReport />} />
          </Routes>
        </main>
        <VoiceAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;