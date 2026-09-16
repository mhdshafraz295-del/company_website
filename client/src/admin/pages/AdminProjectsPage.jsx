import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { PublicDataContext } from '../../context/PublicDataContext';
import ImageUploader from '../components/ImageUploader';
import {
  FolderGit2,
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
} from 'lucide-react';

const categories = [
  { label: 'Website', value: 'WEBSITE' },
  { label: 'Mobile App', value: 'MOBILE_APP' },
  { label: 'Software System', value: 'SOFTWARE' },
  { label: 'E-Commerce', value: 'ECOMMERCE' },
  { label: 'Education', value: 'EDUCATION' },
  { label: 'Business System', value: 'BUSINESS_SYSTEM' },
  { label: 'Other', value: 'OTHER' },
];

export default function AdminProjectsPage() {
  const publicContext = useContext(PublicDataContext);
  const [projects, setProjects] = useState([]);
  const [collaboratorOptions, setCollaboratorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'WEBSITE',
    shortDescription: '',
    fullDescription: '',
    clientOrIndustry: '',
    collaboratorId: '',
    coverImage: '',
    completionYear: new Date().getFullYear(),
    status: 'COMPLETED',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    published: true,
    displayOrder: 0,
    technologiesInput: 'React, Node.js, TailwindCSS',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects/admin/all?limit=100');
      if (res.data?.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaboratorOptions = async () => {
    try {
      const res = await api.get('/collaborators/admin/all');
      if (res.data?.success) {
        setCollaboratorOptions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch collaborator options:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCollaboratorOptions();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'WEBSITE',
      shortDescription: '',
      fullDescription: '',
      clientOrIndustry: '',
      collaboratorId: '',
      coverImage: '',
      completionYear: new Date().getFullYear(),
      status: 'COMPLETED',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      published: true,
      displayOrder: projects.length + 1,
      technologiesInput: 'React, Node.js, TailwindCSS',
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    const techNames = project.technologies
      ? project.technologies.map((t) => t.name || t).join(', ')
      : '';

    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || 'WEBSITE',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      clientOrIndustry: project.clientOrIndustry || '',
      collaboratorId: project.collaboratorId || project.collaborator?.id || '',
      coverImage: project.coverImage || '',
      completionYear: project.completionYear || new Date().getFullYear(),
      status: project.status || 'COMPLETED',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: Boolean(project.featured),
      published: project.published !== false,
      displayOrder: project.displayOrder || 0,
      technologiesInput: techNames,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Project title is required.');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setErrorMessage('Short description is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const techArray = formData.technologiesInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim() || formData.shortDescription.trim(),
        clientOrIndustry: formData.clientOrIndustry.trim() || undefined,
        coverImage: formData.coverImage ? formData.coverImage.trim() : null,
        completionYear: formData.completionYear ? Number(formData.completionYear) : undefined,
        status: formData.status,
        liveUrl: formData.liveUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        featured: Boolean(formData.featured),
        published: Boolean(formData.published),
        displayOrder: Number(formData.displayOrder) || 0,
        collaboratorId: formData.collaboratorId ? Number(formData.collaboratorId) : null,
        technologies: techArray,
      };

      if (editingProject) {
        await api.patch(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      setModalOpen(false);
      await fetchProjects();
      if (publicContext?.refetchProjects) publicContext.refetchProjects();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data?.success) {
        setDeleteConfirm(null);
        await fetchProjects();
        if (publicContext?.refetchProjects) publicContext.refetchProjects();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4" />
            <span>Portfolio & Software Showcase</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Projects CMS</h1>
          <p className="text-xs text-slate-400">
            Manage client case studies, cover media, and technology stack associations.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center space-x-2 w-fit transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1322]/80 border border-slate-800/80 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search project title, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading portfolio projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Technologies</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {project.coverImage ? (
                          <img
                            key={project.coverImage}
                            src={getImageUrl(project.coverImage)}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-700"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                            <FolderGit2 className="w-5 h-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm flex items-center space-x-2">
                            <span>{project.title}</span>
                            {project.featured && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono">/{project.slug}</div>
                          {project.collaborator && (
                            <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-medium mt-0.5">
                              <Handshake className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[150px]">{project.collaborator.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-semibold">{project.category}</td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies && project.technologies.length > 0 ? (
                          project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {tech.name || tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {project.published ? (
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
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl transition"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(project)}
                        className="p-2 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition"
                        title="Delete Project"
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
          <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400">Click "Add New Project" above to create portfolio entries.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1626]/90 backdrop-blur shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingProject ? 'Edit Project Record' : 'Add Portfolio Project'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Configure project media, categorization, technologies, and link to partners.
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

              <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Fintech Dashboard App"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cover Image Upload Component */}
                <div className="bg-[#0e1626]/50 rounded-2xl p-4 border border-slate-800/80">
                  <ImageUploader
                    value={formData.coverImage}
                    onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                    folder="projects"
                    label="Project Cover Image"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Custom Slug (Optional)</label>
                    <input
                      type="text"
                      placeholder="fintech-dashboard-app"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Client / Industry Label</label>
                    <input
                      type="text"
                      placeholder="Global Banking Group"
                      value={formData.clientOrIndustry}
                      onChange={(e) => setFormData({ ...formData, clientOrIndustry: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Short Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence overview of the project and impact..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Detailed Description (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Full case details, system architecture, core functionality..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Technologies (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="React, Node.js, TailwindCSS, MySQL"
                    value={formData.technologiesInput}
                    onChange={(e) => setFormData({ ...formData, technologiesInput: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Optional Collaborator Link Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Handshake className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Associated Collaborator / Partner (Optional)</span>
                  </label>
                  <select
                    value={formData.collaboratorId}
                    onChange={(e) => setFormData({ ...formData, collaboratorId: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">None (Independent In-House Project)</option>
                    {collaboratorOptions.map((collab) => (
                      <option key={collab.id} value={collab.id}>
                        {collab.name} {collab.partnerType ? `(${collab.partnerType})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Linking this project to a partner will display it on the public Collaborators section.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Completion Year</label>
                    <input
                      type="number"
                      placeholder="2025"
                      value={formData.completionYear}
                      onChange={(e) => setFormData({ ...formData, completionYear: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="COMPLETED">Completed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Live Website URL</label>
                    <input
                      type="url"
                      placeholder="https://clientproject.com"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">GitHub URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-slate-200">Published / Publicly Visible</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs font-semibold text-slate-200">Featured Home Badge</span>
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
                form="project-form"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Project</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.title}"</strong>?
              This will permanently remove the project.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold text-white rounded-xl shadow-lg"
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
