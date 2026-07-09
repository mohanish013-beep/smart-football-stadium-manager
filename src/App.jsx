import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OperationsPage from './pages/OperationsPage.jsx';
import LogisticsPage from './pages/LogisticsPage.jsx';

export default function App() {
  return (
    <div className="flex h-screen bg-midnight overflow-hidden bg-grid">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}