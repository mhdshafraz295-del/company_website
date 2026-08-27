import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { PublicDataContext } from '../../context/PublicDataContext';
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Search,
  Sparkles,
  Star,
  ThumbsUp,
} from 'lucide-react';

export default function AdminTestimonialsPage() {
  const publicContext = useContext(PublicDataContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    position: '',
    profileImage: '',
    rating: 5,
    review: '',
    approved: true,
    isVisible: true,
    displayOrder: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin/all');
      if (res.data?.success) {
        setTestimonials(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: '',
      company: '',
      position: '',
      profileImage: '',
      rating: 5,
      review: '',
      approved: true,
      isVisible: true,
      displayOrder: testimonials.length + 1,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTestimonial(t);
    setFormData({
      clientName: t.clientName || '',
      company: t.company || '',
      position: t.position || '',
      profileImage: t.profileImage || '',
      rating: t.rating || 5,
      review: t.review || '',
      approved: t.approved !== false,
      isVisible: t.isVisible !== false,
      displayOrder: t.displayOrder || 0,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleToggleApprove = async (id) => {
    try {
      const res = await api.patch(`/testimonials/${id}/approve`);
      if (res.data?.success) {
        await fetchTestimonials();
        if (publicContext?.refetchTestimonials) publicContext.refetchTestimonials();
      }
    } catch (err) {
      alert('Failed to update testimonial approval status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.clientName.trim() || !formData.review.trim()) {
      setErrorMessage('Client Name and Review text are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        clientName: formData.clientName.trim(),
        company: formData.company.trim() || undefined,
        position: formData.position.trim() || undefined,
        profileImage: formData.profileImage.trim() || undefined,
        rating: Math.min(5, Math.max(1, Number(formData.rating) || 5)),
        review: formData.review.trim(),
        approved: Boolean(formData.approved),
        isVisible: Boolean(formData.isVisible),
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editingTestimonial) {
        await api.patch(`/testimonials/${editingTestimonial.id}`, payload);
      } else {
        await api.post('/testimonials', payload);
      }

      setModalOpen(false);
      await fetchTestimonials();
      if (publicContext?.refetchTestimonials) publicContext.refetchTestimonials();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save testimonial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.data?.success) {
        setDeleteConfirm(null);
        await fetchTestimonials();
        if (publicContext?.refetchTestimonials) publicContext.refetchTestimonials();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete testimonial.');
    }
  };

  const filtered = testimonials.filter(
    (t) =>
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.review.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Client Reviews & Testimonials</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Testimonials CMS</h1>
          <p className="text-xs text-slate-400">
            Review, approve, and manage client feedback displayed on the public site.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center space-x-2 w-fit transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="flex items-center justify-between bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search client name, review..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">Total: {filtered.length}</span>
      </div>

      {/* Testimonials Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading testimonials...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Snippet</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{t.clientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {t.company ? `${t.company} ${t.position ? `(${t.position})` : ''}` : 'Private Client'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold">{t.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="truncate text-slate-300">{t.review}</p>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleApprove(t.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          t.approved
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                            : 'bg-amber-950 text-amber-400 border-amber-800 hover:bg-amber-900'
                        }`}
                        title="Click to toggle approval status"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{t.approved ? 'Approved' : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(t)}
                        className="p-2 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0d1322]/80 border border-slate-800 rounded-2xl space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Testimonials Found</h3>
          <p className="text-xs text-slate-400">Click "Add Testimonial" above to record client reviews.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {editingTestimonial ? editingTestimonial.clientName : 'Add Client Review'}
              </h2>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Company</label>
                  <input
                    type="text"
                    placeholder="TechCorp Global"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Position</label>
                  <input
                    type="text"
                    placeholder="VP of Engineering"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Rating (1–5 Stars)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Review Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed client testimonial text..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.approved}
                    onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-200">Approved</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-xs font-semibold text-slate-200">Visible Publicly</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Testimonial</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete testimonial from <strong className="text-white">"{deleteConfirm.clientName}"</strong>?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-xs font-bold text-white rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
