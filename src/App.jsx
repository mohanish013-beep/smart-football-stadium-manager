import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 🚀 LIVE GEMINI AI ENGINE
// ==========================================
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

async function fetchGeminiResponse(query, venueName) {
  const sanitizedQuery = query.replace(/[<>]/g, "").trim();
  if (!sanitizedQuery) return "Please ask a valid question.";
  if (!API_KEY) return "🔑 Configuration Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your Vercel Environment Variables and redeploy.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an elite AI Stadium Operations & Fan Assistant for the venue "${venueName}" during the 2026 FIFA World Cup. 
                  Answer the user's query professionally, concisely, and with premium stadium command-center authority. Keep answers brief (2-3 sentences max) and highly contextual to match-day logistics.
                  
                  User Query: "${sanitizedQuery}"`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    return "The assistant encountered an unexpected response structure. Please query again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Network connectivity failure. Unable to contact Gemini AI servers.";
  }
}

// ==========================================
// 🖥️ MAIN PREMIUM DASHBOARD COMPONENT
// ==========================================
export default function SmartStadiumManager() {
  // Application States
  const [selectedVenue, setSelectedVenue] = useState({
    name: "Estadio Azteca",
    city: "Mexico City",
    cap: "87,523",
    occupancy: "94%"
  });

  const [activePath, setActivePath] = useState(null);
  const [sosLogs, setSosLogs] = useState([
    { time: "14:02:11", msg: "SYS: All perimeter scanning systems operational." },
    { time: "14:05:32", msg: "STAFF: Section 214 crowd density stabilizing." }
  ]);
  const [isSosPending, setIsSosPending] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Welcome to the Command Hub. How can I assist your stadium operations or venue navigation today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Handle AI Chat Submissions
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setChatInput("");
    setIsAiTyping(true);

    const aiReply = await fetchGeminiResponse(query, selectedVenue.name);

    setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    setIsAiTyping(false);
  };

  // Handle SOS Activations
  const triggerSosAlert = () => {
    setIsSosPending(true);
    const timestamp = new Date().toTimeString().split(' ')[0];

    setTimeout(() => {
      setSosLogs(prev => [
        { time: timestamp, msg: `🚨 ALERT: Emergency SOS dispatch triggered at ${selectedVenue.name}!` },
        ...prev
      ]);
      setIsSosPending(false);
    }, 1200);
  };

  // Map Navigation Targets
  const targetLocations = [
    { id: 'food', label: '🍔 East Food Court', desc: 'Fastest step-free route to concessions.' },
    { id: 'washroom', label: '🚻 North Restrooms', desc: 'Monitored low-occupancy sanitation hub.' },
    { id: 'exit', label: '🚪 Main Exit Gate', desc: 'Primary clearing zone via North Corridor.' }
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-gray-100 font-sans antialiased p-4 md:p-6 selection:bg-[#10B981]/30">

      {/* 1. TOP HEADER BRANDING */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-gradient-to-r from-[#00F2FE] to-[#10B981] text-transparent bg-clip-text font-black text-xl tracking-wider uppercase">
              FIFA 2026 COMMAND HUB
            </span>
            <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-[#10B981]/20 rounded">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Simultaneous Venue Monitoring & Spatial Intelligence</p>
        </div>
        <div className="bg-[#111726] border border-white/5 rounded-xl px-4 py-2 text-right">
          <div className="text-sm font-bold text-white">{selectedVenue.name}</div>
          <div className="text-[11px] text-gray-400">{selectedVenue.city} • Capacity: {selectedVenue.cap}</div>
        </div>
      </header>

      {/* 2. LIVE TOURNAMENT MATCH TICKER */}
      <div className="bg-[#111726]/90 border border-white/10 p-3 rounded-xl flex items-center space-x-4 mb-6 overflow-hidden shadow-lg shadow-black/40">
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-2 py-0.5 rounded tracking-widest animate-pulse flex-shrink-0">
          LIVE MATCH SCENE
        </span>
        <div className="text-xs text-gray-300 tracking-wide flex space-x-12 animate-none overflow-x-auto whitespace-nowrap scrollbar-none w-full">
          <span>🏟️ <strong className="text-white">Estadio Azteca:</strong> Mexico vs Italy (1 - 1) • 74'</span>
          <span className="text-gray-700">|</span>
          <span>🏟️ <strong className="text-gray-400">MetLife Stadium:</strong> Brazil vs Argentina • 20:00 Local</span>
          <span className="text-gray-700">|</span>
          <span>🏟️ <strong className="text-gray-400">SoFi Stadium:</strong> France vs Germany • Tomorrow</span>
        </div>
      </div>

      {/* 3. MULTI-VENUE GRID SELECTOR */}
      <section className="mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">Select Active Stadium Command Canvas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Estadio Azteca", city: "Mexico City", cap: "87,523", occupancy: "94%" },
            { name: "MetLife Stadium", city: "East Rutherford", cap: "82,500", occupancy: "88%" },
            { name: "SoFi Stadium", city: "Inglewood", cap: "70,240", occupancy: "91%" },
            { name: "BC Place", city: "Vancouver", cap: "54,500", occupancy: "79%" }
          ].map((venue) => {
            const isActive = selectedVenue.name === venue.name;
            return (
              <div
                key={venue.name}
                onClick={() => setSelectedVenue(venue)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${isActive
                    ? 'bg-[#111726] border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                    : 'bg-[#111726]/40 border-white/5 hover:border-white/20'
                  }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white text-sm tracking-wide">{venue.name}</h3>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10B981] shadow-[0_0_8px_#10B981]' : 'bg-gray-600'}`}></span>
                </div>
                <p className="text-[11px] text-gray-400 mb-3">{venue.city}</p>
                <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isActive ? 'bg-gradient-to-r from-[#10B981] to-[#00F2FE]' : 'bg-gray-700'}`}
                    style={{ width: venue.occupancy }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] mt-1.5 text-gray-500">
                  <span>Live Load</span>
                  <span className={isActive ? 'text-[#10B981] font-bold' : ''}>{venue.occupancy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE DATA GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT/CENTER INTERACTIVE MAP WORKSPACE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111726] border border-white/80 border-opacity-5 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Spatial Navigation Vector</h2>
                <p className="text-[11px] text-gray-400">Click a node system target below to verify active telemetry paths</p>
              </div>
              {activePath && (
                <button
                  onClick={() => setActivePath(null)}
                  className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2 py-1 rounded"
                >
                  Clear Vector Route
                </button>
              )}
            </div>

            {/* HIGH-END SVG STADIUM WIREFRAME MAP */}
            <div className="relative w-full bg-[#090D16] border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[340px]">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

              <svg viewBox="0 0 600 320" className="w-full h-auto max-w-xl">
                <defs>
                  <filter id="glow-mint" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Stadium Outer Blueprint Base */}
                <ellipse cx="300" cy="160" rx="240" ry="130" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <ellipse cx="300" cy="160" rx="220" ry="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="5,5" />
                <rect x="180" y="90" width="240" height="140" rx="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />

                {/* Vector Grid Connections (Static Background paths) */}
                <line x1="300" y1="160" x2="140" y2="160" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                <line x1="300" y1="160" x2="300" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                <line x1="300" y1="160" x2="480" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                <line x1="300" y1="160" x2="300" y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />

                {/* ACTIVE GLOWING NEON ROUTE PATHWAY */}
                {activePath === 'food' && (
                  <path d="M 300 160 L 300 210 L 480 110" fill="none" stroke="#10B981" strokeWidth="3" filter="url(#glow-mint)" strokeLinecap="round" className="animate-pulse" />
                )}
                {activePath === 'washroom' && (
                  <path d="M 300 160 L 300 60" fill="none" stroke="#10B981" strokeWidth="3" filter="url(#glow-mint)" strokeLinecap="round" className="animate-pulse" />
                )}
                {activePath === 'exit' && (
                  <path d="M 300 160 L 140 160" fill="none" stroke="#10B981" strokeWidth="3" filter="url(#glow-mint)" strokeLinecap="round" className="animate-pulse" />
                )}

                {/* Spatial Map Nodes */}
                {/* Central Location */}
                <circle cx="300" cy="160" r="7" fill="#00F2FE" />
                <circle cx="300" cy="160" r="14" fill="none" stroke="#00F2FE" strokeWidth="1.5" className="animate-ping opacity-40" style={{ animationDuration: '3s' }} />
                <text x="300" y="182" fill="#00F2FE" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">YOU (CENTRAL BLOCK)</text>

                {/* Target Node: West Wing (Exit) */}
                <circle cx="140" cy="160" r="5" fill={activePath === 'exit' ? '#10B981' : '#1e293b'} stroke="white" strokeWidth="1.5" />
                <text x="130" y="145" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="start">Exit Gate (North)</text>

                {/* Target Node: North Restrooms */}
                <circle cx="300" cy="60" r="5" fill={activePath === 'washroom' ? '#10B981' : '#1e293b'} stroke="white" strokeWidth="1.5" />
                <text x="300" y="48" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">North Washrooms</text>

                {/* Target Node: East Food Court */}
                <circle cx="480" cy="110" r="5" fill={activePath === 'food' ? '#10B981' : '#1e293b'} stroke="white" strokeWidth="1.5" />
                <text x="490" y="114" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="start">East Food Court</text>
              </svg>
            </div>

            {/* Target Selectors Navigation Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {targetLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setActivePath(loc.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${activePath === loc.id
                      ? 'bg-[#10B981]/10 border-[#10B981]'
                      : 'bg-[#090D16]/50 border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className="text-xs font-bold text-white">{loc.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{loc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN PANELS: SOS INCIDENTS & AI PILOT CHAT CONTAINER */}
        <div className="space-y-6">

          {/* A. EMERGENCY SYSTEM CONSOLE */}
          <div className="bg-[#111726] border border-white/5 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Emergency Incident Core
              </h2>
              <span className="text-[9px] text-gray-500 font-mono tracking-wider">SECURE LINK V2</span>
            </div>

            <button
              onClick={triggerSosAlert}
              disabled={isSosPending}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all uppercase flex items-center justify-center ${isSosPending
                  ? 'bg-red-900/40 text-red-400 border border-red-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-900/20 border border-red-400/20'
                }`}
            >
              {isSosPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Syncing Secure Coordinates...
                </span>
              ) : "🚨 Fire Incident SOS Override"}
            </button>

            {/* Tactical Stream Log Box */}
            <div className="mt-3 bg-[#090D16] border border-white/5 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[11px] space-y-2 text-left">
              {sosLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-gray-500 mr-2">[{log.time}]</span>
                  <span className={log.msg.includes('🚨') ? 'text-red-400 font-bold' : 'text-gray-400'}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* B. PREMIUM AI ASSISTANT CONSOLE PORTS */}
          <div className="bg-[#111726] border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col h-[395px]">
            <div className="border-b border-white/5 pb-2.5 mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white">Gemini Operations Assistant</h2>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{selectedVenue.name} Node</span>
            </div>

            {/* Conversational Stream Flow Panel */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left scrollbar-none mb-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed border ${msg.sender === 'user'
                      ? 'bg-[#1e293b]/50 text-white border-[#00F2FE]/20 rounded-tr-none'
                      : 'bg-[#090D16]/90 text-gray-200 border-white/5 rounded-tl-none'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#090D16]/90 border border-white/5 text-gray-400 rounded-xl rounded-tl-none px-4 py-2.5 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Clickable Quick Action Chips Panel */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {[
                { label: "🍔 Fast Food Path", text: "What is the quickest path configuration to reach the local concessions stands from the central block?" },
                { label: "🚻 Clean Restrooms", text: "Are there low-occupancy washrooms currently operating within the North or South corridors?" },
                { label: "🚪 Main Exit Route", text: "Provide emergency stair-free exit navigation data for standard spectators." }
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSendMessage(chip.text)}
                  className="text-[10px] bg-white/5 hover:bg-[#00F2FE]/10 hover:text-[#00F2FE] border border-white/5 hover:border-[#00F2FE]/20 text-gray-400 px-2.5 py-1 rounded-full transition-all duration-200 whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Capsule Dock */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="relative flex items-center bg-[#090D16] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#00F2FE]/50 transition-all"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask the ${selectedVenue.name} AI...`}
                className="w-full bg-transparent text-xs text-white placeholder-gray-500 py-3 pl-4 pr-12 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-[#00F2FE] hover:text-[#10B981] transition-colors"
                aria-label="Send query"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-7-9-7v14z" />
                </svg>
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}