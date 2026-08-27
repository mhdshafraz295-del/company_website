import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminPlaceholderPage({ title = 'Management Module' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl animate-in fade-in duration-200">
      <div className="relative mb-6">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl blur-lg animate-pulse" />
        <div className="relative bg-[#0b0f19] border border-slate-700/60 p-4 rounded-2xl shadow-xl">
          <Layers className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full text-[11px] font-semibold text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Prepared Protected Route</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          This management section has been secured with Phase 4 admin authentication. Comprehensive CRUD workflows and data management will be enabled in Phase 5.
        </p>

        <div className="pt-4">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
