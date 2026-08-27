import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function PublicLayout() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark'
          ? 'dark bg-[#030712] text-slate-100'
          : 'bg-[#F8FBFF] text-slate-900'
      }`}
    >
      {/* Subtle Ambient Light Gradient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[550px] h-[550px] bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
