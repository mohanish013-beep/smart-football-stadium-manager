import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Droplets,
  Wifi,
  Wind,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  Users,
  Phone,
  Radio,
} from 'lucide-react';
import EmergencyPanel from '../components/EmergencyPanel.jsx';
import InteractiveMap from '../components/InteractiveMap.jsx';

const INFRA_SYSTEMS = [
  {
    id: 'power-grid',
    name: 'Power Grid',
    icon: Zap,
    status: 'online',
    detail: 'Primary + Backup active',
    load: 72,
    color: 'emerald',
  },
  {
    id: 'water-supply',
    name: 'Water Supply',
    icon: Droplets,
    status: 'online',
    detail: 'All lines pressurized',
    load: 58,
    color: 'emerald',
  },
  {
    id: 'network',
    name: 'Network & CCTV',
    icon: Wifi,
    status: 'warning',
    detail: 'Sector 7 camera offline',
    load: 89,
    color: 'amber',
  },
  {
    id: 'hvac',
    name: 'HVAC Systems',
    icon: Wind,
    status: 'online',
    detail: 'All zones ventilated',
    load: 61,
    color: 'emerald',
  },
];

const INCIDENT_LOG = [
  { id: 1, time: '13:28', severity: 'high', title: 'Crowd surge — North Stand 4A', responder: 'Security Team Alpha', resolved: false },
  { id: 2, time: '13:15', severity: 'medium', title: 'Medical assistance — Bay 7', responder: 'Medical Unit 2', resolved: true },
  { id: 3, time: '13:02', severity: 'low', title: 'Lost item report — Gate 6', responder: 'Staff Liaison', resolved: true },
  { id: 4, time: '12:47', severity: 'medium', title: 'Unauthorized access attempt — East perimeter', responder: 'Security Team Bravo', resolved: true },
  { id: 5, time: '12:30', severity: 'low', title: 'Minor barrier breach — South concourse', responder: 'Ground Staff', resolved: true },
];

const STAFF_UNITS = [
  { id: 'unit-alpha', name: 'Security Alpha', role: 'Crowd Control', status: 'deployed', location: 'North Stand' },
  { id: 'unit-bravo', name: 'Security Bravo', role: 'Perimeter', status: 'standby', location: 'East Gate' },
  { id: 'unit-medical', name: 'Medical Unit 1', role: 'Emergency', status: 'deployed', location: 'Central Hub' },
  { id: 'unit-medical2', name: 'Medical Unit 2', role: 'Emergency', status: 'available', location: 'South Bay' },
  { id: 'unit-fire', name: 'Fire Safety', role: 'Fire Response', status: 'standby', location: 'Control Room' },
  { id: 'unit-evac', name: 'Evacuation Lead', role: 'Evac Coordinator', status: 'available', location: 'West Wing' },
];

function InfraCard({ system }) {
  const statusConfig = {
    online: { dot: 'status-online', badge: 'badge-green', label: 'ONLINE' },
    warning: { dot: 'status-warning', badge: 'badge-amber', label: 'DEGRADED' },
    offline: { dot: 'status-danger', badge: 'badge-red', label: 'OFFLINE' },
  };
  const loadColor =
    system.load >= 90 ? 'bg-red-500' : system.load >= 75 ? 'bg-amber-400' : 'bg-emerald-400';
  const Icon = system.icon;
  const cfg = statusConfig[system.status];

  return (
    <div id={system.id} className="glass-panel p-4 transition-all duration-300 hover:border-cyan-accent/30">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-surface border border-slate-border/30">
          <Icon size={18} className="text-cyan-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-text-primary">{system.name}</div>
          <div className="text-xs text-text-secondary mt-0.5">{system.detail}</div>
        </div>
        <div className={`flex items-center gap-1.5`}>
          <div className={cfg.dot} />
          <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-slate-muted mb-1">
          <span>System Load</span>
          <span>{system.load}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${loadColor}`}
            style={{ width: `${system.load}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const severityConfig = {
    high: { badge: 'badge-red', label: 'HIGH', dot: 'bg-red-400' },
    medium: { badge: 'badge-amber', label: 'MEDIUM', dot: 'bg-amber-400' },
    low: { badge: 'badge-green', label: 'LOW', dot: 'bg-emerald-400' },
  };
  const cfg = severityConfig[incident.severity];

  return (
    <div
      id={`incident-${incident.id}`}
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200
        ${incident.resolved
          ? 'border-slate-border/15 bg-transparent'
          : 'border-red-500/20 bg-red-500/5'
        }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
          <span className="text-xs font-medium text-text-primary truncate">{incident.title}</span>
          {incident.resolved && (
            <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
          )}
        </div>
        <div className="text-[10px] text-text-secondary flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Users size={9} /> {incident.responder}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={9} /> {incident.time}
          </span>
        </div>
      </div>
      <span
        className={`text-[10px] flex-shrink-0 font-medium mt-0.5 ${
          incident.resolved ? 'text-emerald-400' : 'text-red-400 animate-pulse font-semibold'
        }`}
      >
        {incident.resolved ? 'Resolved' : 'ACTIVE'}
      </span>
    </div>
  );
}

function StaffUnit({ unit }) {
  const statusConfig = {
    deployed: { badge: 'badge-red', label: 'DEPLOYED', dot: 'bg-red-400' },
    standby: { badge: 'badge-amber', label: 'STANDBY', dot: 'bg-amber-400' },
    available: { badge: 'badge-green', label: 'AVAILABLE', dot: 'bg-emerald-400' },
  };
  const cfg = statusConfig[unit.status];

  return (
    <div
      id={unit.id}
      className="flex items-center gap-3 py-2.5 border-b border-slate-border/15 last:border-0"
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{unit.name}</div>
        <div className="text-[10px] text-text-secondary flex items-center gap-1.5 mt-0.5">
          <MapPin size={9} /> {unit.location}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`badge ${cfg.badge}`}>{cfg.label}</div>
        <div className="text-[10px] text-slate-muted mt-1">{unit.role}</div>
      </div>
    </div>
  );
}

