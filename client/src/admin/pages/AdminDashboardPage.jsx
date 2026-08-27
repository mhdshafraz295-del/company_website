import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import {
  Inbox,
  FileText,
  FolderGit2,
  Cpu,
  Users,
  Settings,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';

const quickAccessCards = [
  {
    title: 'Enquiries',
    description: 'Review and manage incoming contact requests.',
    path: '/admin/enquiries',
    icon: Inbox,
    color: 'from-blue-600/20 to-blue-500/10 border-blue-800/40 text-blue-400',
  },
  {
    title: 'Quote Requests',
    description: 'Track multi-step custom project quote submissions.',
    path: '/admin/quotes',
    icon: FileText,
    color: 'from-cyan-600/20 to-cyan-500/10 border-cyan-800/40 text-cyan-400',
  },
  {
    title: 'Portfolio Projects',
    description: 'Manage featured client projects and case studies.',
    path: '/admin/projects',
    icon: FolderGit2,
    color: 'from-emerald-600/20 to-emerald-500/10 border-emerald-800/40 text-emerald-400',
  },
  {
    title: 'Services Catalog',
    description: 'Update official NexGen service offerings.',
    path: '/admin/services',
    icon: Cpu,
    color: 'from-indigo-600/20 to-indigo-500/10 border-indigo-800/40 text-indigo-400',
  },
  {
    title: 'Team Members',
    description: 'Configure active company personnel profiles.',
    path: '/admin/team',
    icon: Users,
    color: 'from-violet-600/20 to-violet-500/10 border-violet-800/40 text-violet-400',
  },
  {
    title: 'Website Settings',
    description: 'Configure corporate information and hero content.',
    path: '/admin/settings',
    icon: Settings,
    color: 'from-slate-600/20 to-slate-500/10 border-slate-700/60 text-slate-300',
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    totalQuotes: 0,
    newQuotes: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoadingStats(true);
      try {
        const [enqRes, newEnqRes, qRes, newQRes] = await Promise.all([
          api.get('/enquiries', { params: { limit: 5 } }),
          api.get('/enquiries', { params: { status: 'NEW', limit: 1 } }),
          api.get('/quotes', { params: { limit: 5 } }),
          api.get('/quotes', { params: { status: 'NEW', limit: 1 } }),
        ]);

        setStats({
          totalEnquiries: enqRes.data?.meta?.total || 0,
          newEnquiries: newEnqRes.data?.meta?.total || 0,
          totalQuotes: qRes.data?.meta?.total || 0,
          newQuotes: newQRes.data?.meta?.total || 0,
        });

        setRecentEnquiries(enqRes.data?.data || []);
        setRecentQuotes(qRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load admin dashboard lead stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchLeadData();
  }, []);

  const formatRole = (role) => {
    if (!role) return 'Admin';
    if (role === 'SUPER_ADMIN') return 'Super Administrator';
    return 'Administrator';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'First Login Session';
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NexGen Authenticated Session</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Welcome to the internal NexGen Solutions Management Portal. Below is a real-time lead summary and quick access navigation.
          </p>
        </div>
      </div>

      {/* Live Lead Summary Stats Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Lead Summary Counters</span>
          </h2>
          {loadingStats && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              New Enquiries
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {stats.newEnquiries}
            </div>
          </div>

          <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Enquiries
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.totalEnquiries}
            </div>
          </div>

          <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              New Quote Requests
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">
              {stats.newQuotes}
            </div>
          </div>

          <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Quotes
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.totalQuotes}
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Info Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-800/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Role
            </p>
            <p className="text-sm font-bold text-white">
              {formatRole(user?.role)}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-800/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Account Email
            </p>
            <p className="text-sm font-bold text-white truncate max-w-[180px]">
              {user?.email || 'admin@nexgen.local'}
            </p>
          </div>
        </div>

        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-800/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Last Login
            </p>
            <p className="text-xs font-semibold text-slate-200">
              {formatDate(user?.lastLoginAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Lead Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-cyan-400" />
              <span>Recent Enquiries</span>
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-2.5">
              {recentEnquiries.map((e) => (
                <div key={e.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{e.fullName}</span>
                    <span className="text-slate-400 text-[11px]">{e.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {e.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No enquiries recorded yet.</p>
          )}
        </div>

        {/* Recent Quote Requests */}
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Recent Quote Requests</span>
            </h3>
            <Link to="/admin/quotes" className="text-xs text-teal-400 hover:underline font-semibold flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentQuotes.length > 0 ? (
            <div className="space-y-2.5">
              {recentQuotes.map((q) => (
                <div key={q.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{q.fullName}</span>
                    <span className="text-teal-400 text-[11px] font-medium">{q.serviceName || 'Custom Project'}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800">
                      {q.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No quote requests recorded yet.</p>
          )}
        </div>
      </div>

      {/* Quick Access Management Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Quick Management Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.path}
                to={card.path}
                className="group relative bg-[#0d1322]/70 hover:bg-[#0f172a] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br border ${card.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                      <span>{card.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
