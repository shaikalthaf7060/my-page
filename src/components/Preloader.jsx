import React, { useState, useEffect, useRef } from 'react';

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    let curr = 0;
    const interval = setInterval(() => {
      curr += Math.floor(Math.random() * 8) + 2;
      if (curr >= 100) {
        curr = 100;
        setPercent(100);
        setIsReady(true);
        clearInterval(interval);
      } else {
        setPercent(curr);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wrapRef.current.style.setProperty('--mouse-x', `${x}px`);
    wrapRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleClick = () => {
    if (!isReady || isClicked) return;
    setIsClicked(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div className="loading-screen">
      <div className="loading-header">
        <a href="#" className="loader-title" data-cursor="disable">SA — ALTHAF</a>
        <div className="loaderGame">
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, i) => (
                <div key={i} className="loaderGame-line" />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      <div className="loading-marquee">
        <div className="loading-marquee-in">
          <span>FULL STACK DEVELOPER</span>
          <span>AI APPS BUILDER</span>
          <span>SOFTWARE ENGINEER</span>
          <span>WEB DEVELOPER</span>
          <span>FULL STACK DEVELOPER</span>
          <span>AI APPS BUILDER</span>
          <span>SOFTWARE ENGINEER</span>
          <span>WEB DEVELOPER</span>
        </div>
      </div>

      <div 
        ref={wrapRef}
        className={`loading-wrap ${isClicked ? 'loading-clicked' : ''}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div className="loading-hover" />
        <div className={`loading-button ${isReady ? 'loading-complete' : ''}`}>
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-content-in">
                Loading <span>{percent}%</span>
              </div>
            </div>
            <div className="loading-box" />
          </div>
          <div className="loading-content2">
            <span>ENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
