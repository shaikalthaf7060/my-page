import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or small screens
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 800;
    if (isTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = -200, targetY = -200;
    let currX = -200, currY = -200;
    let isVisible = false;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      cursor.style.opacity = '1';
    };

    let animId;
    const loop = () => {
      currX += (targetX - currX) * 0.22;
      currY += (targetY - currY) * 0.22;
      if (cursor) {
        cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animId = requestAnimationFrame(loop);

    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor], .what-content, .tech-card, .work-image-in, .resume-button, .dock-action-btn');
      if (el) {
        if (el.dataset.cursor === 'disable') {
          cursor.classList.add('cursor-disable');
        } else {
          cursor.style.setProperty('--size', '56px');
          cursor.classList.add('cursor-hover');
        }
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove('cursor-disable');
      cursor.classList.remove('cursor-hover');
      cursor.style.setProperty('--size', '34px');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-main">
      <div className="cursor-dot" />
    </div>
  );
}