export default function LogisticsPage() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 lg:pt-0">
        <div>
          <h1 className="page-title">
            <span className="text-gradient-cyan">Logistics & Emergency</span>
          </h1>
          <p className="page-subtitle">SOS Console · Infrastructure · Staff Dispatch</p>
        </div>
        {isEmergencyActive && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold animate-pulse">
            <Radio size={14} />
            EMERGENCY PROTOCOL ACTIVE
          </div>
        )}
      </div>

      {/* Top Section: SOS Console + Evacuation Map */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Emergency SOS Panel */}
        <div className={`glass-panel p-5 transition-all duration-500 ${isEmergencyActive ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : ''}`}>
          <div className="flex items-center gap-2 mb-5">
            <div className={`p-2 rounded-xl border ${isEmergencyActive ? 'bg-red-500/15 border-red-500/30' : 'bg-surface border-slate-border/30'}`}>
              <ShieldAlert size={18} className={isEmergencyActive ? 'text-red-400' : 'text-cyan-accent'} />
            </div>
            <div>
              <h2 className="section-title">Emergency SOS Console</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {isEmergencyActive ? '🔴 Emergency active — units dispatched' : 'All clear — monitoring'}
              </p>
            </div>
          </div>
          <EmergencyPanel onEmergencyTriggered={setIsEmergencyActive} />
        </div>

        {/* Evacuation Map */}
        <div className={`glass-panel p-5 transition-all duration-500 ${isEmergencyActive ? 'border-red-500/30' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              <MapPin size={18} className={isEmergencyActive ? 'text-red-400' : 'text-cyan-accent'} />
              {isEmergencyActive ? 'Evacuation Routes' : 'Venue Navigation'}
            </h2>
            {isEmergencyActive && (
              <span className="badge badge-red flex items-center gap-1">
                <Radio size={8} className="animate-pulse" /> EVAC MODE
              </span>
            )}
          </div>
          <div className="h-[320px]">
            <InteractiveMap isEmergencyActive={isEmergencyActive} />
          </div>
        </div>
      </div>

      {/* Infrastructure Grid */}
      <div className="glass-panel p-5">
        <h2 className="section-title mb-5">
          <Activity size={18} className="text-cyan-accent" />
          Infrastructure Health Monitor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {INFRA_SYSTEMS.map((sys) => (
            <InfraCard key={sys.id} system={sys} />
          ))}
        </div>
      </div>

      {/* Bottom: Incident Log + Staff Dispatch */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Incident Timeline */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              <AlertTriangle size={18} className="text-cyan-accent" />
              Incident Log
            </h2>
            <span className="badge badge-red flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" /> 1 Active
            </span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
            {INCIDENT_LOG.map((incident) => (
              <IncidentRow key={incident.id} incident={incident} />
            ))}
          </div>
        </div>

        {/* Staff Dispatch Board */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              <Users size={18} className="text-cyan-accent" />
              Staff Dispatch Board
            </h2>
            <button
              id="dispatch-all"
              className="btn-ghost text-xs py-1 px-3"
              aria-label="Contact all units"
            >
              <Phone size={12} /> Contact All
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {STAFF_UNITS.map((unit) => (
              <StaffUnit key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
