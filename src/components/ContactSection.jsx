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
            <h4>Education</h4>
            <p>B.Tech Computer Science & Engineering — 2019–2023</p>
            <p>Web Development & UI/UX Certification</p>
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            <a href="https://www.instagram.com/_althuuz_" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Instagram <span>↗</span>
            </a>
            <a href="https://t.me/ShaikAlthu" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Telegram <span>↗</span>
            </a>
            <a href="https://www.threads.net/@_althuuz_" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Threads <span>↗</span>
            </a>
            <a href="https://www.facebook.com/althaf.ravan" target="_blank" rel="noreferrer" className="contact-social" data-cursor="disable">
              Facebook <span>↗</span>
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
