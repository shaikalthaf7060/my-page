import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection({ children, onAdminTrigger }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars1 = containerRef.current?.querySelectorAll('.landing-h2-1 .char');
      const chars2 = containerRef.current?.querySelectorAll('.landing-h2-2 .char');
      const charsInfo = containerRef.current?.querySelectorAll('.landing-h2-info .char');
      const charsInfo1 = containerRef.current?.querySelectorAll('.landing-h2-info-1 .char');

      if (!chars1?.length || !chars2?.length || !charsInfo?.length || !charsInfo1?.length) return;

      gsap.set(chars2, { opacity: 0, y: 80 });
      gsap.set(charsInfo1, { opacity: 0, y: 80 });
      gsap.set(chars1, { opacity: 1, y: 0 });
      gsap.set(charsInfo, { opacity: 1, y: 0 });

      const delay = 3.5;
      const delay2 = delay * 2 + 1;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.fromTo(
        chars2,
        { opacity: 0, y: 80 },
        { opacity: 1, duration: 1.1, ease: 'power3.inOut', y: 0, stagger: 0.05, delay: delay },
        0
      )
      .fromTo(
        chars1,
        { y: 0 },
        { opacity: 0, y: -80, duration: 1.1, ease: 'power3.inOut', stagger: 0.05, delay: delay },
        0
      )
      .fromTo(
        chars1,
        { opacity: 0, y: 80 },
        { opacity: 1, duration: 1.1, ease: 'power3.inOut', y: 0, stagger: 0.05, delay: delay2 },
        1
      )
      .to(
        chars2,
        { opacity: 0, y: -80, duration: 1.1, ease: 'power3.inOut', stagger: 0.05, delay: delay2 },
        1
      );

      const tl2 = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl2.fromTo(
        charsInfo1,
        { opacity: 0, y: 80 },
        { opacity: 1, duration: 1.1, ease: 'power3.inOut', y: 0, stagger: 0.05, delay: delay },
        0
      )
      .fromTo(
        charsInfo,
        { y: 0 },
        { opacity: 0, y: -80, duration: 1.1, ease: 'power3.inOut', stagger: 0.05, delay: delay },
        0
      )
      .fromTo(
        charsInfo,
        { opacity: 0, y: 80 },
        { opacity: 1, duration: 1.1, ease: 'power3.inOut', y: 0, stagger: 0.05, delay: delay2 },
        1
      )
      .to(
        charsInfo1,
        { opacity: 0, y: -80, duration: 1.1, ease: 'power3.inOut', stagger: 0.05, delay: delay2 },
        1
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderChars = (text) =>
    text.split('').map((c, i) => (
      <span key={i} className="char" style={{ display: 'inline-block' }}>
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
            <div className="landing-h2-1 split-h2">{renderChars('Software')}</div>
            <div className="landing-h2-2 split-h2">{renderChars('Full Stack')}</div>
          </h2>
          <h2>
            <div className="landing-h2-info split-h2">{renderChars('Developer')}</div>
            <div className="landing-h2-info-1 split-h2">{renderChars('Engineer')}</div>
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}
