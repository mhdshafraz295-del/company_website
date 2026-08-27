import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MessageSquare } from 'lucide-react';
import usePublicData from '../hooks/usePublicData';
import MagneticButton from '../components/motion/MagneticButton';
import Reveal3D from '../components/motion/Reveal3D';

export default function ContactCTASection() {
  const { settings } = usePublicData();

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030712] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal3D className="relative overflow-hidden bg-gradient-to-r from-cyan-50/90 via-blue-50/80 to-teal-50/90 dark:from-[#0D1322]/90 dark:via-[#0F172A]/90 dark:to-[#0B101D]/90 border border-cyan-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed font-normal">
              Tell us what you want to build and let NexGen Solutions help turn your idea into a high-performance digital product.
            </p>

            {/* CTAs with MagneticButton */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <MagneticButton>
                <Link
                  to="/get-a-quote"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-3.5 px-8 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>

              <Link
                to="/contact"
                className="w-full sm:w-auto bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow py-3.5 px-8 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
              >
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Quick Contact Info Bar */}
            <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              {settings?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  <span>{settings.email}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.whatsapp && (
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </div>
              )}
            </div>
          </div>
        </Reveal3D>
      </div>
    </section>
  );
}
