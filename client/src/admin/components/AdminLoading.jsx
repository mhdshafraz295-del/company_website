import React from 'react';

export default function AdminLoading({ message = 'Verifying authentication...' }) {
  return (
    <div className="min-h-screen w-full bg-[#0a0e17] flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-300">
      <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
        {/* Logo Container with Ambient Glow */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-2xl blur-lg animate-pulse" />
          <div className="relative bg-[#0f172a]/80 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
            <img
              src="/images/nexgen-logo.png"
              alt="NexGen Solutions Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        {/* Spinner & Message */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
