import React from 'react';
import usePublicData from '../hooks/usePublicData';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import {
  Globe,
  Smartphone,
  Code,
  Layout,
  ShoppingCart,
  Briefcase,
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

const iconMap = {
  Globe,
  Smartphone,
  Code,
  Layout,
  ShoppingCart,
  Briefcase,
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
};

export default function ServicesSection() {
  const { services, loading } = usePublicData();

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-white relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50/80 text-cyan-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Service Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            End-to-End Technology & Software Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From modern web applications to scalable enterprise systems, we provide comprehensive development and technical services.
          </p>
        </Reveal3D>

        {/* Loading Skeleton */}
        {loading.services ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading official services catalog...</p>
          </div>
        ) : services.length > 0 ? (
          /* API-Driven Services Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, idx) => {
              const IconComponent = iconMap[service.icon] || Cpu;
              return (
                <Reveal3D key={service.id} delay={idx * 0.05}>
                  <TiltCard className="group bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-cyan-400 shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-cyan-500/10">
                    <div className="space-y-4">
                      <div className="p-3.5 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl text-cyan-600 w-fit shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                          <span>{service.title}</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal3D>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl">
            <p className="text-slate-600 text-sm">Services catalog is currently updating.</p>
          </div>
        )}
      </div>
    </section>
  );
}
