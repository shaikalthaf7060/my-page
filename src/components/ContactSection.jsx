import React, { useState, useEffect } from 'react';

export default function ContactSection({ onAdminTrigger }) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    try {
      const STORAGE_KEY = 'althaf_portfolio_views_v2';
      localStorage.removeItem('althaf_portfolio_live_views_count');

      let currentViews = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      if (isNaN(currentViews) || currentViews < 0) {
        currentViews = 0;
      }
      currentViews += 1;
      localStorage.setItem(STORAGE_KEY, currentViews.toString());
      setViews(currentViews);

      fetch('https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Falthaf.c0m.in%2Fprofile_v2&countColor=%23263759')
        .then((res) => res.text())
        .then((svgText) => {
          const matches = svgText.match(/>(\d+)</g);
          if (matches && matches.length > 0) {
            const lastMatch = matches[matches.length - 1].replace(/[><]/g, '');
            const badgeCount = parseInt(lastMatch, 10);
            if (!isNaN(badgeCount) && badgeCount > 0) {
              if (badgeCount >= currentViews) {
                setViews(badgeCount);
                localStorage.setItem(STORAGE_KEY, badgeCount.toString());
              }
            }
          }
        })
        .catch(() => {
        });
    } catch (e) {
      console.warn('Visitor counter sync', e);
    }
  }, []);

  return (
    <section className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a href="mailto:shaikalthaf7060@gmail.com" data-cursor="disable">
                shaikalthaf7060@gmail.com
              </a>
            </p>
            <p style={{ color: '#8892a4', fontSize: '0.9rem' }}>Nandyal, Andhra Pradesh, India</p>

            <h4 style={{ marginTop: '20px' }}>Education</h4>
            <p>B.Tech Computer Science & Engineering (2024–2027)</p>
            <p style={{ color: '#8892a4', fontSize: '0.85rem' }}>Santhiram Engineering College</p>
          </div>

          <div className="contact-box">
            <h4>Professional & Social</h4>
            <a href="https://www.linkedin.com/in/shaik-althaf-5396123a6/" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              LinkedIn <span>↗</span>
            </a>
            <a href="https://github.com/shaikalthaf7060" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              GitHub <span>↗</span>
            </a>
            <a href="https://t.me/ShaikAlthu" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Telegram <span>↗</span>
            </a>
            <a href="https://www.instagram.com/_althuuz_" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Instagram <span>↗</span>
            </a>
          </div>

          <div className="contact-box" onDoubleClick={onAdminTrigger} title="Double click for Admin Access">
            <h2>
              Designed and Developed <br />
              by <span>Shaik Althaf</span>
            </h2>
            <div className="visitor-counter-box" title="Live Profile Views">
              <div className="visitor-pulse-wrap">
                <span className="visitor-pulse-dot" />
                <span className="visitor-pulse-ring" />
              </div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="visitor-eye-icon">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <div className="visitor-data">
                <span className="visitor-label">PROFILE VIEWS</span>
                <span className="visitor-number">{views.toLocaleString()}</span>
              </div>
            </div>
            <h5>© 2026 All Rights Reserved</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
