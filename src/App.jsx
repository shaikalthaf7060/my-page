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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className="main-body" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <CustomCursor />
        <Navbar />
        <SideIcons />
        
        {/* Ambient Glow Lights */}
        <div className="landing-circle1"></div>
        <div className="landing-circle2"></div>

        {/* 3D Character Model (Fixed full-screen canvas) */}
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

        {/* Admin Modals */}
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
