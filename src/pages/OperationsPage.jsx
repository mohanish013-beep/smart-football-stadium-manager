import React, { useState } from 'react';
import {
  Settings2,
  Users,
  GitBranch,
  Sliders,
  Play,
  RotateCcw,
  AlertTriangle,
  Lock,
  Navigation2,
  ArrowRight,
  Gauge,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from 'lucide-react';
import AiAssistant from '../components/AiAssistant.jsx';

const INITIAL_ZONES = [
  { id: 'north-stand', name: 'North Stand', capacity: 100, density: 91, flow: 'high', locked: false },
  { id: 'south-stand', name: 'South Stand', capacity: 100, density: 74, flow: 'medium', locked: false },
  { id: 'east-wing', name: 'East Wing', capacity: 100, density: 62, flow: 'medium', locked: false },
  { id: 'west-wing', name: 'West Wing', capacity: 100, density: 58, flow: 'low', locked: false },
  { id: 'vip-boxes', name: 'VIP Boxes', capacity: 100, density: 88, flow: 'high', locked: false },
  { id: 'press-area', name: 'Press Area', capacity: 100, density: 45, flow: 'low', locked: false },
];

const SCENARIOS = [
  { id: 'half-time', label: 'Half-time Rush', description: 'Simulate 40,000 simultaneous movements at half-time', color: 'amber' },
  { id: 'emergency-evac', label: 'Emergency Evacuation', description: 'Model full stadium evacuation sequence', color: 'red' },
  { id: 'vip-arrival', label: 'VIP Arrival Protocol', description: 'Allocate priority corridors for VIP procession', color: 'cyan' },
  { id: 'post-match', label: 'Post-Match Exit', description: 'Stagger exits to prevent crowd crush', color: 'emerald' },
];

function ZoneCard({ zone, onDensityChange, onLockToggle, onDivert }) {
  const densityColor =
    zone.density >= 90 ? 'bg-red-500' : zone.density >= 75 ? 'bg-amber-400' : 'bg-emerald-400';
  const densityBg =
    zone.density >= 90 ? 'border-red-500/30' : zone.density >= 75 ? 'border-amber-400/30' : 'border-emerald-400/30';
  const flowBadge = {
    high: 'badge-red',
    medium: 'badge-amber',
    low: 'badge-green',
  };

  return (
    <div className={`glass-panel p-4 border ${densityBg} transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-sm text-text-primary">{zone.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${flowBadge[zone.flow]}`}>{zone.flow} flow</span>
            {zone.locked && <span className="badge badge-red">LOCKED</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-text-primary">{zone.density}%</div>
          <div className="text-[10px] text-text-secondary">Occupancy</div>
        </div>
      </div>

      {/* Density bar */}
      <div className="w-full h-2 bg-white/5 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${densityColor}`}
          style={{ width: `${zone.density}%` }}
        />
      </div>

      {/* Slider */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-muted mb-1">
          <span>Simulate Capacity</span>
          <span>{zone.density}%</span>
        </div>
        <input
          id={`slider-${zone.id}`}
          type="range"
          min="0"
          max="100"
          value={zone.density}
          onChange={(e) => onDensityChange(zone.id, Number(e.target.value))}
          disabled={zone.locked}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-cyan-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={`${zone.name} capacity slider`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          id={`divert-${zone.id}`}
          onClick={() => onDivert(zone.id)}
          className="flex-1 btn-ghost text-xs py-1.5 justify-center"
          aria-label={`Divert crowd from ${zone.name}`}
        >
          <Navigation2 size={12} /> Divert
        </button>
        <button
          id={`lock-${zone.id}`}
          onClick={() => onLockToggle(zone.id)}
          className={`flex-1 text-xs py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all duration-200 border
            ${zone.locked
              ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
              : 'glass-button text-text-secondary'
            }`}
          aria-label={zone.locked ? `Unlock ${zone.name}` : `Lock ${zone.name}`}
        >
          <Lock size={12} />
          {zone.locked ? 'Unlock' : 'Lock'}
        </button>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario, onRun }) {
  const colorMap = {
    amber: 'border-amber-400/30 hover:border-amber-400/60',
    red: 'border-red-500/30 hover:border-red-500/60',
    cyan: 'border-cyan-accent/30 hover:border-cyan-accent/60',
    emerald: 'border-emerald-400/30 hover:border-emerald-400/60',
  };
  const btnMap = {
    amber: 'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 border border-amber-400/30',
    red: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30',
    cyan: 'bg-cyan-gradient text-midnight font-bold',
    emerald: 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 border border-emerald-400/30',
  };

  return (
    <div
      className={`glass-panel p-4 border cursor-default transition-all duration-300 ${colorMap[scenario.color]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-text-primary">{scenario.label}</div>
          <div className="text-xs text-text-secondary mt-1 leading-relaxed">{scenario.description}</div>
        </div>
        <button
          id={`scenario-${scenario.id}`}
          onClick={() => onRun(scenario)}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200 ${btnMap[scenario.color]}`}
          aria-label={`Run ${scenario.label} scenario`}
        >
          <Play size={12} /> Run
        </button>
      </div>
    </div>
  );
}

export default function OperationsPage() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [simLog, setSimLog] = useState([
    { id: 0, time: new Date().toLocaleTimeString(), msg: 'Operations Center online. All systems ready.' },
  ]);
  const [activeScenario, setActiveScenario] = useState(null);

  const addLog = (msg) => {
    setSimLog((prev) => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg }, ...prev.slice(0, 19)]);
  };

  const handleDensityChange = (zoneId, value) => {
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, density: value } : z)));
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) addLog(`[SIM] ${zone.name} capacity adjusted to ${value}%`);
  };

  const handleLockToggle = (zoneId) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, locked: !z.locked } : z))
    );
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) addLog(`[ACTION] ${zone.name} ${zone.locked ? 'unlocked' : 'LOCKED by operator'}`);
  };

  const handleDivert = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) addLog(`[DIVERT] Crowd flow redirected away from ${zone.name}`);
  };

  const handleScenario = (scenario) => {
    setActiveScenario(scenario.id);
    addLog(`[SCENARIO] Running: "${scenario.label}"...`);

    if (scenario.id === 'half-time') {
      setZones((prev) =>
        prev.map((z) => ({ ...z, density: Math.min(100, z.density + Math.floor(Math.random() * 20 + 5)) }))
      );
    } else if (scenario.id === 'emergency-evac') {
      setZones((prev) => prev.map((z) => ({ ...z, density: Math.max(0, z.density - 40) })));
    } else if (scenario.id === 'vip-arrival') {
      setZones((prev) =>
        prev.map((z) => (z.id === 'vip-boxes' ? { ...z, density: 98, flow: 'high' } : z))
      );
    } else if (scenario.id === 'post-match') {
      setZones((prev) =>
        prev.map((z, i) => ({
          ...z,
          density: Math.max(0, z.density - (i + 1) * 8),
          flow: z.density > 70 ? 'medium' : 'low',
        }))
      );
    }

    setTimeout(() => {
      addLog(`[SCENARIO] "${scenario.label}" simulation complete.`);
      setActiveScenario(null);
    }, 2000);
  };

  const handleReset = () => {
    setZones(INITIAL_ZONES);
    addLog('[RESET] All zone data reverted to baseline.');
  };

  const criticalCount = zones.filter((z) => z.density >= 90).length;

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 lg:pt-0">
        <div>
          <h1 className="page-title">
            <span className="text-gradient-cyan">Operations Center</span>
          </h1>
          <p className="page-subtitle">What-If Simulation Engine & Crowd Management</p>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
              <AlertTriangle size={12} />
              {criticalCount} Critical Zone{criticalCount > 1 ? 's' : ''}
            </div>
          )}
          <button
            id="reset-simulation"
            onClick={handleReset}
            className="btn-ghost text-sm"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="glass-panel p-5">
        <h2 className="section-title mb-4">
          <GitBranch size={18} className="text-cyan-accent" />
          What-If Scenarios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {SCENARIOS.map((s) => (
            <ScenarioCard key={s.id} scenario={s} onRun={handleScenario} />
          ))}
        </div>
      </div>

      {/* Zone Grid + Simulation Log */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Zone Controls */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">
              <Sliders size={18} className="text-cyan-accent" />
              Zone Control Matrix
            </h2>
            <div className="text-xs text-text-secondary">
              Drag sliders to simulate capacity changes
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                onDensityChange={handleDensityChange}
                onLockToggle={handleLockToggle}
                onDivert={handleDivert}
              />
            ))}
          </div>
        </div>

        {/* Simulation Log + AI */}
        <div className="space-y-4">
          {/* Simulation Log */}
          <div className="glass-panel p-5">
            <h2 className="section-title mb-4">
              <Gauge size={18} className="text-cyan-accent" />
              Simulation Log
            </h2>
            <div
              className="h-48 overflow-y-auto scrollbar-thin space-y-1"
              aria-live="polite"
              aria-label="Simulation log"
            >
              {simLog.map((entry) => (
                <div key={entry.id} className="flex gap-2 text-xs font-mono">
                  <span className="text-slate-muted flex-shrink-0">{entry.time}</span>
                  <span className="text-text-secondary">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="glass-panel p-5 flex flex-col">
            <h2 className="section-title mb-4">
              <TrendingUp size={18} className="text-cyan-accent" />
              AI Advisor
            </h2>
            <AiAssistant compact />
          </div>
        </div>
      </div>
    </div>
  );
}
