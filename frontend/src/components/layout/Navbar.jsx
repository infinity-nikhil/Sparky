import { useState, useEffect } from "react";

const navLinks = [
  { label: "Products" },
  { label: "Solutions" },
  { label: "Resources" },
  { label: "Pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes linkFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-animate {
          animation: navSlideDown 0.5s ease forwards;
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 1px;
          background: #00ea64;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .link-1 { opacity: 0; animation: linkFadeIn 0.4s ease forwards; animation-delay: 0.2s; }
        .link-2 { opacity: 0; animation: linkFadeIn 0.4s ease forwards; animation-delay: 0.3s; }
        .link-3 { opacity: 0; animation: linkFadeIn 0.4s ease forwards; animation-delay: 0.4s; }
        .link-4 { opacity: 0; animation: linkFadeIn 0.4s ease forwards; animation-delay: 0.5s; }
        .cta-fade { opacity: 0; animation: linkFadeIn 0.4s ease forwards; animation-delay: 0.6s; }
        .signup-btn {
          position: relative;
          overflow: hidden;
        }
        .signup-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.4s ease;
        }
        .signup-btn:hover::before {
          left: 100%;
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 nav-animate transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50" : "bg-black/80 backdrop-blur-md border-b border-white/5"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-12">

          <span className="text-white font-bold text-xl tracking-tight cursor-pointer hover:text-[#00ea64] transition-colors duration-300">
            HackerRank
          </span>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <li key={link.label} className={`link-${i + 1}`}>
                <a href="#" className="nav-link text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3 ml-auto cta-fade">
            <a href="#" className="nav-link text-gray-300 hover:text-white text-sm flex items-center gap-1 transition-colors duration-200">
              For Developers
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button className="px-4 py-1.5 text-sm text-white border border-white/20 rounded-md hover:bg-white/10 hover:border-white/40 transition-all duration-200">
              Request Demo
            </button>
            <button className="signup-btn px-4 py-1.5 text-sm text-black bg-[#00ea64] rounded-md font-medium hover:bg-[#00d45a] transition-colors duration-200">
              Sign Up
            </button>
          </div>

          <button className="md:hidden text-white ml-auto hover:text-[#00ea64] transition-colors duration-200" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>

        {menuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.label} href="#" className="nav-link text-gray-300 hover:text-white text-sm w-fit">
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <button className="w-full px-4 py-2 text-sm text-white border border-white/20 rounded-md hover:bg-white/10 transition-all duration-200">
                Request Demo
              </button>
              <button className="signup-btn w-full px-4 py-2 text-sm text-black bg-[#00ea64] rounded-md font-medium">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}