import React, { useState, useEffect } from 'react';

export default function HeroSection({ children, onAdminTrigger }) {
  const titles = [
    'SOFTWARE DEVELOPER',
    'FULL STACK DEVELOPER',
    'AI APPS BUILDER',
    'PROBLEM SOLVER (DSA)'
  ];
  const [currTitle, setCurrTitle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrTitle((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="landing-section" id="landingDiv">
      <div className="landing-container">
        {/* Left Side: Name */}
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            SHAIK
            <br />
            <span>ALTHAF</span>
          </h1>
        </div>

        {/* Right Side: Role */}
        <div className="landing-info" onDoubleClick={onAdminTrigger} title="Double click for Admin">
          <h3>Aspiring & Passionate</h3>
          <h2>
            SOFTWARE <br />
            <span className="role-accent">DEVELOPER</span>
          </h2>
        </div>
      </div>

      {/* 3D Center Standalone Person */}
      {children}
    </section>
  );
}
