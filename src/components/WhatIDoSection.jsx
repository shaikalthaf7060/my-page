import React, { useState } from 'react';

export default function WhatIDoSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const cards = [
    {
      title: 'FULL STACK DEV',
      subtitle: 'Modern Web Architectures',
      desc: 'Building responsive, scalable full-stack web applications with blazing-fast render performance, clean component architecture, and secure API integrations.',
      tags: ['React', 'Next.js', 'JavaScript', 'Node.js', 'Tailwind CSS', 'REST APIs']
    },
    {
      title: 'UI/UX & 3D INTERACTION',
      subtitle: 'Creative Experience Design',
      desc: 'Crafting fluid micro-interactions, responsive modern layouts, WebGL/Three.js 3D elements, and intuitive interfaces that elevate digital brands.',
      tags: ['Figma', 'GSAP', 'Three.js', 'Framer', 'Modern CSS', 'Animations']
    },
    {
      title: 'CLOUD & AUTOMATION',
      subtitle: 'Workflows & Security',
      desc: 'Architecting dynamic 2FA authentication, automated cloud-synced databases, real-time analytics, and smooth continuous deployment pipelines.',
      tags: ['Git', 'Vercel', 'SheetDB', 'TOTP 2FA', 'Supabase', 'Cloudflare']
    }
  ];

  return (
    <section className="whatIDO" id="what-i-do">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>I<span className="do-h2"> DO</span></div>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`what-content ${activeIdx === idx ? 'what-content-active' : 'what-noTouch'}`}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>{card.title}</h3>
                <h4>{card.subtitle}</h4>
                <p>{card.desc}</p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  {card.tags.map((tag, tIdx) => (
                    <div key={tIdx} className="what-tags">{tag}</div>
                  ))}
                </div>
              </div>
              <div className="what-arrow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
