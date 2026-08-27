import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  FolderGit2,
  Cpu,
  Users,
  UserCheck,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Settings,
  Share2,
  X,
  ShieldCheck,
} from 'lucide-react';

const mainNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
  { name: 'Quote Requests', path: '/admin/quotes', icon: FileText },
];

const contentNavItems = [
  { name: 'Services', path: '/admin/services', icon: Cpu },
  { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { name: 'Case Studies', path: '/admin/case-studies', icon: BookOpen },
  { name: 'Founder', path: '/admin/founder', icon: UserCheck },
  { name: 'Team', path: '/admin/team', icon: Users },
  { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
];

const websiteNavItems = [
  { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  { name: 'Social Links', path: '/admin/social-links', icon: Share2 },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  const renderNavLink = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            isActive
              ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-md shadow-cyan-950/40 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`
        }
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.name}</span>
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-slate-800 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 bg-[#0d1322]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#0f172a] border border-slate-700/60 p-1.5 rounded-lg shadow-sm">
            <img
              src="/images/nexgen-logo.png"
              alt="NexGen Logo"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
              NexGen Admin
            </h2>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Management Portal
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close navigation drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        {/* Main Lead Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Overview & Leads
          </div>
          {mainNavItems.map(renderNavLink)}
        </div>

        {/* Content Management Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Content Management
          </div>
          {contentNavItems.map(renderNavLink)}
        </div>

        {/* Website Settings Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Website Configuration
          </div>
          {websiteNavItems.map(renderNavLink)}
        </div>
      </div>

      {/* Footer System Info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0d1322]/60">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate font-medium">Internal System v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 max-w-[80vw] z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
