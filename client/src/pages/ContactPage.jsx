import React, { useState } from 'react';
import usePublicData from '../hooks/usePublicData';
import api from '../services/api';
import { Mail, Phone, MessageSquare, MapPin, Send, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const { settings } = usePublicData();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDescription: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 10) {
      setErrorMessage('Please provide a message or project description (minimum 10 characters).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        companyName: formData.companyName.trim() || undefined,
        projectDescription: formData.projectDescription.trim(),
      };

      const res = await api.post('/enquiries', payload);

      if (res.data?.success) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          projectDescription: '',
        });
      } else {
        setErrorMessage(res.data?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.message) ||
        'An unexpected error occurred while sending your inquiry. Please try again.';
      setErrorMessage(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200 select-none">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-cyan-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact NexGen Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Have a general inquiry or technical question? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40">
          <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            {settings?.email && (
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a href={`mailto:${settings.email}`} className="text-slate-900 hover:text-cyan-600 font-medium">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            {settings?.phone && (
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Direct Phone
                  </span>
                  <span className="text-slate-900 font-medium">{settings.phone}</span>
                </div>
              </div>
            )}

            {settings?.whatsapp && (
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-2xl text-teal-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    WhatsApp Chat
                  </span>
                  <span className="text-slate-900 font-medium">{settings.whatsapp}</span>
                </div>
              </div>
            )}

            {settings?.address && (
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-violet-50 border border-violet-100 rounded-2xl text-violet-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Office Location
                  </span>
                  <span className="text-slate-700 font-medium">{settings.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inquiry Submission Form */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40">
          {submitted ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-600 w-fit mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Thank you! Your message has been received.
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Our team will review your inquiry and get back to you as soon as possible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition shadow-sm"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            /* Default Form State */
            <>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>
                <p className="text-xs text-slate-500">
                  Fill out your details below to submit a direct message to our engineering team.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-700 text-xs shadow-sm">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Company Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Message / Inquiry *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your project, software requirements, or inquiry..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
