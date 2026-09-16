import React from 'react';

export default function ContactSection({ onAdminTrigger }) {
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
            <h5>© 2026 All Rights Reserved</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
