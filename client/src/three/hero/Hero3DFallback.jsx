import React, { useRef, useEffect } from 'react';

export default function Hero3DFallback() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err?.name === 'AbortError') return;
          console.log('Hero3DFallback video autoplay notice:', err.message);
        });
      }
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050811]">
      {/* HTML5 Video Fallback Background */}
      <video
        ref={videoRef}
        src="/videos/nexgen-promo.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
      />

      {/* Dark Readability Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/60 via-transparent to-[#050811] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
}
