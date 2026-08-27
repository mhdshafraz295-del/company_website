import React from 'react';
import usePublicData from '../hooks/usePublicData';
import { getImageUrl } from '../utils/imageUrl';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { UserCheck, Sparkles, Linkedin, Github, Mail, Compass } from 'lucide-react';

export default function FounderSection() {
  const { founder, loading } = usePublicData();

  if (loading.founder || !founder) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Meet Our Founder
          </h2>
        </Reveal3D>

        {/* Founder Profile Card */}
        <Reveal3D delay={0.02}>
          <div className="max-w-5xl mx-auto bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Photo Column with TiltCard */}
              <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center text-center">
                <TiltCard className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xl">
                    {founder.photo ? (
                      <img
                        src={getImageUrl(founder.photo)}
                        alt={founder.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 text-cyan-600 dark:text-cyan-400">
                        <UserCheck className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </TiltCard>

                <div className="mt-4 space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {founder.name}
                  </h3>
                  <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-widest">
                    {founder.primaryRole || 'Founder & CEO'}
                  </p>
                </div>

                {/* Founder Social Links */}
                <div className="flex items-center space-x-3 mt-4">
                  {founder.linkedinUrl && (
                    <a
                      href={founder.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-800 transition"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {founder.githubUrl && (
                    <a
                      href={founder.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-800 transition"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {founder.email && (
                    <a
                      href={`mailto:${founder.email}`}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-800 transition"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Details Column */}
              <div className="md:col-span-8 space-y-4">
                {founder.expertise && (
                  <div className="inline-block px-3 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                    {founder.expertise}
                  </div>
                )}

                {founder.shortBio && (
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {founder.shortBio}
                  </p>
                )}

                {founder.fullBiography && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {founder.fullBiography}
                  </p>
                )}

                {founder.visionStatement && (
                  <div className="p-4.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border border-cyan-100 dark:border-slate-700 space-y-1 shadow-sm">
                    <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                      <Compass className="w-4 h-4" />
                      <span>Founder's Vision</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic font-medium">
                      "{founder.visionStatement}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal3D>
      </div>
    </section>
  );
}
