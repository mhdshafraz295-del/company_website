import React from 'react';
import { Link } from 'react-router-dom';
import usePublicData from '../hooks/usePublicData';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export default function CaseStudiesSection() {
  const { caseStudies, loading } = usePublicData();

  if (loading.caseStudies || !caseStudies || caseStudies.length === 0) {
    return null; // Gracefully hide section if no published case studies exist
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Engineering Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Problem, Solution & Impact
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth analysis of technical challenges and practical software solutions delivered for clients.
          </p>
        </Reveal3D>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, idx) => (
            <Reveal3D key={study.id} delay={idx * 0.08}>
              <TiltCard className="bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl flex flex-col justify-between h-full">
                <div className="space-y-4" style={{ transformStyle: 'preserve-3d' }}>
                  <div
                    className="flex items-center space-x-2 text-cyan-700 text-xs font-bold uppercase tracking-wider"
                    style={{ transform: 'translateZ(16px)' }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Case Study</span>
                  </div>

                  <h3
                    className="text-xl font-bold text-slate-900 leading-snug"
                    style={{ transform: 'translateZ(18px)' }}
                  >
                    {study.title}
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-600" style={{ transform: 'translateZ(8px)' }}>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Problem:</span>
                      <p className="text-slate-600 line-clamp-2">{study.problem}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Solution:</span>
                      <p className="text-slate-600 line-clamp-2">{study.solution}</p>
                    </div>
                    {study.result && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-sm">
                        <span className="font-bold block mb-0.5 text-emerald-900">Impact & Results:</span>
                        <p className="line-clamp-2">{study.result}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-auto" style={{ transform: 'translateZ(14px)' }}>
                  <Link
                    to={`/case-studies/${study.slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </Reveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
