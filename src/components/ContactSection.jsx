import React, { useState, useEffect } from 'react';

export default function ContactSection({ onAdminTrigger }) {
  const [views, setViews] = useState(1482);

  useEffect(() => {
    try {
      const STORAGE_KEY = 'althaf_portfolio_views_count';
      const SESSION_KEY = 'althaf_portfolio_view_session';
      const BASELINE = 1482;

      let currentViews = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      if (isNaN(currentViews) || currentViews < BASELINE) {
        currentViews = BASELINE;
      }

      // Increment view count on each visit session
      const sessionLogged = sessionStorage.getItem(SESSION_KEY);
      if (!sessionLogged) {
        currentViews += 1;
        localStorage.setItem(STORAGE_KEY, currentViews.toString());
        sessionStorage.setItem(SESSION_KEY, 'true');
      }

      setViews(currentViews);

      // Attempt live public API counter sync if online
      fetch('https://api.counterapi.dev/v1/shaikalthaf-portfolio/visits/up')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.count === 'number' && data.count > currentViews) {
            setViews(data.count);
            localStorage.setItem(STORAGE_KEY, data.count.toString());
          }
        })
        .catch(() => {
          // Gracefully fallback to localStorage counter
        });
    } catch (e) {
      console.warn('Counter sync fallback', e);
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
              <span className="visitor-pulse-dot" />
              <span className="visitor-label">Profile Views:</span>
              <span className="visitor-number">{views.toLocaleString()}</span>
            </div>
            <h5>© 2026 All Rights Reserved</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
