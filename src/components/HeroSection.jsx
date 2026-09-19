import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection({ children, onAdminTrigger }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const charsSoft = containerRef.current?.querySelectorAll('.landing-h2-1 .char');
      const charsDev = containerRef.current?.querySelectorAll('.landing-h2-info .char');

      if (!charsSoft?.length || !charsDev?.length) return;

      gsap.set([charsSoft, charsDev], { yPercent: 0, opacity: 1 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      tl.to([charsSoft, charsDev], {
        yPercent: -120,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.in',
        stagger: 0.025,
        delay: 3.5,
      })
      .set([charsSoft, charsDev], { yPercent: 120, opacity: 0 })
      .to([charsSoft, charsDev], {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.025,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderChars = (text) =>
    text.split('').map((c, i) => (
      <span key={i} className="char">
        {c === ' ' ? '\u00A0' : c}
      </span>
    ));

  return (
    <section className="landing-section" id="landingDiv" ref={containerRef}>
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            SHAIK
            <br />
            <span>ALTHAF</span>
          </h1>
        </div>

        <div className="landing-info" onDoubleClick={onAdminTrigger} title="Double click for Admin">
          <h3>Aspiring & Passionate</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1 split-h2">{renderChars('SOFTWARE')}</div>
          </h2>
          <h2 className="landing-info-h2-sub">
            <div className="landing-h2-info split-h2">{renderChars('DEVELOPER')}</div>
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

