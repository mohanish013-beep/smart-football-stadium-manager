import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InteractiveMap from './components/InteractiveMap';
import AiAssistant from './components/AiAssistant';
import EmergencyPanel from './components/EmergencyPanel';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen ${isEmergencyActive ? 'bg-red-900/20' : ''}`}>
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-radial from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 transition-colors duration-500"></div>
      
      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-fifa-green/10 dark:bg-fifa-green/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-fifa-purple/10 dark:bg-fifa-purple/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      {isEmergencyActive && (
        <div className="fixed inset-0 z-0 border-[16px] border-red-600/50 pointer-events-none animate-pulse"></div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-screen">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        {/* Global Screen Reader Alert for Emergencies */}
        <div aria-live="assertive" className="sr-only">
          {isEmergencyActive ? "EMERGENCY SYSTEM ACTIVATED. PLEASE FOLLOW ON-SCREEN INSTRUCTIONS." : "Emergency system deactivated."}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* Left Column - Map (Takes up 2 cols on lg screens) */}
          <section className="lg:col-span-2 flex flex-col min-h-[500px]">
            <InteractiveMap isEmergencyActive={isEmergencyActive} />
          </section>

          {/* Right Column - AI and Emergency */}
          <section className="flex flex-col space-y-6">
            <EmergencyPanel onEmergencyTriggered={setIsEmergencyActive} />
            <div className="flex-1">
              <AiAssistant />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
