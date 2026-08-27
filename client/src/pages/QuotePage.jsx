import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import usePublicData from '../hooks/usePublicData';
import api from '../services/api';
import { ArrowLeft, CheckCircle2, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const fallbackServiceTypes = [
  'Custom Web Application',
  'Mobile App Development',
  'Enterprise Software System',
  'UI/UX Design & Prototype',
  'E-Commerce Platform',
  'API & Cloud Integration',
];

const budgetRanges = ['<$5,000', '$5,000 - $15,000', '$15,000 - $30,000', '$30,000+'];

export default function QuotePage() {
  const [searchParams] = useSearchParams();
  const { services, loading: loadingServices } = usePublicData();

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServiceName, setSelectedServiceName] = useState('Custom Web Application');
  const [selectedBudget, setSelectedBudget] = useState('$5,000 - $15,000');
  const [selectedTimeline, setSelectedTimeline] = useState('1 - 2 Months');

  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDescription: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle URL Query Parameter Pre-selection (e.g. /get-a-quote?service=Websites or ?serviceId=2)
  useEffect(() => {
    const queryServiceId = searchParams.get('serviceId');
    const queryServiceParam = searchParams.get('service') || searchParams.get('category');

    if (queryServiceId && services && services.length > 0) {
      const match = services.find((s) => s.id === parseInt(queryServiceId, 10));
      if (match) {
        setSelectedServiceId(match.id);
        setSelectedServiceName(match.title);
        return;
      }
    }

    if (queryServiceParam && services && services.length > 0) {
      const match = services.find(
        (s) =>
          s.title.toLowerCase().includes(queryServiceParam.toLowerCase()) ||
          s.slug.toLowerCase().includes(queryServiceParam.toLowerCase())
      );
      if (match) {
        setSelectedServiceId(match.id);
        setSelectedServiceName(match.title);
        return;
      }
      setSelectedServiceName(queryServiceParam);
    }
  }, [searchParams, services]);

  const validateForm = () => {
    if (!clientInfo.fullName.trim() || clientInfo.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return false;
    }
    if (!clientInfo.email.trim() || !/\S+@\S+\.\S+/.test(clientInfo.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!clientInfo.projectDescription.trim() || clientInfo.projectDescription.trim().length < 10) {
      setErrorMessage('Please describe your project scope and requirements (minimum 10 characters).');
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
        serviceId: selectedServiceId || undefined,
        serviceName: selectedServiceName || undefined,
        fullName: clientInfo.fullName.trim(),
        email: clientInfo.email.trim(),
        phone: clientInfo.phone.trim() || undefined,
        companyName: clientInfo.companyName.trim() || undefined,
        projectDescription: clientInfo.projectDescription.trim(),
        budgetRange: selectedBudget,
        timeline: selectedTimeline,
      };

      const res = await api.post('/quotes', payload);

      if (res.data?.success) {
        setSubmitted(true);
        setClientInfo({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          projectDescription: '',
        });
      } else {
        setErrorMessage(res.data?.message || 'Failed to submit quote request. Please try again.');
      }
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.message) ||
        'An unexpected error occurred while submitting your quote request.';
      setErrorMessage(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200 select-none">
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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50/80 text-cyan-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project Estimation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get a Project Quote
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Select your requirements below to submit a detailed project estimation request for NexGen Solutions.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-slate-200/40">
        {submitted ? (
          /* Success State */
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-600 w-fit mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Thank you! Your quote request has been submitted.
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Our engineering team will analyze your project requirements and get back to you with a detailed estimate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition shadow-sm"
            >
              Submit Another Quote Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-700 text-xs shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Select Primary Service Required */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Primary Service Required
              </label>
              {loadingServices ? (
                <div className="flex items-center space-x-2 text-xs text-slate-400 p-4">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                  <span>Loading services...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {services && services.length > 0
                    ? services.map((s) => {
                        const isSelected = selectedServiceId === s.id || selectedServiceName === s.title;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedServiceId(s.id);
                              setSelectedServiceName(s.title);
                            }}
                            className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-cyan-50/90 border-cyan-500 text-cyan-900 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{s.title}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                            </div>
                          </button>
                        );
                      })
                    : fallbackServiceTypes.map((type) => {
                        const isSelected = selectedServiceName === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setSelectedServiceId(null);
                              setSelectedServiceName(type);
                            }}
                            className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-cyan-50/90 border-cyan-500 text-cyan-900 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{type}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                </div>
              )}
            </div>

            {/* Step 2: Estimated Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Estimated Budget Range
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setSelectedBudget(range)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        selectedBudget === range
                          ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Expected Timeline
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['< 1 Month', '1 - 2 Months', '2 - 4 Months', '4+ Months'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTimeline(t)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        selectedTimeline === t
                          ? 'bg-teal-50/90 border-teal-500 text-teal-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Project Details */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Your Contact & Requirements
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={clientInfo.fullName}
                    onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
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
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Company Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={clientInfo.companyName}
                    onChange={(e) => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Project Description & Requirements *
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline your project scope, required features, and technical goals..."
                  value={clientInfo.projectDescription}
                  onChange={(e) => setClientInfo({ ...clientInfo, projectDescription: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Quote Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Quote</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
