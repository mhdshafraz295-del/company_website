import React from 'react';
import usePublicData from '../hooks/usePublicData';
import TiltCard from '../components/motion/TiltCard';
import Reveal3D from '../components/motion/Reveal3D';
import { Star, Quote, Sparkles, User } from 'lucide-react';

export default function TestimonialsSection() {
  const { testimonials, loading } = usePublicData();

  if (loading.testimonials || !testimonials || testimonials.length === 0) {
    return null; // Gracefully hide section if no approved testimonials exist
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50/80 text-cyan-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Clients Say About NexGen
          </h2>
        </Reveal3D>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <Reveal3D key={t.id} delay={idx * 0.05}>
              <TiltCard className="bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-cyan-300 shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-7 space-y-4 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative h-full">
                <Quote className="w-8 h-8 text-cyan-200 absolute top-5 right-5" />

                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/80 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {t.profileImage ? (
                      <img
                        src={t.profileImage}
                        alt={t.clientName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.clientName}</h4>
                    {(t.company || t.position) && (
                      <p className="text-[11px] text-slate-500 font-medium">
                        {[t.position, t.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
