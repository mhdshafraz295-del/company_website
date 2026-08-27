import React from 'react';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { Code, Database, Smartphone, Wrench, Sparkles, Layers } from 'lucide-react';

const techCategories = [
  {
    category: 'Frontend',
    icon: Code,
    color: 'text-cyan-600 border-cyan-200 bg-cyan-50',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    icon: Layers,
    color: 'text-blue-600 border-blue-200 bg-blue-50',
    skills: ['Node.js', 'Express.js', 'REST APIs'],
  },
  {
    category: 'Database',
    icon: Database,
    color: 'text-teal-600 border-teal-200 bg-teal-50',
    skills: ['MySQL', 'Prisma ORM'],
  },
  {
    category: 'Mobile',
    icon: Smartphone,
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    skills: ['Flutter', 'React Native'],
  },
  {
    category: 'Tools & Platforms',
    icon: Wrench,
    color: 'text-violet-600 border-violet-200 bg-violet-50',
    skills: ['Git', 'GitHub', 'Firebase', 'Docker'],
  },
];

export default function TechnologiesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50/80 text-cyan-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Technology Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tools & Frameworks We Master
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We use industry-standard technologies to ensure high performance, security, and long-term maintainability.
          </p>
        </Reveal3D>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {techCategories.map((group, idx) => {
            const Icon = group.icon;
            return (
              <Reveal3D key={group.category} delay={idx * 0.02}>
                <TiltCard className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-7 space-y-4 hover:shadow-2xl hover:border-cyan-300 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-2xl border ${group.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{group.category}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 hover:border-cyan-200 transition-colors shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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
