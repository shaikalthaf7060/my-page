import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 800;
    if (isTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouse = { x: -200, y: -200 };
    let pos = { x: -200, y: -200 };
    let locked = false;
    let hasMoved = false;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = '1';
      }
    };

    let animId;
    const loop = () => {
      if (!locked) {
        pos.x += (mouse.x - pos.x) / 6;
        pos.y += (mouse.y - pos.y) / 6;
        gsap.to(cursor, { x: pos.x, y: pos.y, duration: 0.1 });
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(loop);

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (hasMoved) cursor.style.opacity = '1';
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) {
        cursor.classList.remove('cursor-disable', 'cursor-icons');
        locked = false;
        return;
      }
      if (target.dataset.cursor === 'disable') {
        cursor.classList.add('cursor-disable');
      } else if (target.dataset.cursor === 'icons') {
        const rect = target.getBoundingClientRect();
        cursor.classList.add('cursor-icons');
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty('--cursorH', `${rect.height}px`);
        locked = true;
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target && !e.relatedTarget?.closest('[data-cursor]')) {
        cursor.classList.remove('cursor-disable', 'cursor-icons');
        locked = false;
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={cursorRef} className="cursor-main" style={{ opacity: 0 }} />;
}
