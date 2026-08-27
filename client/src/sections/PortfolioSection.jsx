import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePublicData from '../hooks/usePublicData';
import { getImageUrl } from '../utils/imageUrl';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { FolderGit2, Sparkles, ArrowRight, Loader2, Code2 } from 'lucide-react';

const categoryTabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Websites', value: 'WEBSITE' },
  { label: 'Mobile Apps', value: 'MOBILE_APP' },
  { label: 'Software', value: 'SOFTWARE' },
  { label: 'E-Commerce', value: 'ECOMMERCE' },
  { label: 'Education', value: 'EDUCATION' },
  { label: 'Business Systems', value: 'BUSINESS_SYSTEM' },
];

const categoryLabelMap = {
  WEBSITE: 'Website',
  MOBILE_APP: 'Mobile App',
  SOFTWARE: 'Software',
  ECOMMERCE: 'E-Commerce',
  EDUCATION: 'Education',
  BUSINESS_SYSTEM: 'Business System',
  OTHER: 'Other',
};

export default function PortfolioSection() {
  const { projects, loading } = usePublicData();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProjects =
    selectedCategory === 'ALL'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-16 sm:py-20 lg:py-24 bg-[#F4F9FF] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects We Have Crafted
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore software solutions, web platforms, and mobile applications engineered for client success.
          </p>
        </Reveal3D>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === tab.value
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/80 dark:bg-[#0D1322]/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Loading State */}
        {loading.projects ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading published portfolio projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          /* Projects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <Reveal3D key={project.id} delay={idx * 0.02}>
                <TiltCard className="group bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between h-full">
                  {/* Cover Image or Fallback Header */}
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
                    {project.coverImage ? (
                      <img
                        src={getImageUrl(project.coverImage)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <Code2 className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {categoryLabelMap[project.category] || project.category}
                        </span>
                      </div>
                    )}
                    {project.featured && (
                      <span className="absolute top-3 right-3 bg-cyan-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-700 dark:text-cyan-400 font-semibold uppercase tracking-wider">
                          {categoryLabelMap[project.category] || project.category}
                        </span>
                        {project.completionYear && (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">
                            {project.completionYear}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies Tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech.id || tech.name}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-semibold"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Link Action */}
                    <div className="pt-2 mt-auto">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                      >
                        <span>View Project Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </Reveal3D>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white/80 border border-slate-200 rounded-3xl space-y-3 max-w-md mx-auto shadow-sm">
            <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Portfolio Projects Listed</h4>
            <p className="text-xs text-slate-500">
              Published projects will appear here as they are added to the system.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
