import React, { useState } from 'react';
import { AlertTriangle, Droplet, HeartPulse, ShieldAlert, Radio } from 'lucide-react';

export default function EmergencyPanel({ onEmergencyTriggered }) {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState([]);

  const handleSosClick = () => {
    const newState = !isEmergencyActive;
    setIsEmergencyActive(newState);
    onEmergencyTriggered(newState);
    if (newState) {
      logAction('SOS ACTIVATED — Distress signal broadcast to all units');
    } else {
      logAction('SOS Deactivated — Stand down, all clear');
    }
  };

  const logAction = (action) => {
    const timestamp = new Date().toLocaleTimeString();
    setDispatchLogs((prev) => [`[${timestamp}] ${action}`, ...prev.slice(0, 19)]);
  };

  return (
    <div className={`space-y-4 transition-colors duration-500`}>
      {/* SOS Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm font-medium ${isEmergencyActive ? 'text-red-400' : 'text-text-secondary'}`}>
            {isEmergencyActive ? '🔴 Emergency Active' : '🟢 Status: Normal Operations'}
          </div>
          <div className="text-xs text-slate-muted mt-0.5">
            {isEmergencyActive ? 'Broadcast active — units responding' : 'Click SOS to trigger emergency protocol'}
          </div>
        </div>
        <button
          id="sos-button"
          onClick={handleSosClick}
          className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg flex items-center gap-2
            ${isEmergencyActive
              ? 'bg-surface border border-slate-border/50 text-text-secondary hover:bg-white/5'
              : 'bg-red-600 hover:bg-red-500 text-white border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
            }`}
          aria-label={isEmergencyActive ? 'Cancel SOS' : 'Trigger Emergency SOS'}
        >
          {isEmergencyActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-muted" />
              CANCEL SOS
            </>
          ) : (
            <>
              <Radio size={14} />
              SOS
            </>
          )}
        </button>
      </div>

      {/* Emergency Action Buttons */}
      {isEmergencyActive && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3 animate-fade-up">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Select Immediate Need
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="sos-water"
              onClick={() => logAction('Water requested at seat — Unit dispatched')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface border border-slate-border/30 
                hover:border-blue-400/50 hover:bg-blue-400/5 transition-all duration-200 group"
              aria-label="Request water"
            >
              <Droplet className="text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" size={22} />
              <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary">Water</span>
            </button>
            <button
              id="sos-medical"
              onClick={() => logAction('Medical emergency — Paramedic unit en route')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface border border-slate-border/30 
                hover:border-red-400/50 hover:bg-red-400/5 transition-all duration-200 group"
              aria-label="Request medical help"
            >
              <HeartPulse className="text-red-400 mb-1.5 group-hover:scale-110 transition-transform" size={22} />
              <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary">Medical</span>
            </button>
            <button
              id="sos-security"
              onClick={() => logAction('Security requested — Armed unit responding')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface border border-slate-border/30 
                hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-200 group"
              aria-label="Request security"
            >
              <ShieldAlert className="text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" size={22} />
              <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary">Security</span>
            </button>
          </div>
        </div>
      )}

      {/* Dispatch Log */}
      <div
        className="bg-midnight/60 border border-slate-border/20 rounded-xl p-3 h-32 overflow-y-auto scrollbar-thin"
        aria-live="assertive"
        aria-label="Staff dispatch log"
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-muted mb-2 flex items-center gap-1.5">
          <div className={`w-1 h-1 rounded-full ${dispatchLogs.length > 0 ? 'bg-cyan-accent animate-pulse' : 'bg-slate-muted'}`} />
          Dispatch Log
        </div>
        {dispatchLogs.length === 0 ? (
          <div className="text-xs text-slate-muted italic">No active dispatches.</div>
        ) : (
          dispatchLogs.map((log, i) => (
            <div key={i} className="text-xs font-mono text-text-secondary py-0.5 border-b border-slate-border/10 last:border-0">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
