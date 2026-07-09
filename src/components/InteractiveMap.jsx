import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Target } from 'lucide-react';
import stadiumGraph from '../stadiumGraph.json';
import { findShortestPath } from '../pathfinding';

const NODE_COLORS = {
  default: { fill: 'rgba(71,85,105,0.6)', stroke: 'rgba(71,85,105,0.8)' },
  user: { fill: '#06b6d4', stroke: '#67e8f9' },
  destination: { fill: '#10b981', stroke: '#6ee7b7' },
  pathNode: { fill: 'rgba(6,182,212,0.4)', stroke: 'rgba(6,182,212,0.8)' },
  fireExit: { fill: 'rgba(239,68,68,0.8)', stroke: '#fca5a5' },
};

const NODE_LABELS = {
  seat: '🪑',
  washroom: '🚻',
  food: '🍔',
  exit: '🚪',
  fire_exit: '🔴',
  corridor: '⬤',
};

export default function InteractiveMap({ isEmergencyActive }) {
  const [activePath, setActivePath] = useState([]);
  const [destination, setDestination] = useState(null);
  const userLocationId = 'A1';

  const handleNodeClick = (nodeId) => {
    if (nodeId === userLocationId) return;
    setDestination(nodeId);
    const path = findShortestPath(stadiumGraph, userLocationId, nodeId);
    setActivePath(path);
  };

  const getPathData = () => {
    if (activePath.length < 2) return '';
    let d = '';
    activePath.forEach((nodeId, index) => {
      const node = stadiumGraph.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      if (index === 0) {
        d += `M ${node.x} ${node.y} `;
      } else {
        d += `L ${node.x} ${node.y} `;
      }
    });
    return d;
  };

  const getNodeColors = (node) => {
    const isUserLocation = node.id === userLocationId;
    const isDestination = node.id === destination;
    const isPathNode = activePath.includes(node.id);

    if (isEmergencyActive && node.type === 'fire_exit') return NODE_COLORS.fireExit;
    if (isUserLocation) return NODE_COLORS.user;
    if (isDestination) return NODE_COLORS.destination;
    if (isPathNode) return NODE_COLORS.pathNode;
    return NODE_COLORS.default;
  };

  const pathColor = isEmergencyActive ? '#ef4444' : '#06b6d4';
  const destNode = stadiumGraph.nodes.find((n) => n.id === destination);

  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 ${isEmergencyActive ? 'rounded-xl border border-red-500/30' : ''}`}
      aria-label="Interactive Stadium Map"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <div className="w-2 h-2 rounded-full bg-cyan-accent shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
          You: Block A - Seats
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Navigation size={12} className={isEmergencyActive ? 'text-red-400' : 'text-cyan-accent'} />
          <span className="text-text-secondary">
            {destination ? `→ ${destNode?.label}` : 'Tap node to navigate'}
          </span>
        </div>
      </div>

      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        {destination
          ? `Routing to ${destNode?.label}.`
          : 'Select a destination on the map.'}
      </div>

      {/* SVG Map */}
      <div
        className={`flex-1 bg-midnight/60 rounded-xl border overflow-hidden flex items-center justify-center
          ${isEmergencyActive ? 'border-red-500/20' : 'border-slate-border/20'}`}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full p-4"
          aria-label="Stadium layout map"
        >
          {/* Grid lines for depth */}
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(71,85,105,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Stadium field outline */}
          <rect
            x="250"
            y="180"
            width="300"
            height="210"
            rx="50"
            fill="rgba(16,185,129,0.04)"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <text x="400" y="292" fill="rgba(16,185,129,0.25)" fontSize="13" textAnchor="middle" fontWeight="600">
            PITCH
          </text>

          {/* Edges */}
          {stadiumGraph.edges.map((edge, i) => {
            const source = stadiumGraph.nodes.find((n) => n.id === edge.source);
            const target = stadiumGraph.nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(71,85,105,0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Active Path */}
          {activePath.length > 1 && (
            <motion.path
              d={getPathData()}
              fill="none"
              stroke={pathColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${pathColor})` }}
            />
          )}

          {/* Nodes */}
          {stadiumGraph.nodes.map((node) => {
            const isUserLocation = node.id === userLocationId;
            const isDestination = node.id === destination;
            const colors = getNodeColors(node);
            const radius = isUserLocation || isDestination ? 14 : 10;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => handleNodeClick(node.id)}
                aria-label={`${node.label} — click to navigate`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNodeClick(node.id)}
              >
                {/* Glow ring for user/destination */}
                {(isUserLocation || isDestination) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 8}
                    fill="none"
                    stroke={isUserLocation ? '#06b6d4' : '#10b981'}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                  className="transition-all duration-300 hover:brightness-125"
                />

                {/* Node type emoji for selected nodes */}
                {(isUserLocation || isDestination) && (
                  <text
                    x={node.x}
                    y={node.y - 22}
                    fill={isUserLocation ? '#06b6d4' : '#10b981'}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {isUserLocation ? 'YOU' : '▼'}
                  </text>
                )}

                <text
                  x={node.x}
                  y={node.y + 26}
                  fill="rgba(241,245,249,0.7)"
                  fontSize="10"
                  textAnchor="middle"
                  className={isDestination || isUserLocation ? 'font-bold' : ''}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2.5 text-[10px] text-slate-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-accent" />
          Your Location
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          Destination
        </div>
        {isEmergencyActive && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            Fire Exits
          </div>
        )}
      </div>
    </div>
  );
}
