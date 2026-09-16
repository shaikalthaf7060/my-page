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

    const setupListeners = () => {
      document.querySelectorAll('[data-cursor]').forEach((el) => {
        el.addEventListener('mouseover', (c) => {
          const rect = c.currentTarget.getBoundingClientRect();
          if (el.dataset.cursor === 'icons') {
            cursor.classList.add('cursor-icons');
            gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
            cursor.style.setProperty('--cursorH', `${rect.height}px`);
            locked = true;
          }
          if (el.dataset.cursor === 'disable') {
            cursor.classList.add('cursor-disable');
          }
        });

        el.addEventListener('mouseout', () => {
          cursor.classList.remove('cursor-disable', 'cursor-icons');
          locked = false;
        });
      });
    };

    // Small delay to ensure all DOM elements are mounted
    const timer = setTimeout(setupListeners, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={cursorRef} className="cursor-main" style={{ opacity: 0 }} />;
}
