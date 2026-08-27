import React, { useState } from 'react';
import usePublicData from '../hooks/usePublicData';
import Reveal3D from '../components/motion/Reveal3D';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function FAQSection() {
  const { faqs } = usePublicData();
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] relative z-10 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <Reveal3D className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Find quick answers regarding our software development process, technologies, and project engagement models.
          </p>
        </Reveal3D>

        {/* Accessible Accordion */}
        {faqs && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal3D key={faq.id} delay={index * 0.04}>
                  <div
                    className={`bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen ? 'shadow-xl border-cyan-300' : 'shadow-md shadow-slate-200/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={isOpen}
                      className="w-full text-left p-5 flex items-center justify-between space-x-4 focus:outline-none focus:bg-slate-50/80 hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-900 pr-2 leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-cyan-600 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </Reveal3D>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/80 border border-slate-200 rounded-2xl shadow-sm">
            <p className="text-slate-600 text-sm">FAQ section updating shortly.</p>
          </div>
        )}
      </div>
    </section>
  );
}
