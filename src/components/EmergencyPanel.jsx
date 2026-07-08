import React, { useState } from 'react';
import { AlertTriangle, Droplet, HeartPulse, ShieldAlert } from 'lucide-react';

export default function EmergencyPanel({ onEmergencyTriggered }) {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState([]);

  const handleSosClick = () => {
    const newState = !isEmergencyActive;
    setIsEmergencyActive(newState);
    onEmergencyTriggered(newState);
    if (newState) {
      logAction("SOS Activated - User marked in distress");
    } else {
      logAction("SOS Deactivated - All clear");
    }
  };

  const logAction = (action) => {
    const timestamp = new Date().toLocaleTimeString();
    setDispatchLogs(prev => [`[${timestamp}] Staff Dispatch: ${action}`, ...prev]);
  };

  return (
    <div className={`glass-panel p-4 transition-colors duration-500 ${isEmergencyActive ? 'border-red-500/50 bg-red-500/10' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg flex items-center text-red-500 dark:text-red-400">
          <AlertTriangle className="mr-2" /> Emergency SOS
        </h2>
        <button 
          onClick={handleSosClick}
          className={`px-4 py-2 rounded-lg font-bold text-white transition-all shadow-lg ${
            isEmergencyActive 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'bg-red-600 hover:bg-red-700 animate-pulse'
          }`}
          aria-label={isEmergencyActive ? "Cancel SOS" : "Trigger Emergency SOS"}
        >
          {isEmergencyActive ? "CANCEL SOS" : "SOS BUTTON"}
        </button>
      </div>

      {isEmergencyActive && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Assistance requested. Please select your immediate need:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => logAction("Requested Water at Seat")}
              className="flex flex-col items-center justify-center p-3 glass-button hover:border-blue-400"
              aria-label="I need water"
            >
              <Droplet className="text-blue-400 mb-1" size={24} />
              <span className="text-xs font-medium">Water</span>
            </button>
            <button 
              onClick={() => logAction("Requested Medical Help")}
              className="flex flex-col items-center justify-center p-3 glass-button hover:border-red-400"
              aria-label="Medical Help"
            >
              <HeartPulse className="text-red-400 mb-1" size={24} />
              <span className="text-xs font-medium">Medical</span>
            </button>
            <button 
              onClick={() => logAction("Requested Security")}
              className="flex flex-col items-center justify-center p-3 glass-button hover:border-yellow-400"
              aria-label="Security"
            >
              <ShieldAlert className="text-yellow-400 mb-1" size={24} />
              <span className="text-xs font-medium">Security</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Reader and Staff Dispatch Log */}
      <div 
        className="mt-4 p-3 bg-black/20 rounded-lg h-24 overflow-y-auto text-xs font-mono opacity-80"
        aria-live="assertive"
      >
        <div className="font-semibold mb-1 opacity-50">Staff Dispatch Logs:</div>
        {dispatchLogs.length === 0 && <div className="italic opacity-50">No active dispatches.</div>}
        {dispatchLogs.map((log, i) => (
          <div key={i} className="text-slate-700 dark:text-slate-300">{log}</div>
        ))}
      </div>
    </div>
  );
}
