import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection({ children, onAdminTrigger }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const charsSoft = containerRef.current?.querySelectorAll('.landing-h2-1 .char');
      const charsFull = containerRef.current?.querySelectorAll('.landing-h2-2 .char');
      const charsDev = containerRef.current?.querySelectorAll('.landing-h2-info .char');
      const charsEng = containerRef.current?.querySelectorAll('.landing-h2-info-1 .char');

      if (!charsSoft?.length || !charsFull?.length || !charsDev?.length || !charsEng?.length) return;

      gsap.set([charsSoft, charsDev], { yPercent: 0, opacity: 1 });
      gsap.set([charsFull, charsEng], { yPercent: 120, opacity: 0 });

      const tl = gsap.timeline({ repeat: -1 });

      tl.to([charsSoft, charsDev], {
        yPercent: -120,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.03,
        delay: 3.5,
      })
      .fromTo(
        [charsFull, charsEng],
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          stagger: 0.03,
        },
        '<0.1'
      )
      .to([charsFull, charsEng], {
        yPercent: -120,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.03,
        delay: 3.5,
      })
      .fromTo(
        [charsSoft, charsDev],
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          stagger: 0.03,
        },
        '<0.1'
      );
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
            <div className="landing-h2-2 split-h2">{renderChars('FULL STACK')}</div>
          </h2>
          <h2 className="landing-info-h2-sub">
            <div className="landing-h2-info split-h2">{renderChars('DEVELOPER')}</div>
            <div className="landing-h2-info-1 split-h2">{renderChars('ENGINEER')}</div>
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

