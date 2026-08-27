import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Inbox,
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

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const fetchEnquiries = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/enquiries', { params });
      if (res.data?.success) {
        setEnquiries(res.data.data || []);
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
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries(1);
  };

  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setAdminNotes(enquiry.adminNotes || '');
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/enquiries/${enquiryId}/status`, { status: newStatus });
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNotesSave = async () => {
    if (!selectedEnquiry) return;
    setUpdatingNotes(true);
    try {
      const res = await api.patch(`/enquiries/${selectedEnquiry.id}/notes`, { adminNotes });
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, adminNotes } : e))
        );
        setSelectedEnquiry((prev) => ({ ...prev, adminNotes }));
      }
    } catch (err) {
      alert('Failed to update admin notes.');
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleDelete = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await api.delete(`/enquiries/${enquiryId}`);
      if (res.data?.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      alert('Failed to delete enquiry.');
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
            <Inbox className="w-4 h-4" />
            <span>Client Enquiries</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Contact Enquiries</h1>
          <p className="text-xs text-slate-400">
            Review and respond to general inquiries submitted by visitors.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-white">{pagination.total}</span>
          <span className="text-xs text-slate-400 block font-medium">Total Enquiries</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search name, email, description..."
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
          <p className="text-xs text-slate-400">Loading enquiries...</p>
        </div>
      ) : enquiries.length > 0 ? (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Company / Phone</th>
                  <th className="py-3.5 px-4">Message Snippet</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{enquiry.fullName}</div>
                      <a href={`mailto:${enquiry.email}`} className="text-cyan-400 hover:underline">
                        {enquiry.email}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div>{enquiry.companyName || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500">{enquiry.phone || ''}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="truncate text-slate-300">{enquiry.projectDescription}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(enquiry.status)}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(enquiry)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="p-2 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition"
                        title="Delete Enquiry"
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
                onClick={() => fetchEnquiries(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchEnquiries(pagination.page + 1)}
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
          <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Enquiries Found</h3>
          <p className="text-xs text-slate-400">
            Incoming contact form submissions will appear here.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                Enquiry Details #{selectedEnquiry.id}
              </span>
              <h2 className="text-xl font-extrabold text-white">{selectedEnquiry.fullName}</h2>
            </div>

            {/* Contact Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${selectedEnquiry.email}`} className="text-white hover:underline truncate">
                  {selectedEnquiry.email}
                </a>
              </div>
              {selectedEnquiry.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-white hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
              )}
              {selectedEnquiry.companyName && (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-slate-300">{selectedEnquiry.companyName}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-300">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Full Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Inquiry Message
              </label>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedEnquiry.projectDescription}
              </div>
            </div>

            {/* Status Manager */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Update Enquiry Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.slice(1).map((opt) => (
                  <button
                    key={opt.value}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(selectedEnquiry.id, opt.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedEnquiry.status === opt.value
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
                placeholder="Add internal notes regarding follow-up actions..."
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
