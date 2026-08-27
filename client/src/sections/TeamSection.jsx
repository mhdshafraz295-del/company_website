import React from 'react';
import usePublicData from '../hooks/usePublicData';
import { getImageUrl } from '../utils/imageUrl';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { Sparkles, Linkedin, Github, Mail, User } from 'lucide-react';

export default function TeamSection() {
  const { team, loading } = usePublicData();

  if (loading.team || !team || team.length === 0) {
    return null; // Gracefully hide section if no active team members exist
  }

  return (
    <section id="team" className="py-16 sm:py-20 lg:py-24 bg-white relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Specialists</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet the Engineering Team
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Talented developers, designers, and IT professionals dedicated to crafting modern software.
          </p>
        </Reveal3D>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {team.map((member, idx) => (
            <Reveal3D key={member.id} delay={idx * 0.05}>
              <TiltCard className="bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-cyan-300 rounded-3xl p-6 text-center space-y-4 shadow-xl shadow-slate-200/40 hover:shadow-2xl flex flex-col justify-between h-full">
                <div className="space-y-3 flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                  <div
                    className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {member.photo ? (
                      <img
                        src={getImageUrl(member.photo)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>

                  <div style={{ transform: 'translateZ(14px)' }}>
                    <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                    <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider mt-0.5">
                      {member.position}
                    </p>
                  </div>

                  {member.shortBio && (
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xs" style={{ transform: 'translateZ(8px)' }}>
                      {member.shortBio}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                <div
                  className="flex items-center justify-center space-x-3 pt-3 border-t border-slate-200/80 mt-auto"
                  style={{ transform: 'translateZ(12px)' }}
                >
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
