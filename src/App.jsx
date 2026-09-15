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
import MusicPlayer from './components/MusicPlayer.jsx';
import MiniGameModal from './components/MiniGameModal.jsx';
import { AdminAuthModal, AdminPanelModal } from './components/AdminModals.jsx';
import ContactModal from './components/ContactModal.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [gameOpen, setGameOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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
        <Navbar onOpenContact={() => setContactOpen(true)} />
        <SideIcons />
        
        {/* Ambient Glow Lights */}
        <div className="landing-circle1"></div>
        <div className="landing-circle2"></div>

        {/* 3D Character Model (Fixed for desktop, inline for mobile) */}
        {isDesktop && <Character3D />}

        <main className="container-main">
          <HeroSection onAdminTrigger={() => setAuthOpen(true)}>
            {!isDesktop && <Character3D />}
          </HeroSection>

          <AboutSection />
          <WhatIDoSection />
          <WorkCarousel />
          <TechStack3D />
          <CareerSection />
          <ContactSection onAdminTrigger={() => setAuthOpen(true)} />
        </main>

        {/* Music Dock */}
        <MusicPlayer />

        {/* Floating Quick Action Group */}
        <div className="floating-action-group">
          <button 
            className="floating-btn" 
            onClick={() => setGameOpen(true)} 
            title="Play Mini-Game"
            data-cursor="disable"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </button>
          <button 
            className="floating-btn" 
            onClick={() => setContactOpen(true)} 
            title="Contact Request"
            data-cursor="disable"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </button>
        </div>

        {/* Modals */}
        {gameOpen && <MiniGameModal onClose={() => setGameOpen(false)} />}
        {authOpen && (
          <AdminAuthModal 
            onClose={() => setAuthOpen(false)} 
            onSuccess={() => { setAuthOpen(false); setAdminOpen(true); }} 
          />
        )}
        {adminOpen && <AdminPanelModal onClose={() => setAdminOpen(false)} />}
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </div>
    </>
  );
}
