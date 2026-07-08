import React, { useEffect, useState } from 'react';
import { Moon, Sun, Cloud, CloudRain, Sun as SunIcon } from 'lucide-react';

export default function Header({ isDarkMode, toggleTheme }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Mexico City Coordinates: Lat 19.43, Lon -99.13
    fetch('https://api.open-meteo.com/v1/forecast?latitude=19.43&longitude=-99.13&current_weather=true')
      .then(res => res.json())
      .then(data => {
        setWeather(data.current_weather);
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);

  return (
    <header className="glass-panel p-4 mb-6 flex justify-between items-center z-10 relative">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fifa-green to-fifa-purple">
          Estadio Azteca Hub
        </h1>
        <div className="hidden md:flex items-center space-x-2 text-sm font-medium opacity-80" aria-live="polite">
          {weather ? (
            <>
              {weather.weathercode > 50 ? <CloudRain size={18} /> : (weather.weathercode > 0 ? <Cloud size={18} /> : <SunIcon size={18} />)}
              <span>{weather.temperature}°C</span>
            </>
          ) : (
            <span>Loading weather...</span>
          )}
        </div>
      </div>
      
      <button 
        onClick={toggleTheme} 
        className="p-2 rounded-full glass-button focus:outline-none focus:ring-2 focus:ring-fifa-green"
        aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
      </button>
    </header>
  );
}
