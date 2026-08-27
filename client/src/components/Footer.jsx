import React from 'react';
import { Link } from 'react-router-dom';
import usePublicData from '../hooks/usePublicData';
import Reveal3D from './motion/Reveal3D';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from 'lucide-react';

const socialIconMap = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
};

export default function Footer() {
  const { settings, socialLinks, services } = usePublicData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/80 text-slate-600 text-xs sm:text-sm relative z-10 select-none">
      <Reveal3D yOffset={15} rotateXOffset={0} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-cyan-50/80 border border-cyan-100 p-2 rounded-xl">
                <img
                  src="/images/nexgen-logo.png"
                  alt="NexGen Solutions"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  {settings?.companyName || 'NexGen Solutions'}
                </h3>
                <p className="text-[10px] text-cyan-600 uppercase tracking-wider font-semibold">
                  {settings?.tagline || 'Software & Web Agency'}
                </p>
              </div>
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              {settings?.companyDescription ||
                'NexGen Solutions is a modern technology company crafting high-performance web applications, custom software systems, and mobile solutions.'}
            </p>

            {/* Configured Social Media Icons */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center space-x-3 pt-2">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.platform] || Globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.platform}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Quick Links
            </p>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#about" className="hover:text-cyan-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-600 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-600 transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-cyan-600 transition-colors">
                  Development Process
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-cyan-600 transition-colors">
                  Meet the Team
                </a>
              </li>
              <li>
                <Link to="/get-a-quote" className="text-cyan-600 hover:underline">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Services */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Services
            </p>
            <ul className="space-y-2 text-xs font-medium">
              {services && services.length > 0 ? (
                services.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <a
                      href="#services"
                      className="hover:text-cyan-600 transition-colors truncate block max-w-[180px]"
                    >
                      {service.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>Web Development</li>
                  <li>Mobile App Development</li>
                  <li>Custom Software</li>
                  <li>UI/UX Design</li>
                  <li>Cloud Solutions</li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Get in Touch
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {settings?.email && (
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-600 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-cyan-600 transition-colors truncate">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.whatsapp && (
                <li className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {!settings?.email && (
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>info@nexgen.local</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {currentYear} NexGen Solutions. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </Reveal3D>
    </footer>
  );
}
