import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { PublicDataContext } from '../../context/PublicDataContext';
import ImageUploader from '../components/ImageUploader';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Search,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  FolderGit2,
  MessageSquare,
  Star,
} from 'lucide-react';

export default function AdminCollaboratorsPage() {
  const publicContext = useContext(PublicDataContext);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    partnerType: '',
    shortDescription: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collaborators/admin/all');
      if (res.data?.success) {
        setCollaborators(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch collaborators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleOpenAdd = () => {
    setEditingCollaborator(null);
    setFormData({
      name: '',
      logo: '',
      partnerType: '',
      shortDescription: '',
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
      displayOrder: collaborators.length + 1,
      isActive: true,
      isFeatured: false,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (collab) => {
    setEditingCollaborator(collab);
    setFormData({
      name: collab.name || '',
      logo: collab.logo || '',
      partnerType: collab.partnerType || '',
      shortDescription: collab.shortDescription || '',
      phone: collab.phone || '',
      whatsapp: collab.whatsapp || '',
      email: collab.email || '',
      website: collab.website || '',
      displayOrder: collab.displayOrder || 0,
      isActive: collab.isActive !== false,
      isFeatured: Boolean(collab.isFeatured),
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.patch(`/collaborators/${id}/toggle-active`);
      if (res.data?.success) {
        await fetchCollaborators();
        if (publicContext?.refetchCollaborators) publicContext.refetchCollaborators();
      }
    } catch (err) {
      alert('Failed to toggle active status.');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await api.patch(`/collaborators/${id}/toggle-featured`);
      if (res.data?.success) {
        await fetchCollaborators();
        if (publicContext?.refetchCollaborators) publicContext.refetchCollaborators();
      }
    } catch (err) {
      alert('Failed to toggle featured status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Company / Organization name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        logo: formData.logo ? formData.logo.trim() : null,
        partnerType: formData.partnerType.trim() || null,
        shortDescription: formData.shortDescription.trim() || null,
        phone: formData.phone.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive),
        isFeatured: Boolean(formData.isFeatured),
      };

      if (editingCollaborator) {
        await api.patch(`/collaborators/${editingCollaborator.id}`, payload);
      } else {
        await api.post('/collaborators', payload);
      }

      setModalOpen(false);
      await fetchCollaborators();
      if (publicContext?.refetchCollaborators) publicContext.refetchCollaborators();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save collaborator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/collaborators/${id}`);
      if (res.data?.success) {
        setDeleteConfirm(null);
        await fetchCollaborators();
        if (publicContext?.refetchCollaborators) publicContext.refetchCollaborators();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete collaborator.');
    }
  };

  const filteredCollaborators = collaborators.filter((collab) => {
    const matchesSearch =
      collab.name.toLowerCase().includes(search.toLowerCase()) ||
      (collab.partnerType && collab.partnerType.toLowerCase().includes(search.toLowerCase())) ||
      (collab.shortDescription && collab.shortDescription.toLowerCase().includes(search.toLowerCase()));

    if (filterType === 'FEATURED') return matchesSearch && collab.isFeatured;
    if (filterType === 'ACTIVE') return matchesSearch && collab.isActive;
    if (filterType === 'INACTIVE') return matchesSearch && !collab.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Handshake className="w-4 h-4" />
            <span>Partners & Collaborations Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Collaborators CMS</h1>
          <p className="text-xs text-slate-400">
            Manage institutional partners, enterprise collaborators, logos, contacts, and linked portfolio projects.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center space-x-2 w-fit transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collaborator</span>
        </button>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search partner name, category, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Partners ({collaborators.length})</option>
            <option value="ACTIVE">Active Only</option>
            <option value="FEATURED">Featured Only</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table & Content View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0d1322]/40 rounded-2xl border border-slate-800 space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading collaborators and partners...</p>
        </div>
      ) : filteredCollaborators.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1322]/40 rounded-2xl border border-slate-800 space-y-3">
          <Handshake className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No collaborators found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search ? 'Try adjusting your search criteria.' : 'Click "Add Collaborator" to register your first partner.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0f172a] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Category / Bio</th>
                  <th className="py-3 px-4">Contact Channels</th>
                  <th className="py-3 px-4 text-center">Linked Work</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCollaborators.map((collab) => (
                  <tr key={collab.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Partner Name & Logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 p-1">
                          {collab.logo ? (
                            <img
                              src={getImageUrl(collab.logo)}
                              alt={collab.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Handshake className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{collab.name}</span>
                            {collab.website && (
                              <a
                                href={collab.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-cyan-400"
                                title="Open Website"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {collab.partnerType && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                              {collab.partnerType}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Short Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-400 line-clamp-2 leading-relaxed text-[11px]">
                        {collab.shortDescription || 'No description provided.'}
                      </p>
                    </td>

                    {/* Contacts */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2 text-slate-400">
                        {collab.phone && (
                          <span title={`Phone: ${collab.phone}`} className="p-1 rounded bg-slate-900 border border-slate-700/60 text-cyan-400">
                            <Phone className="w-3 h-3" />
                          </span>
                        )}
                        {collab.whatsapp && (
                          <span title={`WhatsApp: ${collab.whatsapp}`} className="p-1 rounded bg-slate-900 border border-slate-700/60 text-emerald-400">
                            WA
                          </span>
                        )}
                        {collab.email && (
                          <span title={`Email: ${collab.email}`} className="p-1 rounded bg-slate-900 border border-slate-700/60 text-blue-400">
                            <Mail className="w-3 h-3" />
                          </span>
                        )}
                        {collab.website && (
                          <span title={`Website: ${collab.website}`} className="p-1 rounded bg-slate-900 border border-slate-700/60 text-purple-400">
                            <Globe className="w-3 h-3" />
                          </span>
                        )}
                        {!collab.phone && !collab.whatsapp && !collab.email && !collab.website && (
                          <span className="text-[11px] text-slate-600">—</span>
                        )}
                      </div>
                    </td>

                    {/* Linked Work Counts */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-2 text-[11px]">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300" title="Projects">
                          <FolderGit2 className="w-3 h-3 text-emerald-400" />
                          <span>{collab._count?.projects || 0}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300" title="Reviews">
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>{collab._count?.testimonials || 0}</span>
                        </span>
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(collab.id)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                          collab.isFeatured
                            ? 'bg-amber-950/70 border border-amber-800/60 text-amber-400'
                            : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 mr-1 ${collab.isFeatured ? 'fill-amber-400' : ''}`} />
                        {collab.isFeatured ? 'Featured' : 'Standard'}
                      </button>
                    </td>

                    {/* Active Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(collab.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          collab.isActive
                            ? 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-400'
                            : 'bg-rose-950/70 border border-rose-800/60 text-rose-400'
                        }`}
                      >
                        {collab.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Display Order */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {collab.displayOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(collab)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                          title="Edit Collaborator"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(collab)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition"
                          title="Delete Collaborator"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Collaborator Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">
                  {editingCollaborator ? 'Edit Collaborator / Partner' : 'Add New Collaborator / Partner'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name & Partner Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Organization Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Global Technologies"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Partner Type / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Enterprise Client, Strategic Partner"
                    value={formData.partnerType}
                    onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Logo Uploader */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Partner Logo
                </label>
                <ImageUploader
                  currentImage={formData.logo}
                  onImageChange={(url) => setFormData({ ...formData, logo: url })}
                  folder="collaborators"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description / Profile
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the organization or nature of the partnership..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Contact Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone (tel:)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +94 77 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 94771234567"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (mailto:)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@partner.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Order & Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center space-x-2 sm:pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-600 bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Active on Website
                  </label>
                </div>
                <div className="flex items-center space-x-2 sm:pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-400"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Featured Partner
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center space-x-2 transition disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingCollaborator ? 'Update Collaborator' : 'Create Collaborator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">Delete Collaborator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-200">"{deleteConfirm.name}"</span>?
              </p>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-left text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Safe Deletion Guarantee</span>
                </div>
                <p>
                  Any portfolio projects and client reviews linked to this partner will remain completely preserved in the database. Only the partner association will be safely detached.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id)}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-lg transition"
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

