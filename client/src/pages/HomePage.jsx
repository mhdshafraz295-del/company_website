import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import ProcessSection from '../sections/ProcessSection';
import TechnologiesSection from '../sections/TechnologiesSection';
import PortfolioSection from '../sections/PortfolioSection';
import CaseStudiesSection from '../sections/CaseStudiesSection';
import FounderSection from '../sections/FounderSection';
import TeamSection from '../sections/TeamSection';
import WhyChooseUsSection from '../sections/WhyChooseUsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FAQSection from '../sections/FAQSection';
import ContactCTASection from '../sections/ContactCTASection';

export default function HomePage() {
  const location = useLocation();

  // Scroll to section if passed via location state from detail page
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="space-y-0">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <TechnologiesSection />
      <PortfolioSection />
      <CaseStudiesSection />
      <FounderSection />
      <TeamSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactCTASection />
    </div>
  );
}
