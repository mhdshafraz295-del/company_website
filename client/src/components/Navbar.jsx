import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', sectionId: 'home' },
  { name: 'About', sectionId: 'about' },
  { name: 'Services', sectionId: 'services' },
  { name: 'Portfolio', sectionId: 'portfolio' },
  { name: 'Process', sectionId: 'process' },
  { name: 'Team', sectionId: 'team' },
  { name: 'Contact', sectionId: 'contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div
          className={`pointer-events-auto rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-200/50 py-2.5 px-4 sm:px-6'
              : 'bg-white/80 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-200/40 py-3 px-4 sm:px-6'
          } flex items-center justify-between`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-2 rounded-xl shadow-sm group-hover:border-cyan-300 transition-colors">
              <img
                src="/images/nexgen-logo.png"
                alt="NexGen Solutions Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-cyan-600 transition-colors">
                NexGen Solutions
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Software & Web Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.sectionId}
                href={`#${link.sectionId}`}
                onClick={(e) => handleNavClick(link.sectionId, e)}
                className="text-xs lg:text-sm font-semibold text-slate-700 hover:text-cyan-600 px-3 py-2 rounded-xl hover:bg-cyan-50/60 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/get-a-quote"
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-2.5 px-5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-slate-900 p-2 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden fixed right-4 left-auto w-[calc(100vw-2rem)] max-w-[320px] top-[74px] bg-white/95 border border-slate-200/90 shadow-2xl backdrop-blur-2xl rounded-2xl z-50 p-5 flex flex-col justify-between animate-in fade-in duration-200 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-3">
              Navigation
            </p>
            {navLinks.map((link) => (
              <a
                key={link.sectionId}
                href={`#${link.sectionId}`}
                onClick={(e) => handleNavClick(link.sectionId, e)}
                className="block text-sm font-semibold text-slate-800 hover:text-cyan-600 px-3 py-3 rounded-xl hover:bg-cyan-50/60 transition-colors min-h-[44px] flex items-center"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/get-a-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
