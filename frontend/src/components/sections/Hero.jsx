export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.07; transform: scale(1); }
          50% { opacity: 0.13; transform: scale(1.08); }
        }
        @keyframes starFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(15deg); }
        }

        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.8s ease forwards;
        }
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-900 { animation-delay: 0.9s; }

        .glow-pulse {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .star-float {
          animation: starFloat 3s ease-in-out infinite;
        }
        .fingerprint-spin {
          animation: spinSlow 12s linear infinite;
          transform-origin: center;
        }

        .btn-glow:hover {
          box-shadow: 0 0 24px rgba(0, 234, 100, 0.15);
        }
      `}</style>

      {/* Radial glow */}
      <div className="absolute inset-0 glow-pulse bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(0,234,100,0.07),transparent)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

        {/* Line 1 */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
          <span className="block text-white/20 animate-fade-up delay-100">The future</span>
          <span className="block text-white/20 animate-fade-up delay-300">of development</span>

          {/* Line 3 — "is human + AI" */}
          <span className="text-white flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-500">
            is

            {/* Fingerprint */}
            <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full fingerprint-spin">
                <path d="M40 8C22.3 8 8 22.3 8 40" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M40 16C26.7 16 16 26.7 16 40" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M40 24C31.2 24 24 31.2 24 40c0 4 1 8 3 11" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M40 32C35.6 32 32 35.6 32 40v4" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M48 40c0-4.4-3.6-8-8-8" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M56 40c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 6 2 10 4 14" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
                <path d="M64 40C64 23.4 53 8 40 8" stroke="#00ea64" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>

            human

            {/* Star */}
            <span className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 star-float">
              <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
                <path d="M30 4L34 26L56 30L34 34L30 56L26 34L4 30L26 26L30 4Z" fill="url(#starGrad)" />
                <defs>
                  <linearGradient id="starGrad" x1="4" y1="4" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00ea64" />
                    <stop offset="0.5" stopColor="#00bfff" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>

            AI
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed animate-fade-up delay-700">
          We help you map the skills you need, track the skills you have, and close your gaps to thrive in a GenAI world.
        </p>

        {/* CTA */}
        <button className="mt-10 px-8 py-3.5 text-white text-sm font-medium border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300 btn-glow animate-fade-up delay-900">
          Join The Community
        </button>

      </div>
    </section>
  );
}