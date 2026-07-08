import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import stadiumGraph from '../stadiumGraph.json';
import { findShortestPath } from '../pathfinding';

export default function InteractiveMap({ isEmergencyActive }) {
  const [activePath, setActivePath] = useState([]);
  const [destination, setDestination] = useState(null);
  const userLocationId = 'A1'; // Fixed starting point as requested

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
      const node = stadiumGraph.nodes.find(n => n.id === nodeId);
      if (index === 0) {
        d += `M ${node.x} ${node.y} `;
      } else {
        d += `L ${node.x} ${node.y} `;
      }
    });
    return d;
  };

  const getPathStatusMessage = () => {
    if (destination) {
      const targetNode = stadiumGraph.nodes.find(n => n.id === destination);
      return `Routing to ${targetNode?.label}.`;
    }
    return "Select a destination on the map.";
  };

  return (
    <div className={`glass-panel p-4 h-full flex flex-col ${isEmergencyActive ? 'border-red-500/50' : ''}`} aria-label="Interactive Stadium Map">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg flex items-center">
          <MapPin className="mr-2 text-fifa-green" /> Stadium Map
        </h2>
        <div className="text-sm px-3 py-1 bg-white/10 rounded-full flex items-center">
          <Navigation size={14} className="mr-2" />
          <span>{destination ? `Navigating to: ${stadiumGraph.nodes.find(n=>n.id===destination)?.label}` : 'Select Destination'}</span>
        </div>
      </div>
      
      {/* Screen reader only live region for routing */}
      <div aria-live="polite" className="sr-only">
        {getPathStatusMessage()}
      </div>

      <div className="flex-1 relative bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Simple mock map SVG */}
        <svg viewBox="0 0 800 600" className="w-full h-full p-4" aria-label="Stadium layout map">
          {/* Base Layout: Field / Stadium outline */}
          <rect x="250" y="200" width="300" height="200" rx="40" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="4" />
          
          {/* Edges */}
          {stadiumGraph.edges.map((edge, i) => {
            const source = stadiumGraph.nodes.find(n => n.id === edge.source);
            const target = stadiumGraph.nodes.find(n => n.id === edge.target);
            return (
              <line 
                key={i} 
                x1={source.x} y1={source.y} 
                x2={target.x} y2={target.y} 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="2" 
              />
            );
          })}

          {/* Active Path */}
          {activePath.length > 1 && (
            <motion.path
              d={getPathData()}
              fill="none"
              stroke={isEmergencyActive ? "#ef4444" : "#00ff87"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}

          {/* Nodes */}
          {stadiumGraph.nodes.map(node => {
            const isUserLocation = node.id === userLocationId;
            const isDestination = node.id === destination;
            const isPathNode = activePath.includes(node.id);
            
            let fill = "rgba(255, 255, 255, 0.2)";
            let stroke = "rgba(255, 255, 255, 0.5)";
            
            if (isUserLocation) {
              fill = "#6300ff"; // fifa-purple
              stroke = "#fff";
            } else if (isDestination) {
              fill = "#00ff87"; // fifa-green
              stroke = "#fff";
            } else if (isPathNode) {
              fill = "rgba(0, 255, 135, 0.5)";
            }

            if (node.type === "fire_exit" && isEmergencyActive) {
              fill = "#ef4444"; // red
              stroke = "#fca5a5";
            }

            return (
              <g 
                key={node.id} 
                className="cursor-pointer" 
                onClick={() => handleNodeClick(node.id)}
                aria-label={`Node: ${node.label}`}
                role="button"
              >
                <circle 
                  cx={node.x} cy={node.y} 
                  r={isUserLocation || isDestination ? 14 : 10} 
                  fill={fill} 
                  stroke={stroke}
                  strokeWidth="2"
                  className="transition-all duration-300 hover:fill-white/50"
                />
                <text 
                  x={node.x} y={node.y + 25} 
                  fill="currentColor" 
                  fontSize="12" 
                  textAnchor="middle" 
                  className={`opacity-70 ${isDestination || isUserLocation ? 'font-bold opacity-100' : ''}`}
                >
                  {node.label}
                </text>
                
                {isUserLocation && (
                  <text x={node.x} y={node.y - 20} fill="#6300ff" fontSize="12" fontWeight="bold" textAnchor="middle">
                    You
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
