import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, FileText, Map, Layout, Code2, Cpu, CheckCircle2, Rocket, Wrench, Layers } from 'lucide-react';
import Process3DContainer from '../three/process/Process3DContainer';
import Reveal3D from '../components/motion/Reveal3D';

const stages = [
  { step: '01', title: 'Discovery', description: 'Understanding project goals, target audience, and business requirements.', icon: Search },
  { step: '02', title: 'Requirement Analysis', description: 'Defining technical specifications, scope, and architecture roadmap.', icon: FileText },
  { step: '03', title: 'Planning', description: 'Mapping project milestones, sprint deliverables, and resource allocation.', icon: Map },
  { step: '04', title: 'UI/UX Design', description: 'Creating interactive wireframes, user journeys, and modern design systems.', icon: Layout },
  { step: '05', title: 'Development', description: 'Writing high-performance, clean code across frontend and backend stacks.', icon: Code2 },
  { step: '06', title: 'Integration', description: 'Connecting REST APIs, database models, and third-party services.', icon: Cpu },
  { step: '07', title: 'Testing', description: 'Rigorous quality assurance, security audits, and responsiveness testing.', icon: CheckCircle2 },
  { step: '08', title: 'Deployment', description: 'Configuring production environments, SSL, and automated CI/CD releases.', icon: Rocket },
  { step: '09', title: 'Maintenance', description: 'Proactive monitoring, regular security updates, and SLA support.', icon: Wrench },
];

export default function ProcessSection() {
  const [isTouchOrSmallScreen, setIsTouchOrSmallScreen] = useState(false);

  useEffect(() => {
    const checkTouchOrSmall = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isSmall = window.innerWidth < 768;
      setIsTouchOrSmallScreen(isCoarse || isSmall);
    };
    checkTouchOrSmall();
    window.addEventListener('resize', checkTouchOrSmall);
    return () => window.removeEventListener('resize', checkTouchOrSmall);
  }, []);

  return (
    <section id="process" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F8FAFC] dark:bg-[#060913] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Development Workflow & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Build Digital Products
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            A structured 9-stage engineering process powered by modern software architecture layers.
          </p>
        </Reveal3D>

        {/* 3D Exploded-View Architecture Showcase (Rendered for Fine Pointers / Non-Touch Desktops) */}
        {!isTouchOrSmallScreen ? (
          <Reveal3D delay={0.02} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>3D Architecture Layers</span>
              </div>
              <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-2.5 py-0.5 rounded-full">
                9-Stage Engineering
              </span>
            </div>

            <Process3DContainer />

            <div className="text-center space-y-1 pt-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                From Idea to Complete Digital Product
              </h3>
              <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                Designed. Developed. Tested. Deployed.
              </p>
            </div>
          </Reveal3D>
        ) : (
          /* Simplified Lightweight Architecture Header for Mobile & Touch Tablets */
          <div className="p-5 bg-white/80 dark:bg-[#0D1322]/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center space-y-1.5 shadow-sm">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>9-Stage Full Lifecycle Engineering</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Structured sequence from concept discovery to production maintenance.
            </p>
          </div>
        )}

        {/* Semantic DOM 9-Stage Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <Reveal3D key={stage.step} delay={idx * 0.02}>
                <div className="bg-white/80 dark:bg-[#0D1322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/50 rounded-3xl p-6 sm:p-7 relative space-y-3 transition-all duration-200 flex flex-col justify-between h-full shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 hover:-translate-y-[3px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl shadow-sm bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300">
                        Stage {stage.step}
                      </span>
                      <div className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{stage.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </Reveal3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
