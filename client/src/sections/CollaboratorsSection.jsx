import React, { useState, useMemo } from 'react';
import usePublicData from '../hooks/usePublicData';
import { getImageUrl } from '../utils/imageUrl';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import {
  Handshake,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  FolderGit2,
  Star,
  Quote,
  User,
  ArrowRight,
  Code2,
  ChevronRight,
} from 'lucide-react';

export default function CollaboratorsSection() {
  const { collaborators, projects, testimonials, loading } = usePublicData();

  // Selected collaborator for viewing detailed projects & reviews
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState(null);

  // Active collaborators only
  const activeCollaborators = useMemo(() => {
    if (!collaborators || !Array.isArray(collaborators)) return [];
    return collaborators.filter((c) => c.isActive !== false);
  }, [collaborators]);

  // Featured collaborators
  const featuredCollaborators = useMemo(() => {
    return activeCollaborators.filter((c) => c.isFeatured);
  }, [activeCollaborators]);

  // Selected collaborator object
  const activeSelectedCollaborator = useMemo(() => {
    if (selectedCollaboratorId) {
      const found = activeCollaborators.find((c) => c.id === selectedCollaboratorId);
      if (found) return found;
    }
    // Default to first featured or first active collaborator
    return featuredCollaborators[0] || activeCollaborators[0] || null;
  }, [selectedCollaboratorId, activeCollaborators, featuredCollaborators]);

  // Projects connected to the active selected collaborator
  const collaboratorProjects = useMemo(() => {
    if (!activeSelectedCollaborator) return [];
    // If collaborator has embedded projects from API, use those
    if (activeSelectedCollaborator.projects && activeSelectedCollaborator.projects.length > 0) {
      return activeSelectedCollaborator.projects;
    }
    // Otherwise cross-reference with public projects
    if (!projects || !Array.isArray(projects)) return [];
    return projects.filter(
      (p) =>
        p.collaboratorId === activeSelectedCollaborator.id ||
        p.collaborator?.id === activeSelectedCollaborator.id
    );
  }, [activeSelectedCollaborator, projects]);

  // Reviews connected to the active selected collaborator
  const collaboratorReviews = useMemo(() => {
    if (!activeSelectedCollaborator) return [];
    // If collaborator has embedded testimonials from API, use those
    if (activeSelectedCollaborator.testimonials && activeSelectedCollaborator.testimonials.length > 0) {
      return activeSelectedCollaborator.testimonials;
    }
    // Otherwise cross-reference with public testimonials
    if (!testimonials || !Array.isArray(testimonials)) return [];
    return testimonials.filter(
      (t) =>
        t.collaboratorId === activeSelectedCollaborator.id ||
        t.collaborator?.id === activeSelectedCollaborator.id
    );
  }, [activeSelectedCollaborator, testimonials]);

  // Format WhatsApp URL safely
  const getWhatsAppUrl = (rawNumber) => {
    if (!rawNumber) return null;
    const cleaned = rawNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleaned}`;
  };

  // If loading or no collaborators, gracefully return null
  if (loading.collaborators || activeCollaborators.length === 0) {
    return null;
  }

  // Duplicate arrays for continuous infinite marquee looping
  const marqueeLogos = [...activeCollaborators, ...activeCollaborators];
  const marqueeCards = [...activeCollaborators, ...activeCollaborators];

  return (
    <section
      id="collaborators"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030712] relative z-10 select-none overflow-hidden"
    >
      {/* CSS Keyframe Animations for Smooth Hardware-Accelerated Marquees */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 32s linear infinite;
        }
        .animate-marquee-rtl {
          display: flex;
          width: max-content;
          animation: marquee-rtl 38s linear infinite;
        }
        .pause-on-hover:hover,
        .pause-on-hover:focus-within {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-ltr,
          .animate-marquee-rtl {
            animation: none !important;
            transform: none !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Handshake className="w-3.5 h-3.5" />
            <span>Partnership Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Collaborators &amp; Trusted Partners
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Working together with businesses, institutions and organizations to build better digital solutions.
          </p>
        </Reveal3D>

        {/* ------------------------------------------------------------ */}
        {/* A. COLLABORATOR LOGO MARQUEE (LEFT TO RIGHT) */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-4">
          <div className="relative w-full overflow-hidden py-4 mask-gradient-x">
            {/* Ambient Side Fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#030712] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#030712] to-transparent z-10" />

            {/* Continuous Track (Left to Right) */}
            <div className="animate-marquee-ltr pause-on-hover">
              {marqueeLogos.map((collab, idx) => {
                const isDuplicate = idx >= activeCollaborators.length;
                return (
                  <div
                    key={`logo-${collab.id}-${idx}`}
                    aria-hidden={isDuplicate ? 'true' : undefined}
                    className="flex items-center justify-center px-6 sm:px-8 py-2 shrink-0"
                  >
                    {collab.website ? (
                      <a
                        href={collab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isDuplicate ? -1 : 0}
                        title={`Visit ${collab.name}`}
                        className="group flex items-center justify-center h-16 w-36 sm:w-44 px-4 py-2 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      >
                        {collab.logo ? (
                          <img
                            src={getImageUrl(collab.logo)}
                            alt={`${collab.name} logo`}
                            className="max-h-10 max-w-[120px] sm:max-w-[140px] w-auto h-auto object-contain opacity-70 grayscale contrast-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 text-center truncate">
                            {collab.name}
                          </span>
                        )}
                      </a>
                    ) : (
                      <div className="flex items-center justify-center h-16 w-36 sm:w-44 px-4 py-2 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                        {collab.logo ? (
                          <img
                            src={getImageUrl(collab.logo)}
                            alt={`${collab.name} logo`}
                            className="max-h-10 max-w-[120px] sm:max-w-[140px] w-auto h-auto object-contain opacity-70 grayscale contrast-75 hover:opacity-100 hover:grayscale-0 hover:contrast-100 hover:scale-105 transition-all duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center truncate">
                            {collab.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* B. PARTNER CONTACT CARDS (RIGHT TO LEFT) */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-4">
          <div className="relative w-full overflow-hidden py-2">
            {/* Ambient Side Fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#030712] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#030712] to-transparent z-10" />

            {/* Continuous Track (Right to Left) */}
            <div className="animate-marquee-rtl pause-on-hover">
              {marqueeCards.map((collab, idx) => {
                const isDuplicate = idx >= activeCollaborators.length;
                const waUrl = getWhatsAppUrl(collab.whatsapp);

                return (
                  <div
                    key={`card-${collab.id}-${idx}`}
                    aria-hidden={isDuplicate ? 'true' : undefined}
                    className="px-3 sm:px-4 shrink-0"
                  >
                    <div className="w-72 sm:w-80 h-full p-5 rounded-3xl bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between space-y-4">
                      {/* Card Header: Logo & Name */}
                      <div className="flex items-start space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                          {collab.logo ? (
                            <img
                              src={getImageUrl(collab.logo)}
                              alt={collab.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Handshake className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {collab.name}
                          </h3>
                          {collab.partnerType && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/50">
                              {collab.partnerType}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {collab.shortDescription || 'Trusted partner collaborating with Nexgen on high-impact technology systems.'}
                      </p>

                      {/* Action & Contact Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          {collab.phone && (
                            <a
                              href={`tel:${collab.phone}`}
                              tabIndex={isDuplicate ? -1 : 0}
                              title={`Call ${collab.phone}`}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={isDuplicate ? -1 : 0}
                              title="Chat on WhatsApp"
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition text-[11px] font-bold"
                            >
                              WA
                            </a>
                          )}

                          {collab.email && (
                            <a
                              href={`mailto:${collab.email}`}
                              tabIndex={isDuplicate ? -1 : 0}
                              title={`Email ${collab.email}`}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {collab.website && (
                            <a
                              href={collab.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={isDuplicate ? -1 : 0}
                              title="Visit Website"
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* View Collaboration Shortcut */}
                        <button
                          type="button"
                          tabIndex={isDuplicate ? -1 : 0}
                          onClick={() => {
                            setSelectedCollaboratorId(collab.id);
                            const el = document.getElementById('featured-collaborations');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* C. FEATURED COLLABORATIONS (STATIC RESPONSIVE GRID) */}
        {/* ------------------------------------------------------------ */}
        <div id="featured-collaborations" className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Strategic Partnerships</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Featured Collaborations
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any partner below to view joint projects and client feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeCollaborators.map((collab, idx) => {
              const isSelected = activeSelectedCollaborator?.id === collab.id;
              const projectCount = collab.projects?.length || collab._count?.projects || 0;

              return (
                <Reveal3D key={collab.id} delay={idx * 0.03}>
                  <TiltCard
                    className={`h-full rounded-3xl p-6 sm:p-7 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-50/90 to-white dark:from-[#0f172a] dark:to-[#080d19] border-cyan-500 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                        : 'bg-white/80 dark:bg-[#0D1322]/80 border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/50 shadow-lg shadow-slate-200/30 dark:shadow-slate-950/30'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Logo and Meta */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center">
                          {collab.logo ? (
                            <img
                              src={getImageUrl(collab.logo)}
                              alt={collab.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Handshake className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                          )}
                        </div>

                        {collab.partnerType && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-300/40 dark:border-cyan-800/50">
                            {collab.partnerType}
                          </span>
                        )}
                      </div>

                      {/* Name & Description */}
                      <div className="space-y-1.5">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <span>{collab.name}</span>
                          {collab.website && (
                            <a
                              href={collab.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-cyan-500"
                              title="Visit Partner Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {collab.shortDescription || 'Strategic partner collaborating with Nexgen on modern, scalable digital architecture.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action / Selection */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{projectCount} Completed {projectCount === 1 ? 'Project' : 'Projects'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCollaboratorId(collab.id)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400'
                        }`}
                      >
                        <span>{isSelected ? 'Viewing' : 'View Collaboration'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </TiltCard>
                </Reveal3D>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* D. PROJECTS WE COMPLETED TOGETHER */}
        {/* ------------------------------------------------------------ */}
        {activeSelectedCollaborator && (
          <div className="space-y-8 pt-4">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Joint Engineering &amp; Delivery
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Projects We Completed Together
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deliverables crafted in partnership with <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSelectedCollaborator.name}</span>
                </p>
              </div>

              {activeSelectedCollaborator.website && (
                <a
                  href={activeSelectedCollaborator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <span>Visit {activeSelectedCollaborator.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {collaboratorProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {collaboratorProjects.map((project, idx) => (
                  <Reveal3D key={project.id || idx} delay={idx * 0.03}>
                    <TiltCard className="group bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between h-full">
                      {/* Project Cover Media */}
                      <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
                        {project.coverImage ? (
                          <img
                            src={getImageUrl(project.coverImage)}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                            <Code2 className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {project.category || 'Software Solution'}
                            </span>
                          </div>
                        )}

                        {/* Partner Tag Overlay */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center space-x-1">
                          <Handshake className="w-3 h-3 text-cyan-400" />
                          <span>{activeSelectedCollaborator.name}</span>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <span className="uppercase tracking-wider">{project.category || 'Web Application'}</span>
                            {project.completionYear && <span>{project.completionYear}</span>}
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                            {project.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {project.shortDescription}
                          </p>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.slice(0, 4).map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                >
                                  {tech.name || tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action links */}
                          <div className="flex items-center justify-between pt-1">
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                              >
                                <span>Live Demo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Enterprise Deployment</span>
                            )}

                            {project.slug && (
                              <a
                                href={`/projects/${project.slug}`}
                                className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                              >
                                <span>Case Study</span>
                                <ArrowRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal3D>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-50/70 dark:bg-[#0D1322]/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <FolderGit2 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Projects Currently Under Active Development
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Joint initiatives with {activeSelectedCollaborator.name} are currently in production or protected by confidentiality agreements.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* E. CLIENT REVIEWS (RELATED TO COLLABORATOR / PROJECT) */}
        {/* ------------------------------------------------------------ */}
        {collaboratorReviews.length > 0 && (
          <div className="space-y-8 pt-4">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Partner Endorsements
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Client Reviews &amp; Testimonials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified feedback from stakeholders and executives at {activeSelectedCollaborator.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {collaboratorReviews.map((review, idx) => (
                <Reveal3D key={review.id || idx} delay={idx * 0.03}>
                  <TiltCard className="bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/50 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 rounded-3xl p-6 sm:p-7 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative h-full">
                    <Quote className="w-8 h-8 text-cyan-200 dark:text-cyan-900/60 absolute top-5 right-5" />

                    <div className="space-y-3">
                      {/* Rating Stars */}
                      <div className="flex items-center space-x-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                        "{review.review}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                        {review.profileImage ? (
                          <img
                            src={getImageUrl(review.profileImage)}
                            alt={review.clientName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {review.clientName}
                        </h4>
                        {(review.company || review.position || activeSelectedCollaborator?.name) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {[review.position, review.company || activeSelectedCollaborator?.name]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </Reveal3D>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

