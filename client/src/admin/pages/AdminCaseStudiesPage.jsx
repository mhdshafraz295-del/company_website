import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { PublicDataContext } from '../../context/PublicDataContext';
import ImageUploader from '../components/ImageUploader';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';

export default function AdminCaseStudiesPage() {
  const publicContext = useContext(PublicDataContext);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    problem: '',
    solution: '',
    result: '',
    technologiesSummary: '',
    coverImage: '',
    published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/case-studies/admin/all');
      if (res.data?.success) {
        setCaseStudies(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleOpenAdd = () => {
    setEditingCaseStudy(null);
    setFormData({
      title: '',
      slug: '',
      problem: '',
      solution: '',
      result: '',
      technologiesSummary: '',
      coverImage: '',
      published: true,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cs) => {
    setEditingCaseStudy(cs);
    setFormData({
      title: cs.title || '',
      slug: cs.slug || '',
      problem: cs.problem || '',
      solution: cs.solution || '',
      result: cs.result || '',
      technologiesSummary: cs.technologiesSummary || '',
      coverImage: cs.coverImage || '',
      published: cs.published !== false,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim() || !formData.problem.trim() || !formData.solution.trim()) {
      setErrorMessage('Title, Problem, and Solution are required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        result: formData.result.trim() || undefined,
        technologiesSummary: formData.technologiesSummary.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        published: Boolean(formData.published),
      };

      if (editingCaseStudy) {
        await api.patch(`/case-studies/${editingCaseStudy.id}`, payload);
      } else {
        await api.post('/case-studies', payload);
      }

      setModalOpen(false);
      await fetchCaseStudies();
      if (publicContext?.refetchCaseStudies) publicContext.refetchCaseStudies();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save case study.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/case-studies/${id}`);
      if (res.data?.success) {
        setDeleteConfirm(null);
        await fetchCaseStudies();
        if (publicContext?.refetchCaseStudies) publicContext.refetchCaseStudies();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete case study.');
    }
  };

  const filtered = caseStudies.filter(
    (cs) =>
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.problem.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>In-Depth Engineering Articles</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Case Studies CMS</h1>
          <p className="text-xs text-slate-400">
            Manage comprehensive client problem, solution, and technical result write-ups.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center space-x-2 w-fit transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Case Study</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="flex items-center justify-between bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search title, problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">Total: {filtered.length}</span>
      </div>

      {/* Case Studies Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading case studies...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Title & Slug</th>
                  <th className="py-3.5 px-4">Problem Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((cs) => (
                  <tr key={cs.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {cs.coverImage && (
                          <img
                            src={getImageUrl(cs.coverImage)}
                            alt={cs.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{cs.title}</div>
                          <div className="text-[11px] text-cyan-400 font-mono">/{cs.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <p className="truncate text-slate-300">{cs.problem}</p>
                    </td>
                    <td className="py-4 px-4">
                      {cs.published ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <XCircle className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cs)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition"
                        title="Edit Case Study"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(cs)}
                        className="p-2 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition"
                        title="Delete Case Study"
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
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Case Studies Found</h3>
          <p className="text-xs text-slate-400">Click "Add Case Study" above to create an entry.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                {editingCaseStudy ? 'Edit Case Study' : 'Create Case Study'}
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {editingCaseStudy ? editingCaseStudy.title : 'Add Case Study'}
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
                  <label className="text-xs font-semibold text-slate-300">Case Study Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Scaling Real-Time Analytics"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="scaling-real-time-analytics"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload Component */}
              <ImageUploader
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                folder="case-studies"
                label="Case Study Cover Image"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Problem Statement *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the initial technical challenge..."
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Engineering Solution *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed architecture and development solution..."
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Results & Impact</label>
                <textarea
                  rows={3}
                  placeholder="Key metrics, latency improvements, conversion gains..."
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Technologies Summary</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Prisma, Redis"
                    value={formData.technologiesSummary}
                    onChange={(e) => setFormData({ ...formData, technologiesSummary: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1 flex items-center pt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs font-semibold text-slate-200">Published Publicly</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Save Case Study</span>
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
            <h3 className="text-lg font-bold text-white">Delete Case Study</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.title}"</strong>?
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
