import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ProgramGlanceSection from '../components/ProgramGlanceSection';
import RegisterSection from '../components/RegisterSection';
import ContactSection from '../components/ContactSection';
import FAQSection from '../components/FAQSection';
import { PremiumTestimonials } from '../components/ui/premium-testimonials';
import { UpgradeBanner } from '../components/ui/upgrade-banner';

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);

  const handleRegisterClick = () => {
    window.open('https://app.smartsheet.com/b/form/8316a4445300487cbf556d013b0e6fc1', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {showBanner && (
        <div className="bg-[#F0F7FF] border-b border-[#CBE7FF] py-2">
          <UpgradeBanner
            buttonText="Register Now"
            description="to join the next cohort"
            onClose={() => setShowBanner(false)}
            onClick={handleRegisterClick}
          />
        </div>
      )}
      
      <section id="hero">
        <HeroSection />
      </section>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8"></div>
      
      <section id="program-glance" className="bg-white/20 backdrop-blur-sm rounded-lg m-4 p-6 border border-white/30 shadow-sm">
        <ProgramGlanceSection />
      </section>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8"></div>
      
      <section id="register" className="bg-white/20 backdrop-blur-sm rounded-lg m-4 p-6 border border-white/30 shadow-sm">
        <RegisterSection />
      </section>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8"></div>
      
      {/* Combined Testimonials and Company Logos Section */}
      <PremiumTestimonials />
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8"></div>
      
      <section id="contact" className="bg-white/20 backdrop-blur-sm rounded-lg m-4 p-6 border border-white/30 shadow-sm">
        <ContactSection />
      </section>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-8"></div>
      
      <FAQSection />
    </>
  );
}