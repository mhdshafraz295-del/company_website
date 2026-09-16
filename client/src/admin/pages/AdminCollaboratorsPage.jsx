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
  Users,
  ShieldCheck,
  Building2,
  Layers,
  ArrowUpDown,
  Filter,
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

  // KPI Metrics (Calculated derived state from existing collaborators array)
  const totalCount = collaborators.length;
  const activeCount = collaborators.filter((c) => c.isActive).length;
  const featuredCount = collaborators.filter((c) => c.isFeatured).length;
  const totalLinkedProjects = collaborators.reduce(
    (sum, c) => sum + (c._count?.projects || c.projects?.length || 0),
    0
  );

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
    <div className="space-y-6 animate-in fade-in duration-200 select-none pb-8">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0e1626] via-[#0f172a] to-[#0a0f1d] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Handshake className="w-3.5 h-3.5" />
              <span>Collaboration Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Collaborators & Partners
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Manage strategic alliances, client partnerships, brand logos, communication channels, and linked portfolio engagements.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl shadow-xl shadow-cyan-900/30 flex items-center justify-center space-x-2 transition-all duration-150 active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
              <span>Add Collaborator</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#0e1626]/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-lg hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/50 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Total Partners</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="bg-[#0e1626]/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-lg hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Active Partners</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{activeCount}</div>
          </div>
        </div>

        <div className="bg-[#0e1626]/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-lg hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Featured</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{featuredCount}</div>
          </div>
        </div>

        <div className="bg-[#0e1626]/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-lg hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Linked Projects</div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">{totalLinkedProjects}</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-[#0e1626]/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full sm:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, category, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto bg-[#0a0f1d] border border-slate-700/80 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value="ALL">All Partners ({collaborators.length})</option>
              <option value="ACTIVE">Active Only ({activeCount})</option>
              <option value="FEATURED">Featured Only ({featuredCount})</option>
              <option value="INACTIVE">Inactive ({collaborators.length - activeCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0e1626]/40 rounded-3xl border border-slate-800/80 space-y-3">
          <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading collaborators directory...</p>
        </div>
      ) : filteredCollaborators.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-[#0e1626]/40 rounded-3xl border border-slate-800/80 space-y-4 px-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
            <Handshake className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No Collaborators Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {search
                ? 'No partners matched your current search or filter criteria. Try clearing the search.'
                : 'Get started by showcasing trusted partners, enterprise clients, and institutional collaborators.'}
            </p>
          </div>
          {!search && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Collaborator</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* MOBILE CARDS VIEW (visible on < md) */}
          <div className="block md:hidden space-y-4">
            {filteredCollaborators.map((collab) => (
              <div
                key={collab.id}
                className="bg-[#0e1626]/90 border border-slate-800/90 rounded-2xl p-4 space-y-3.5 shadow-xl"
              >
                {/* Header: Logo, Name, Badge, Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700/60 p-1 flex items-center justify-center shrink-0 overflow-hidden">
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
                        <Building2 className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate flex items-center space-x-1.5">
                        <span className="truncate">{collab.name}</span>
                        {collab.website && (
                          <a
                            href={collab.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 shrink-0"
                            title="Visit Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      {collab.partnerType ? (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/70 text-cyan-400 border border-cyan-800/50">
                          {collab.partnerType}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">General Partner</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(collab)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-white transition active:scale-95"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(collab)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition active:scale-95"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {collab.shortDescription && (
                  <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed bg-slate-950/40 rounded-xl p-2.5 border border-slate-900">
                    {collab.shortDescription}
                  </p>
                )}

                {/* Info Bar: Stats & Contacts */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]" title="Linked Projects">
                      <FolderGit2 className="w-3 h-3 text-emerald-400" />
                      <span>{collab._count?.projects || 0}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]" title="Client Reviews">
                      <MessageSquare className="w-3 h-3 text-amber-400" />
                      <span>{collab._count?.testimonials || 0}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      #{collab.displayOrder}
                    </span>
                  </div>

                  {/* Contact icons */}
                  <div className="flex items-center space-x-1.5">
                    {collab.phone && (
                      <a href={`tel:${collab.phone}`} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-700">
                        <Phone className="w-3 h-3" />
                      </a>
                    )}
                    {collab.whatsapp && (
                      <a href={`https://wa.me/${collab.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold">
                        WA
                      </a>
                    )}
                    {collab.email && (
                      <a href={`mailto:${collab.email}`} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 hover:border-blue-700">
                        <Mail className="w-3 h-3" />
                      </a>
                    )}
                    {collab.website && (
                      <a href={collab.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-700">
                        <Globe className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Toggles Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(collab.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      collab.isFeatured
                        ? 'bg-amber-950/70 border border-amber-700/60 text-amber-400'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Star className={`w-3 h-3 mr-1.5 ${collab.isFeatured ? 'fill-amber-400' : ''}`} />
                    <span>{collab.isFeatured ? 'Featured' : 'Standard'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(collab.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      collab.isActive
                        ? 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-400'
                        : 'bg-rose-950/70 border border-rose-800/60 text-rose-400'
                    }`}
                  >
                    {collab.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (visible on md:) */}
          <div className="hidden md:block bg-[#0e1626]/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0b101d] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-5">Partner</th>
                    <th className="py-4 px-5">Type / Profile</th>
                    <th className="py-4 px-4 text-center">Channels</th>
                    <th className="py-4 px-4 text-center">Projects / Reviews</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Order</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCollaborators.map((collab) => (
                    <tr
                      key={collab.id}
                      className="hover:bg-slate-800/30 transition-colors duration-150 group"
                    >
                      {/* Partner Name & Logo */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 p-1.5 shadow-inner">
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
                              <Building2 className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                              <span>{collab.name}</span>
                              {collab.website && (
                                <a
                                  href={collab.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-cyan-400 transition"
                                  title="Visit Website"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {collab.email || collab.website || 'No web URL'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Description */}
                      <td className="py-4 px-5 max-w-xs">
                        {collab.partnerType && (
                          <span className="inline-block mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
                            {collab.partnerType}
                          </span>
                        )}
                        <p className="text-slate-400 line-clamp-2 leading-relaxed text-[11px]">
                          {collab.shortDescription || 'No description provided.'}
                        </p>
                      </td>

                      {/* Contact Channels */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {collab.phone && (
                            <a
                              href={`tel:${collab.phone}`}
                              title={`Phone: ${collab.phone}`}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-600 transition"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          )}
                          {collab.whatsapp && (
                            <a
                              href={`https://wa.me/${collab.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp: ${collab.whatsapp}`}
                              className="px-1.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold hover:border-emerald-600 transition"
                            >
                              WA
                            </a>
                          )}
                          {collab.email && (
                            <a
                              href={`mailto:${collab.email}`}
                              title={`Email: ${collab.email}`}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 hover:border-blue-600 transition"
                            >
                              <Mail className="w-3 h-3" />
                            </a>
                          )}
                          {collab.website && (
                            <a
                              href={collab.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Website: ${collab.website}`}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-600 transition"
                            >
                              <Globe className="w-3 h-3" />
                            </a>
                          )}
                          {!collab.phone && !collab.whatsapp && !collab.email && !collab.website && (
                            <span className="text-[11px] text-slate-600">—</span>
                          )}
                        </div>
                      </td>

                      {/* Linked Projects & Reviews */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center space-x-2 text-[11px]">
                          <span
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                            title="Linked Projects"
                          >
                            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-semibold">{collab._count?.projects || 0}</span>
                          </span>
                          <span
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                            title="Client Testimonials"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-semibold">{collab._count?.testimonials || 0}</span>
                          </span>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(collab.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            collab.isFeatured
                              ? 'bg-amber-950/70 border border-amber-700/60 text-amber-400 shadow-sm shadow-amber-950'
                              : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <Star className={`w-3 h-3 mr-1.5 ${collab.isFeatured ? 'fill-amber-400' : ''}`} />
                          {collab.isFeatured ? 'Featured' : 'Standard'}
                        </button>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(collab.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                            collab.isActive
                              ? 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 shadow-sm shadow-emerald-950'
                              : 'bg-rose-950/70 border border-rose-800/60 text-rose-400'
                          }`}
                        >
                          {collab.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 mr-1.5" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Display Order */}
                      <td className="py-4 px-4 text-center font-mono text-slate-400 text-xs">
                        {collab.displayOrder}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(collab)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition shadow"
                            title="Edit Partner"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(collab)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 hover:border-rose-800 transition shadow"
                            title="Delete Partner"
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
        </>
      )}

      {/* Add / Edit Collaborator Modal (Fixed Sticky Header + Scrollable Form + Sticky Footer) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1626]/90 backdrop-blur shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingCollaborator ? 'Edit Collaborator' : 'Add Collaborator'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Configure institutional branding, contact details, and display parameters.
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {errorMessage && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center space-x-2.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="collaborator-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Basic Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Organization Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Global Technologies"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Partner Type / Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Enterprise Client, Technology Partner"
                        value={formData.partnerType}
                        onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Logo Branding */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Branding & Logo</span>
                  </div>
                  <div className="bg-[#0e1626]/50 rounded-2xl p-4 border border-slate-800/80">
                    <ImageUploader
                      value={formData.logo}
                      onChange={(url) => setFormData((prev) => ({ ...prev, logo: url }))}
                      folder="collaborators"
                      label="Partner Logo"
                    />
                  </div>
                </div>

                {/* Section 3: Profile Description */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Short Description / Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe this organization or the scope of your working relationship..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition leading-relaxed"
                  />
                </div>

                {/* Section 4: Contact Channels */}
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Communication & Digital Channels</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        <span>Phone (tel:)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +94 77 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                        <span className="text-emerald-400 font-bold text-[11px]">WA</span>
                        <span>WhatsApp Number</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 94771234567"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                        <Mail className="w-3 h-3 text-blue-400" />
                        <span>Email Address (mailto:)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. contact@partner.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                        <ExternalLink className="w-3 h-3 text-purple-400" />
                        <span>Website URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Visibility & Ordering */}
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visibility & Sorting</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-mono"
                      />
                    </div>
                    <div className="flex items-center space-x-2.5 sm:pt-6 bg-[#0e1626]/40 p-3 rounded-xl border border-slate-800/60">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-600 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                      />
                      <label htmlFor="isActive" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Active on Website
                      </label>
                    </div>
                    <div className="flex items-center space-x-2.5 sm:pt-6 bg-[#0e1626]/40 p-3 rounded-xl border border-slate-800/60">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-400 cursor-pointer"
                      />
                      <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Featured Partner
                      </label>
                    </div>
                  </div>
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
                form="collaborator-form"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-cyan-950/50 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingCollaborator ? 'Update Collaborator' : 'Save Collaborator'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">Delete Collaborator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-100">"{deleteConfirm.name}"</span>?
              </p>
              <div className="p-3.5 bg-[#0e1626] border border-slate-800 rounded-2xl text-left text-[11px] text-slate-400 space-y-1.5">
                <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Safe Deletion Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Linked portfolio projects and client testimonials will remain preserved in your database. Only the partner profile and direct associations will be removed.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
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
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-lg transition active:scale-95"
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


