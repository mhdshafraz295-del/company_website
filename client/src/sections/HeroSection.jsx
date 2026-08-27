import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePublicData from '../hooks/usePublicData';
import { ArrowRight, Sparkles, Code2, Cpu, ShieldCheck, Layers, Smartphone } from 'lucide-react';

export default function HeroSection() {
  const { settings } = usePublicData();
  const videoRef = useRef(null);

  // Native HTML5 Video Autoplay & Reliability Controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    playVideo();
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  // Document Visibility Change Controller (only pause when browser tab is hidden)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <section
      id="home"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-[#F8FBFF] select-none min-h-[480px] sm:min-h-[560px] md:min-h-[70vh] lg:min-h-[88vh] xl:min-h-[95vh] flex items-center"
    >
      {/* Background Native HTML5 Video Layer (Opacity 100% - Unreduced Vibrant Playback) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/videos/nexgen-promo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center opacity-100 filter brightness-100 contrast-[1.02]"
          aria-hidden="true"
        />

        {/* Subtle Readability Gradient Overlays: Clear & Vibrant Promo Video with High-Contrast Text */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/50 pointer-events-none z-10" />
      </div>

      {/* Hero Semantic Content Layer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-cyan-300/80 bg-white/90 text-cyan-800 text-[11px] sm:text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>{settings?.heroEyebrow || 'NexGen Solutions'}</span>
            </div>

            {/* Main Headline with Selective Gradient */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.12] drop-shadow-sm">
              {settings?.heroHeading || 'Building the Next Generation of'}{' '}
              <span className="bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
                Digital Solutions
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-900 max-w-xl leading-relaxed font-semibold drop-shadow-sm">
              {settings?.heroDescription ||
                'We create modern websites, mobile applications, and custom software solutions designed to help businesses grow.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
              <Link
                to="/get-a-quote"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
              >
                <span>{settings?.primaryCtaText || 'Start Your Project'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#portfolio"
                className="w-full sm:w-auto bg-white/90 hover:bg-white text-slate-900 font-bold border border-slate-300 shadow-md hover:shadow-lg py-3.5 px-7 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm active:scale-95 backdrop-blur-md"
              >
                <span>{settings?.secondaryCtaText || 'Explore Our Work'}</span>
              </a>
            </div>

            {/* Supporting Factual Highlights */}
            <div className="pt-6 border-t border-slate-300/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span className="truncate">Modern Tech</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">React & Node</p>
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="truncate">Responsive</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">All Viewports</p>
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="truncate">Scalable</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">Enterprise Ready</p>
              </div>
            </div>
          </div>

          {/* Right Column: Translucent Glass Floating Tech Cards */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Code & API Glass Panel */}
              <div className="bg-white/45 backdrop-blur-md border border-white/70 shadow-2xl shadow-slate-300/50 rounded-3xl p-6 sm:p-7 relative z-10 transition-all">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    <span className="text-xs font-bold text-slate-700 ml-2">nexgen-api.ts</span>
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>API Online 99.9%</span>
                  </span>
                </div>

                {/* Abstract Code Display */}
                <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-xl">
                  <div className="text-cyan-400">// NexGen Enterprise Architecture</div>
                  <div><span className="text-purple-400">const</span> app = <span className="text-blue-400">createApp</span>();</div>
                  <div>app.<span className="text-blue-400">use</span>(authMiddleware);</div>
                  <div>app.<span className="text-blue-400">use</span>(prismaClient);</div>
                  <div className="text-emerald-400 mt-1">// Response payload</div>
                  <div className="text-amber-300">&#123; status: <span className="text-emerald-300">200</span>, system: <span className="text-cyan-300">"Optimal"</span> &#125;</div>
                </div>

                {/* Micro Metric Badges */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-2">
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Latency</div>
                    <div className="text-sm font-extrabold text-slate-950 mt-0.5">14ms</div>
                  </div>
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Security</div>
                    <div className="text-sm font-extrabold text-cyan-700 mt-0.5">JWT / SSL</div>
                  </div>
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Database</div>
                    <div className="text-sm font-extrabold text-teal-700 mt-0.5">MySQL</div>
                  </div>
                </div>
              </div>

              {/* Floating Layer 1: Mobile App Preview Floater */}
              <div className="absolute -bottom-6 -left-6 bg-white/85 backdrop-blur-md border border-white/80 shadow-xl rounded-2xl p-4 z-20 hidden sm:flex items-center space-x-3 max-w-[220px]">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-950">Mobile Apps</div>
                  <div className="text-[11px] font-semibold text-slate-600">iOS & Android</div>
                </div>
              </div>

              {/* Floating Layer 2: Cloud Infrastructure Floater */}
              <div className="absolute -top-6 -right-6 bg-white/85 backdrop-blur-md border border-white/80 shadow-xl rounded-2xl p-4 z-20 hidden sm:flex items-center space-x-3 max-w-[210px]">
                <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-950">Custom Cloud</div>
                  <div className="text-[11px] font-semibold text-slate-600">Microservices</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
