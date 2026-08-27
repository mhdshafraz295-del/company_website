import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  Code2,
  BookOpen,
  Loader2,
  AlertCircle,
  Building,
} from 'lucide-react';

const categoryLabelMap = {
  WEBSITE: 'Website',
  MOBILE_APP: 'Mobile App',
  SOFTWARE: 'Software',
  ECOMMERCE: 'E-Commerce',
  EDUCATION: 'Education',
  BUSINESS_SYSTEM: 'Business System',
  OTHER: 'Other',
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    api
      .get(`/projects/${slug}`)
      .then((res) => {
        if (isMounted && res.data?.success && res.data?.data) {
          setProject(res.data.data);
        } else if (isMounted) {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
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
        <p className="text-xs text-slate-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-sm text-slate-600 max-w-sm">
          The requested portfolio project could not be found or is no longer published.
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
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-cyan-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home Portfolio</span>
      </Link>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold uppercase tracking-wider">
            {categoryLabelMap[project.category] || project.category}
          </span>
          {project.completionYear && (
            <span className="flex items-center space-x-1 text-slate-500 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.completionYear}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>
      </div>

      {/* Cover Image */}
      {project.coverImage && (
        <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-100 shadow-xl">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Project Meta Information Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {project.clientName && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-cyan-600" />
              <span>Client / Industry</span>
            </span>
            <p className="text-sm font-bold text-slate-900">{project.clientName}</p>
          </div>
        )}

        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Category</span>
          </span>
          <p className="text-sm font-bold text-slate-900">
            {categoryLabelMap[project.category] || project.category}
          </p>
        </div>

        {/* External Links */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Links
          </span>
          <div className="flex items-center space-x-3 pt-0.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-600 hover:text-cyan-700"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Full Description */}
      {project.fullDescription && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Project Overview</h2>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40">
            {project.fullDescription}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-cyan-600" />
            <span>Technologies Used</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech.id || tech.name}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Images */}
      {project.images && project.images.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Project Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm"
              >
                <img src={img.imageUrl} alt={img.caption || project.title} className="w-full h-48 object-cover" />
                {img.caption && (
                  <p className="p-3 text-xs text-slate-600 border-t border-slate-200">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Link */}
      {project.caseStudy && (
        <div className="p-6 rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-cyan-700" />
              <span>Related Case Study</span>
            </h3>
            <p className="text-xs text-slate-600">{project.caseStudy.title}</p>
          </div>
          <Link
            to={`/case-studies/${project.caseStudy.slug}`}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition shadow-md"
          >
            Read Case Study
          </Link>
        </div>
      )}
    </div>
  );
}
