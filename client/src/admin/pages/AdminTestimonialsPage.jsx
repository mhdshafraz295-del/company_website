import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { PublicDataContext } from '../../context/PublicDataContext';
import ImageUploader from '../components/ImageUploader';
import {
  MessageSquare,
  Handshake,
  FolderGit2,
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
  const [collaboratorOptions, setCollaboratorOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
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
    collaboratorId: '',
    projectId: '',
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

  const fetchOptions = async () => {
    try {
      const [collabRes, projRes] = await Promise.all([
        api.get('/collaborators/admin/all'),
        api.get('/projects/admin/all?limit=100'),
      ]);
      if (collabRes.data?.success) setCollaboratorOptions(collabRes.data.data || []);
      if (projRes.data?.success) setProjectOptions(projRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch testimonial association options:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchOptions();
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
      collaboratorId: '',
      projectId: '',
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
      collaboratorId: t.collaboratorId || t.collaborator?.id || '',
      projectId: t.projectId || t.project?.id || '',
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
        collaboratorId: formData.collaboratorId ? Number(formData.collaboratorId) : null,
        projectId: formData.projectId ? Number(formData.projectId) : null,
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
                      <div className="flex items-center space-x-3">
                        {t.profileImage ? (
                          <img
                            src={getImageUrl(t.profileImage)}
                            alt={t.clientName}
                            className="w-9 h-9 rounded-full object-cover bg-slate-900 border border-slate-700 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div>
                          <div className="font-bold text-white text-sm">{t.clientName}</div>
                          <div className="text-[11px] text-slate-500">
                            {t.company ? `${t.company} ${t.position ? `(${t.position})` : ''}` : 'Private Client'}
                          </div>
                          {(t.collaborator || t.project) && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.collaborator && (
                                <span className="inline-flex items-center space-x-1 text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-medium">
                                  <Handshake className="w-2.5 h-2.5" />
                                  <span>{t.collaborator.name}</span>
                                </span>
                              )}
                              {t.project && (
                                <span className="inline-flex items-center space-x-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-medium">
                                  <FolderGit2 className="w-2.5 h-2.5" />
                                  <span>{t.project.title}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1626]/90 backdrop-blur shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add Client Review'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Record verified endorsements, star ratings, and associations.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {errorMessage && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center space-x-2.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Jenkins"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Apex Global"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Position / Designation</label>
                    <input
                      type="text"
                      placeholder="Chief Technology Officer"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Rating (1 to 5 Stars)</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      <option value={2}>⭐⭐ (2 Stars)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                {/* Profile Image Uploader */}
                <div className="bg-[#0e1626]/50 rounded-2xl p-4 border border-slate-800/80">
                  <ImageUploader
                    value={formData.profileImage}
                    onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
                    folder="testimonials"
                    label="Client Profile Photo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Handshake className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Associated Partner (Optional)</span>
                    </label>
                    <select
                      value={formData.collaboratorId}
                      onChange={(e) => setFormData({ ...formData, collaboratorId: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">None / General Review</option>
                      {collaboratorOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.partnerType ? `(${c.partnerType})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Associated Project (Optional)</span>
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">None / General Review</option>
                      {projectOptions
                        .filter((p) => {
                          if (!formData.collaboratorId) return true;
                          return (
                            p.collaboratorId === Number(formData.collaboratorId) ||
                            p.collaborator?.id === Number(formData.collaboratorId)
                          );
                        })
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
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
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
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
              </form>
            </div>

            {/* Modal Sticky Footer */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-800 bg-[#0e1626]/90 backdrop-blur shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="testimonial-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Save Testimonial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Testimonial</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete testimonial from <strong className="text-white">"{deleteConfirm.clientName}"</strong>?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-xl shadow-lg transition active:scale-95"
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
