import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import {
  ArrowLeft,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    api
      .get(`/case-studies/${slug}`)
      .then((res) => {
        if (isMounted && res.data?.success && res.data?.data) {
          setCaseStudy(res.data.data);
        } else if (isMounted) {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading case study details...</p>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Case Study Not Found</h2>
        <p className="text-sm text-slate-600 max-w-sm">
          The requested case study could not be found or is no longer published.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Engineering Case Study</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {caseStudy.title}
        </h1>
      </div>

      {/* Cover Image */}
      {caseStudy.coverImage && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-xl">
          <img
            src={getImageUrl(caseStudy.coverImage)}
            alt={caseStudy.title}
            className="w-full max-h-[450px] object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Problem Section */}
      <div className="bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-red-800 dark:text-red-300">The Problem</h2>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {caseStudy.problem}
        </p>
      </div>

      {/* Solution Section */}
      <div className="bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40">
        <h2 className="text-lg font-bold text-cyan-700 dark:text-cyan-400">Our Technical Solution</h2>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {caseStudy.solution}
        </p>
      </div>

      {/* Results Section */}
      {caseStudy.result && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Impact & Results</span>
          </h2>
          <p className="text-sm sm:text-base text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-line">
            {caseStudy.result}
          </p>
        </div>
      )}

      {/* Related Project Link */}
      {caseStudy.project && (
        <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/80 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-cyan-700" />
              <span>Related Project</span>
            </h3>
            <p className="text-xs text-slate-600">{caseStudy.project.title}</p>
          </div>
          <Link
            to={`/projects/${caseStudy.project.slug}`}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition shadow-sm"
          >
            View Project
          </Link>
        </div>
      )}
    </div>
  );
}
