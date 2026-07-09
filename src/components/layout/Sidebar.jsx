import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings2,
  ShieldAlert,
  Menu,
  X,
  Activity,
  Wifi,
  Cloud,
  CloudRain,
  Sun,
  ChevronRight,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Venue Overview',
    end: true,
  },
  {
    to: '/operations',
    icon: Settings2,
    label: 'Operations',
    description: 'Simulation & Crowd',
  },
  {
    to: '/logistics',
    icon: ShieldAlert,
    label: 'Logistics & Emergency',
    description: 'SOS & Infrastructure',
  },
];

function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.43&longitude=-99.13&current_weather=true'
    )
      .then((res) => res.json())
      .then((data) => setWeather(data.current_weather))
      .catch(() => {});
  }, []);

  if (!weather) return null;

  const WeatherIcon =
    weather.weathercode > 50
      ? CloudRain
      : weather.weathercode > 0
      ? Cloud
      : Sun;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface/40 border border-slate-border/20 text-xs text-text-secondary">
      <WeatherIcon size={14} className="text-cyan-accent" />
      <span className="font-medium">{weather.temperature}°C</span>
      <span className="opacity-50">· Mexico City</span>
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-4 pt-6 pb-4 border-b border-slate-border/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-gradient flex items-center justify-center flex-shrink-0 shadow-cyan-glow-sm">
            <Zap size={18} className="text-midnight" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-text-primary leading-tight truncate">
                Stadium Hub
              </div>
              <div className="text-[10px] text-cyan-accent font-medium uppercase tracking-wider">
                FIFA 2026
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3">
            <WeatherWidget />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <div className={`px-2 mb-2 ${collapsed ? 'hidden' : ''}`}>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-muted">
            Navigation
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
                transition-all duration-200 cursor-pointer select-none group relative
                ${
                  isActive
                    ? 'text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 shadow-cyan-glow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active left indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-accent rounded-full -ml-2 shadow-cyan-glow-sm" />
              )}

              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-cyan-accent' : 'text-slate-muted group-hover:text-text-secondary'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  <div className="text-[10px] opacity-60 truncate">{item.description}</div>
                </div>
              )}

              {!collapsed && isActive && (
                <ChevronRight size={14} className="flex-shrink-0 text-cyan-accent/60" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="px-4 py-4 border-t border-slate-border/20">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-muted mb-2">
              System Status
            </div>
            {[
              { label: 'Network', status: 'online' },
              { label: 'AI Engine', status: 'online' },
              { label: 'Sensors', status: 'warning' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.status === 'online'
                        ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]'
                        : s.status === 'warning'
                        ? 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)] animate-pulse'
                        : 'bg-red-400'
                    }`}
                  />
                  {s.label}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    s.status === 'online'
                      ? 'text-emerald-400'
                      : s.status === 'warning'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden glass-button p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface/80 backdrop-blur-xl border-r border-slate-border/20 
          shadow-panel transform transition-transform duration-300 lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-surface/60 backdrop-blur-xl border-r border-slate-border/20 
          shadow-panel transition-all duration-300 flex-shrink-0 relative
          ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-surface border border-slate-border/40 
            flex items-center justify-center shadow-panel hover:border-cyan-accent/50 
            hover:shadow-cyan-glow-sm transition-all duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            size={12}
            className={`text-text-secondary transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}
