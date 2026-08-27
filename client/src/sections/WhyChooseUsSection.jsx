import React from 'react';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { Sparkles, Cpu, Wrench, Monitor, ShieldCheck, Zap, Layout, MessageSquare, Headphones } from 'lucide-react';

const benefits = [
  {
    title: 'Modern Technologies',
    description: 'Built with battle-tested frameworks including React, Node.js, and MySQL.',
    icon: Cpu,
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored software architectures designed strictly around your business workflow.',
    icon: Wrench,
  },
  {
    title: 'Responsive Design',
    description: 'Optimized layouts delivering a flawless experience across mobile, tablet, and desktop.',
    icon: Monitor,
  },
  {
    title: 'Secure Development',
    description: 'Encrypted sessions, parameter sanitization, and enterprise security practices.',
    icon: ShieldCheck,
  },
  {
    title: 'High Performance',
    description: 'Fast page loads, quick API responses, and optimized database queries.',
    icon: Zap,
  },
  {
    title: 'Clean UI/UX',
    description: 'User-centered interfaces focused on clarity, accessibility, and conversion.',
    icon: Layout,
  },
  {
    title: 'Transparent Communication',
    description: 'Clear milestone updates, transparent timelines, and active collaboration.',
    icon: MessageSquare,
  },
  {
    title: 'Long-Term Support',
    description: 'Proactive maintenance, dependency updates, and ongoing technical support.',
    icon: Headphones,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50/80 text-cyan-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Work With Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Reliability & Client Success
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We focus on software quality, security, and clear communication to deliver digital solutions that last.
          </p>
        </Reveal3D>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <Reveal3D key={b.title} delay={idx * 0.02}>
                <TiltCard className="bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-cyan-300 rounded-3xl p-6 space-y-3 flex flex-col justify-between h-full shadow-xl shadow-slate-200/40 hover:shadow-2xl">
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl text-cyan-600 w-fit shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </TiltCard>
              </Reveal3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
