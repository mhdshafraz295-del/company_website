import React from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Menu, LogOut, Shield } from 'lucide-react';

const routeTitleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/enquiries': 'Enquiries Management',
  '/admin/quotes': 'Quote Requests Management',
  '/admin/projects': 'Portfolio Projects',
  '/admin/services': 'Services Management',
  '/admin/team': 'Team Members',
  '/admin/founder': 'Founder Profile',
  '/admin/testimonials': 'Testimonials',
  '/admin/case-studies': 'Case Studies',
  '/admin/faqs': 'FAQs',
  '/admin/settings': 'Website Settings',
};

export default function AdminHeader({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const title = routeTitleMap[location.pathname] || 'Admin Portal';

  // Format raw role e.g. SUPER_ADMIN -> Super Admin, ADMIN -> Admin
  const formatRole = (role) => {
    if (!role) return 'Admin';
    if (role === 'SUPER_ADMIN') return 'Super Admin';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 bg-[#0d1322]/90 border-b border-slate-800/80 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Admin User Profile & Logout */}
      <div className="flex items-center space-x-4">
        {/* User Info Badge */}
        <div className="flex items-center space-x-3 bg-[#0b0f19] border border-slate-800 py-1.5 px-3 rounded-xl">
          {/* Avatar Circle */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
            {getInitials(user?.name)}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">
              {user?.name || 'NexGen Admin'}
            </span>
            <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-medium">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>{formatRole(user?.role)}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center space-x-1.5 bg-slate-800/60 hover:bg-red-950/60 border border-slate-700/60 hover:border-red-800/60 text-slate-300 hover:text-red-300 py-2 px-3 rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
