import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Wifi,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  Bot,
  ArrowUpRight,
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap.jsx';
import AiAssistant from '../components/AiAssistant.jsx';

const METRIC_CARDS = [
  {
    id: 'active-gates',
    label: 'Active Gates',
    value: '14 / 16',
    subtext: '2 gates under maintenance',
    icon: CheckCircle2,
    trend: 'stable',
    color: 'cyan',
  },
  {
    id: 'crowd-density',
    label: 'Crowd Density',
    value: '73,248',
    subtext: '+4.2% from 30 min ago',
    icon: Users,
    trend: 'up',
    color: 'emerald',
  },
  {
    id: 'security-alerts',
    label: 'Security Alerts',
    value: '3',
    subtext: '1 critical, 2 informational',
    icon: ShieldCheck,
    trend: 'down',
    color: 'amber',
  },
  {
    id: 'system-health',
    label: 'System Health',
    value: '98.6%',
    subtext: 'All primary systems nominal',
    icon: Activity,
    trend: 'stable',
    color: 'emerald',
  },
];

const ZONE_STATUS = [
  { id: 'north-stand', zone: 'North Stand', occupancy: 91, capacity: 18500, status: 'critical' },
  { id: 'south-stand', zone: 'South Stand', occupancy: 74, capacity: 18500, status: 'warning' },
  { id: 'east-wing', zone: 'East Wing', occupancy: 62, capacity: 16000, status: 'normal' },
  { id: 'west-wing', zone: 'West Wing', occupancy: 58, capacity: 16000, status: 'normal' },
  { id: 'vip-boxes', zone: 'VIP Boxes', occupancy: 88, capacity: 2400, status: 'warning' },
  { id: 'press-area', zone: 'Press Area', occupancy: 45, capacity: 800, status: 'normal' },
];

const ACTIVITY_FEED = [
  { id: 1, time: '13:28', type: 'alert', msg: 'Crowd density spike detected — North Stand Section 4A' },
  { id: 2, time: '13:21', type: 'info', msg: 'Gate 12 re-opened after maintenance clearance' },
  { id: 3, time: '13:15', type: 'success', msg: 'Medical team deployed — Bay 7, response time 4m 12s' },
  { id: 4, time: '13:09', type: 'info', msg: 'AI Assistant handled 142 visitor queries in the last hour' },
  { id: 5, time: '13:01', type: 'success', msg: 'Pre-match security sweep completed — all clear' },
];

function MetricCard({ id, label, value, subtext, icon: Icon, trend, color }) {
  const colorMap = {
    cyan: 'text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : ArrowUpRight;

  return (
    <div id={id} className="metric-card animate-fade-up">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <TrendIcon
          size={16}
          className={`${
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-muted'
          } mt-1`}
        />
      </div>
      <div>
        <div className="metric-value">{value}</div>
        <div className="metric-label mt-0.5">{label}</div>
      </div>
      <div className="text-xs text-text-secondary">{subtext}</div>
    </div>
  );
}

function ZoneBar({ id, zone, occupancy, capacity, status }) {
  const statusColor = {
    critical: 'bg-red-500',
    warning: 'bg-amber-400',
    normal: 'bg-emerald-400',
  };
  const statusBadge = {
    critical: 'badge-red',
    warning: 'badge-amber',
    normal: 'badge-green',
  };

  return (
    <div id={id} className="flex items-center gap-4 py-2.5 border-b border-slate-border/20 last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-text-primary truncate">{zone}</span>
          <span className={`badge ${statusBadge[status]} ml-2 flex-shrink-0`}>
            {status}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${statusColor[status]}`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-semibold text-text-primary">{occupancy}%</div>
        <div className="text-[10px] text-text-secondary">{capacity.toLocaleString()}</div>
      </div>
    </div>
  );
}

function ActivityFeed({ items }) {
  const typeConfig = {
    alert: { dot: 'bg-amber-400', text: 'text-amber-400' },
    info: { dot: 'bg-cyan-accent', text: 'text-cyan-accent' },
    success: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
    danger: { dot: 'bg-red-400', text: 'text-red-400' },
  };

  return (
    <div className="space-y-0 divide-y divide-slate-border/15">
      {items.map((item) => {
        const cfg = typeConfig[item.type] || typeConfig.info;
        return (
          <div key={item.id} className="flex gap-3 py-3 group">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary leading-relaxed">{item.msg}</p>
            </div>
            <div className="flex-shrink-0 text-[10px] text-slate-muted font-mono">{item.time}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 lg:pt-0">
        <div>
          <h1 className="page-title">
            <span className="text-gradient-cyan">Dashboard</span>
          </h1>
          <p className="page-subtitle">Estadio Azteca — Real-time Venue Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-text-secondary">
            <Clock size={12} className="text-cyan-accent" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs">
            <div className="status-online" />
            <span className="text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card) => (
          <MetricCard key={card.id} {...card} />
        ))}
      </div>

      {/* Main Grid: Map + Zones + AI */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive Map — takes 2 columns */}
        <div className="xl:col-span-2">
          <div className="glass-panel p-5 h-full min-h-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                <MapPin size={18} className="text-cyan-accent" />
                Live Venue Map
              </h2>
              <span className="badge badge-cyan flex items-center gap-1.5">
                <Radio size={9} className="animate-pulse" /> LIVE
              </span>
            </div>
            <div className="h-[360px]">
              <InteractiveMap isEmergencyActive={isEmergency} />
            </div>
          </div>
        </div>

        {/* Zone Status Panel */}
        <div className="glass-panel p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              <Users size={18} className="text-cyan-accent" />
              Zone Occupancy
            </h2>
            <span className="text-xs text-text-secondary">Live</span>
          </div>
          <div className="flex-1">
            {ZONE_STATUS.map((z) => (
              <ZoneBar key={z.id} {...z} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Activity Feed + AI Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              <Activity size={18} className="text-cyan-accent" />
              Recent Activity
            </h2>
            <button className="btn-ghost text-xs py-1 px-3">View All</button>
          </div>
          <ActivityFeed items={ACTIVITY_FEED} />
        </div>

        {/* AI Quick Ask */}
        <div className="glass-panel p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20">
              <Bot size={16} className="text-cyan-accent" />
            </div>
            <h2 className="section-title">AI Operations Assistant</h2>
          </div>
          <div className="flex-1">
            <AiAssistant compact />
          </div>
        </div>
      </div>
    </div>
  );
}
