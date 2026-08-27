import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  Layers,
} from 'lucide-react';

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'NEW', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { label: 'Contacted', value: 'CONTACTED', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { label: 'In Discussion', value: 'IN_DISCUSSION', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { label: 'Converted', value: 'CONVERTED', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { label: 'Completed', value: 'COMPLETED', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
  { label: 'Rejected', value: 'REJECTED', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const fetchQuotes = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/quotes', { params });
      if (res.data?.success) {
        setQuotes(res.data.data || []);
        const meta = res.data.pagination || res.data.meta;
        if (meta) {
          setPagination({
            page: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch quote requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuotes(1);
  };

  const handleOpenDetail = (quote) => {
    setSelectedQuote(quote);
    setAdminNotes(quote.adminNotes || '');
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/quotes/${quoteId}/status`, { status: newStatus });
      if (res.data?.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert('Failed to update quote status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNotesSave = async () => {
    if (!selectedQuote) return;
    setUpdatingNotes(true);
    try {
      const res = await api.patch(`/quotes/${selectedQuote.id}/notes`, { adminNotes });
      if (res.data?.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === selectedQuote.id ? { ...q, adminNotes } : q))
        );
        setSelectedQuote((prev) => ({ ...prev, adminNotes }));
      }
    } catch (err) {
      alert('Failed to update admin notes.');
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote request record?')) return;
    try {
      const res = await api.delete(`/quotes/${quoteId}`);
      if (res.data?.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote(null);
        }
      }
    } catch (err) {
      alert('Failed to delete quote request.');
    }
  };

  const getStatusBadge = (status) => {
    const matched = statusOptions.find((s) => s.value === status);
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
          matched?.color || 'bg-slate-800 text-slate-300 border-slate-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Project Estimation Requests</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Quote Requests</h1>
          <p className="text-xs text-slate-400">
            Review detailed project scope submissions, budget expectations, and client requirements.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-white">{pagination.total}</span>
          <span className="text-xs text-slate-400 block font-medium">Total Quotes</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search client, service, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading quote requests...</p>
        </div>
      ) : quotes.length > 0 ? (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Requested Service</th>
                  <th className="py-3.5 px-4">Budget & Timeline</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{quote.fullName}</div>
                      <a href={`mailto:${quote.email}`} className="text-cyan-400 hover:underline">
                        {quote.email}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">
                        {quote.serviceName || quote.service?.title || 'Custom Software'}
                      </div>
                      <div className="text-[11px] text-slate-500">{quote.companyName || 'Private Client'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-emerald-400 font-bold">{quote.budgetRange || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{quote.timeline || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(quote.status)}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(quote)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
            <span className="text-xs text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchQuotes(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchQuotes(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0d1322]/80 border border-slate-800 rounded-2xl space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Quote Requests Found</h3>
          <p className="text-xs text-slate-400">
            Submissions from the Get a Quote form will appear here.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                Quote Request #{selectedQuote.id}
              </span>
              <h2 className="text-xl font-extrabold text-white">{selectedQuote.fullName}</h2>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${selectedQuote.email}`} className="text-white hover:underline truncate">
                  {selectedQuote.email}
                </a>
              </div>
              {selectedQuote.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`tel:${selectedQuote.phone}`} className="text-white hover:underline">
                    {selectedQuote.phone}
                  </a>
                </div>
              )}
              {selectedQuote.companyName && (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-slate-300">{selectedQuote.companyName}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-300">
                  {new Date(selectedQuote.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Project Scope & Requirements Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Service</span>
                </span>
                <p className="font-bold text-white mt-0.5">
                  {selectedQuote.serviceName || selectedQuote.service?.title || 'Custom Project'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Budget</span>
                </span>
                <p className="font-bold text-emerald-400 mt-0.5">
                  {selectedQuote.budgetRange || 'Not Specified'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Timeline</span>
                </span>
                <p className="font-bold text-white mt-0.5">
                  {selectedQuote.timeline || 'Flexible'}
                </p>
              </div>
            </div>

            {/* Full Project Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Project Description & Scope
              </label>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedQuote.projectDescription}
              </div>
            </div>

            {/* Status Manager */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Update Quote Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.slice(1).map((opt) => (
                  <button
                    key={opt.value}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(selectedQuote.id, opt.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedQuote.status === opt.value
                        ? opt.color + ' ring-2 ring-cyan-500/50 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Internal Admin Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add internal notes regarding scope estimation, proposal status..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleNotesSave}
                disabled={updatingNotes}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 px-4 rounded-xl transition flex items-center space-x-1.5"
              >
                {updatingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
