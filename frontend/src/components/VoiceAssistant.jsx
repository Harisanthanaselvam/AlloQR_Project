import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Command, CheckCircle2, AlertCircle, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState(null);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  // Helper function for Voice Guidance (TTS)
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    // Select a pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English'));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleCommand = useCallback((text) => {
    const cmd = text.toLowerCase().trim();
    console.log("Voice Command Detected:", cmd);

    // Define commands with flexible matching
    const commands = [
      {
        regex: /(go to|open|show|move to)?\s*(home|main|landing)/i,
        action: () => { navigate('/'); return 'Navigating to Home Page'; }
      },
      {
        regex: /(go to|open|show|move to)?\s*(register|new patient|registration)/i,
        action: () => { navigate('/register'); return 'Opening Patient Registration'; }
      },
      {
        regex: /(go to|open|show|move to)?\s*(patients|all patients|list)/i,
        action: () => { navigate('/patients'); return 'Opening Patients List'; }
      },
      {
        regex: /(go to|open|show|move to)?\s*(reports|all reports|medical reports)/i,
        action: () => { navigate('/reports'); return 'Opening Reports Dashboard'; }
      },
      {
        regex: /(go to|open|show|move to)?\s*(scan|scanner|qr code)/i,
        action: () => { navigate('/scan'); return 'Opening QR Scanner'; }
      },
      {
        regex: /(upload|add|new)\s*(report|document|file)/i,
        action: () => {
          const match = window.location.pathname.match(/\/patient\/(\d+)/);
          if (match) {
            navigate(`/patient/${match[1]}/upload`);
            return 'Opening the medical report upload section';
          }
          return 'I need you to open a patient profile first before I can upload a report.';
        }
      },
      {
        regex: /(read|tell me|what is)\s*(the)?\s*(summary|report summary|ai summary)/i,
        action: () => {
          const summaryEl = document.getElementById('latest-report-summary');
          if (summaryEl) {
            const text = summaryEl.innerText || summaryEl.textContent;
            if (text.includes("Processing")) {
              return "The AI summary is still being processed. Please wait a moment.";
            }
            return `Sure. Here is the AI summary of the report: ${text}`;
          }
          return "I couldn't find a report summary on this page. Please open a patient's dashboard first.";
        }
      }
    ];

    for (const c of commands) {
      if (c.regex.test(cmd)) {
        const feedback = c.action();
        setLastCommand(feedback);
        speak(feedback); // AUDIBLE GUIDANCE
        // Clear feedback after 3 seconds
        setTimeout(() => setLastCommand(null), 3500);
        return;
      }
    }
    
    // If no command matched but recording was final
    if (cmd.length > 3) {
      speak(`I heard ${cmd}, but I don't recognize that command. Try saying Go to Home or Register.`);
    }
  }, [navigate, speak]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const startRecognition = () => {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError(null);
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const final = event.results[i][0].transcript;
            setTranscript(final);
            handleCommand(final);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setTranscript(interimTranscript);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          setError("Microphone access denied.");
          speak("I need microphone access to help you.");
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Ignore no-speech, it will restart automatically in onend
        } else {
          setError(`Error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // If we are still supposed to be listening, restart it
        if (isListening && !error) {
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }
      };

      recognitionRef.current = recognition;
      if (isListening) {
        try {
          recognition.start();
          speak("How can I assist you today?");
        } catch (e) {
          console.error("Initial start failed:", e);
        }
      } else {
        window.speechSynthesis?.cancel(); // Stop talking if we stop listening
      }
    };

    startRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, [isListening, handleCommand, error, speak]);

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {(isListening || error || lastCommand) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white/95 backdrop-blur-xl px-6 py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 pointer-events-auto max-w-xs w-80"
          >
            {error ? (
              <div className="flex items-start gap-3 text-red-600">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">System Error</p>
                  <p className="text-xs text-slate-500 mt-1">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto text-slate-400"><X size={14}/></button>
              </div>
            ) : lastCommand ? (
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Volume2 size={24} className="animate-bounce" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Assisting...</p>
                  <p className="text-xs text-blue-600 font-medium">{lastCommand}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 16, 8] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-1 bg-blue-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Voice Guidance Active</span>
                  </div>
                  <button onClick={() => setIsListening(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="min-h-[50px] mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                  <p className={`text-slate-700 font-medium leading-relaxed ${transcript ? 'text-sm' : 'text-xs italic text-slate-400'}`}>
                    {transcript ? `"${transcript}"` : "Try: 'Register Patient', 'View Patients', or 'Open Scanner'"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2">
                  {['Home', 'Register', 'Patients', 'Summary'].map(cmd => (
                    <div key={cmd} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 bg-blue-100 rounded-full"></div> {cmd}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsListening(!isListening)}
        className={`pointer-events-auto w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-300 relative group overflow-hidden ${
          isListening 
            ? 'bg-blue-600 text-white shadow-blue-500/40' 
            : error 
              ? 'bg-red-500 text-white shadow-red-500/30'
              : 'bg-white text-slate-600 hover:text-blue-600 shadow-slate-200/50 border border-slate-100'
        }`}
      >
        <div className="relative z-10">
          {isListening ? <Mic size={28} /> : <MicOff size={28} />}
        </div>
        
        {isListening && (
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2].map(i => (
              <motion.div 
                key={i}
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, delay: i }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default VoiceAssistant;