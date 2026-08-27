import React from 'react';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { Target, Compass, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const coreValues = [
  'Innovation',
  'Quality',
  'Reliability',
  'Security',
  'Creativity',
  'Client Satisfaction',
  'Continuous Improvement',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-[#F4F9FF] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About NexGen Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineering High-Performance Digital Products
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            NexGen Solutions is a modern technology company focused on creating reliable, scalable, and visually impressive digital solutions for businesses and organizations.
          </p>
        </Reveal3D>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <Reveal3D delay={0.1}>
            <TiltCard className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-4 hover:shadow-2xl hover:border-cyan-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-600 w-fit">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  To transform ideas into practical digital products using modern technology, thoughtful design, and dependable development practices.
                </p>
              </div>
            </TiltCard>
          </Reveal3D>

          {/* Vision Card */}
          <Reveal3D delay={0.2}>
            <TiltCard className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-4 hover:shadow-2xl hover:border-blue-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 w-fit">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Our Vision
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  To become a trusted technology partner for businesses and organizations by delivering innovative, scalable, and reliable digital solutions.
                </p>
              </div>
            </TiltCard>
          </Reveal3D>
        </div>

        {/* Core Values Section */}
        <Reveal3D delay={0.3}>
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Our Core Values</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {coreValues.map((value) => (
                <div
                  key={value}
                  className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm transition-transform hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal3D>
      </div>
    </section>
  );
}
