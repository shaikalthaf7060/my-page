import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Navbar from './components/Navbar.jsx';
import SideIcons from './components/SideIcons.jsx';
import HeroSection from './components/HeroSection.jsx';
import Character3D from './components/Character3D.jsx';
import AboutSection from './components/AboutSection.jsx';
import WhatIDoSection from './components/WhatIDoSection.jsx';
import WorkCarousel from './components/WorkCarousel.jsx';
import TechStack3D from './components/TechStack3D.jsx';
import CareerSection from './components/CareerSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import { AdminAuthModal, AdminPanelModal } from './components/AdminModals.jsx';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      const blockScroll = (e) => {
        e.preventDefault();
      };

      const blockKeys = (e) => {
        if (['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code)) {
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', blockScroll, { passive: false });
      window.addEventListener('touchmove', blockScroll, { passive: false });
      window.addEventListener('keydown', blockKeys, { passive: false });

      return () => {
        window.removeEventListener('wheel', blockScroll);
        window.removeEventListener('touchmove', blockScroll);
        window.removeEventListener('keydown', blockKeys);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      ScrollTrigger.refresh(true);
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className="main-body" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <CustomCursor />
        <Navbar />
        <SideIcons />
        
        <div className="landing-circle1"></div>
        <div className="landing-circle2"></div>

        {isDesktop && <Character3D />}

        <main className="container-main">
          <HeroSection onAdminTrigger={() => setAuthOpen(true)}>
            {!isDesktop && <Character3D />}
          </HeroSection>

          <AboutSection />
          <WhatIDoSection />
          <CareerSection />
          <WorkCarousel />
          {isDesktop && <TechStack3D />}
          <ContactSection onAdminTrigger={() => setAuthOpen(true)} />
        </main>

        {authOpen && (
          <AdminAuthModal 
            onClose={() => setAuthOpen(false)} 
            onSuccess={() => { setAuthOpen(false); setAdminOpen(true); }} 
          />
        )}
        {adminOpen && <AdminPanelModal onClose={() => setAdminOpen(false)} />}
      </div>
    </>
  );
}
