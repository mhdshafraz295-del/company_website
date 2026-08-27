import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { PublicDataContext } from '../../context/PublicDataContext';
import ImageUploader from '../components/ImageUploader';
import { UserCheck, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminFounderPage() {
  const publicContext = useContext(PublicDataContext);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    primaryRole: '',
    expertise: '',
    shortBio: '',
    fullBiography: '',
    visionStatement: '',
    photo: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  const fetchFounderProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/founder');
      if (res.data?.success && res.data.data) {
        const f = res.data.data;
        setFormData({
          name: f.name || '',
          primaryRole: f.primaryRole || '',
          expertise: f.expertise || '',
          shortBio: f.shortBio || '',
          fullBiography: f.fullBiography || '',
          visionStatement: f.visionStatement || '',
          photo: f.photo || '',
          email: f.email || '',
          linkedinUrl: f.linkedinUrl || '',
          githubUrl: f.githubUrl || '',
        });
      }
    } catch (err) {
      console.error('Failed to load founder profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFounderProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.primaryRole.trim()) {
      setErrorMessage('Founder Name and Primary Role are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        primaryRole: formData.primaryRole.trim(),
        expertise: formData.expertise.trim() || null,
        shortBio: formData.shortBio.trim() || null,
        fullBiography: formData.fullBiography.trim() || null,
        visionStatement: formData.visionStatement.trim() || null,
        photo: formData.photo ? formData.photo.trim() : null,
        email: formData.email.trim() || null,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        githubUrl: formData.githubUrl.trim() || null,
      };

      const res = await api.put('/founder', payload);
      if (res.data?.success) {
        setSuccessMessage('Founder profile updated successfully!');
        if (publicContext?.refetchFounder) publicContext.refetchFounder();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update founder profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Executive Biography & Vision</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Founder Profile CMS</h1>
          <p className="text-xs text-slate-400">
            Configure executive biography, technical leadership background, and vision statements.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading founder profile...</p>
        </div>
      ) : (
        <div className="bg-[#0d1322]/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl">
          {successMessage && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Founder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Alexander Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Role *</label>
                <input
                  type="text"
                  required
                  placeholder="Founder & Chief Technology Officer"
                  value={formData.primaryRole}
                  onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Founder Photo Upload Component */}
            <ImageUploader
              value={formData.photo}
              onChange={(url) => setFormData({ ...formData, photo: url })}
              folder="founder"
              label="Founder Official Photo"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  placeholder="alexander@nexgen.local"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Technical Expertise Summary</label>
              <input
                type="text"
                placeholder="Enterprise System Architecture, Distributed Cloud Infrastructure, High-Performance Web Engineering"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Bio</label>
              <textarea
                rows={2}
                placeholder="Brief summary for founder card..."
                value={formData.shortBio}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Biography</label>
              <textarea
                rows={5}
                placeholder="Comprehensive professional biography..."
                value={formData.fullBiography}
                onChange={(e) => setFormData({ ...formData, fullBiography: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Corporate Vision Statement</label>
              <textarea
                rows={3}
                placeholder="Founder statement on software excellence..."
                value={formData.visionStatement}
                onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Founder Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
