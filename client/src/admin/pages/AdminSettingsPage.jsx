import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { PublicDataContext } from '../../context/PublicDataContext';
import { Settings, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const publicContext = useContext(PublicDataContext);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: 'NexGen Solutions',
    tagline: 'Software & Web Agency',
    companyDescription: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    heroEyebrow: '',
    heroHeading: '',
    heroDescription: '',
    primaryCtaText: '',
    secondaryCtaText: '',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data.data?.setting) {
        const s = res.data.data.setting;
        setFormData({
          companyName: s.companyName || 'NexGen Solutions',
          tagline: s.tagline || 'Software & Web Agency',
          companyDescription: s.companyDescription || '',
          email: s.email || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          address: s.address || '',
          heroEyebrow: s.heroEyebrow || '',
          heroHeading: s.heroHeading || '',
          heroDescription: s.heroDescription || '',
          primaryCtaText: s.primaryCtaText || '',
          secondaryCtaText: s.secondaryCtaText || '',
        });
      }
    } catch (err) {
      console.error('Failed to load website settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.companyName.trim()) {
      setErrorMessage('Company Name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        tagline: formData.tagline.trim() || undefined,
        companyDescription: formData.companyDescription.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || undefined,
        address: formData.address.trim() || undefined,
        heroEyebrow: formData.heroEyebrow.trim() || undefined,
        heroHeading: formData.heroHeading.trim() || undefined,
        heroDescription: formData.heroDescription.trim() || undefined,
        primaryCtaText: formData.primaryCtaText.trim() || undefined,
        secondaryCtaText: formData.secondaryCtaText.trim() || undefined,
      };

      const res = await api.patch('/settings', payload);
      if (res.data?.success) {
        setSuccessMessage('Website settings updated successfully!');
        if (publicContext?.refetchSettings) publicContext.refetchSettings();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update website settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0b101d] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Corporate Branding & Contact Configuration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Website Settings CMS</h1>
          <p className="text-xs text-slate-400">
            Update company contact info, corporate tagline, and hero text elements.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#0d1322]/60 border border-slate-800/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading website settings...</p>
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
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                1. General Company Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tagline / Eyebrow</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Company Description</label>
                <textarea
                  rows={3}
                  value={formData.companyDescription}
                  onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                2. Contact & Location Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Public Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Direct Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Office Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Website Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
