import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 800) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = 0, targetY = 0;
    let currX = 0, currY = 0;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    let animId;
    const loop = () => {
      currX += (targetX - currX) * 0.18;
      currY += (targetY - currY) * 0.18;
      if (cursor) {
        cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(loop);

    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor], .what-content, .tech-card, .work-image-in');
      if (el) {
        if (el.dataset.cursor === 'disable') {
          cursor.classList.add('cursor-disable');
        } else {
          cursor.style.setProperty('--size', '70px');
        }
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove('cursor-disable');
      cursor.style.setProperty('--size', '50px');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return <div ref={cursorRef} className="cursor-main" />;
}
