// frontend/src/components/MouseTrail.jsx

import React, { useEffect, useRef } from 'react';
import './MouseTrail.css';

const MouseTrail = () => {
  const trailRef = useRef([]);

  useEffect(() => {
    const TRAIL_COUNT = 15;
    let mouseX = 0;
    let mouseY = 0;

    // 1. Buat elemen DOM trail dots
    trailRef.current = Array.from({ length: TRAIL_COUNT }, (_, index) => {
      const el = document.createElement('div');
      el.className = 'mouse-trail-dot';

      const size = 6 + index * 0.5;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = (1 - index / TRAIL_COUNT) * 0.5;
      // Perhatikan transition delay ini yang menciptakan efek trailing
      el.style.transitionDelay = `${index * 0.02}s`;

      document.body.appendChild(el);
      return el;
    });

    // 2. Event Listener untuk menangkap mouse position
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // 3. Fungsi animasi (menggunakan requestAnimationFrame untuk performa)
    const animateTrail = () => {
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = trailRef.current[i];

        let targetX, targetY;
        if (i === 0) {
          // Dot pertama mengikuti mouse (langsung)
          targetX = mouseX;
          targetY = mouseY;
        } else {
          // Dot berikutnya mengikuti posisi dot sebelumnya (smooth)
          const prevDot = trailRef.current[i - 1];
          // Ambil posisi transform dari dot sebelumnya
          const transformMatrix = new WebKitCSSMatrix(window.getComputedStyle(prevDot).transform);
          targetX = transformMatrix.m41;
          targetY = transformMatrix.m42;
        }

        // Apply posisi (gunakan translate untuk performa yang lebih baik daripada left/top)
        dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }

      requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(animateTrail);

    // Cleanup: hapus listener dan elemen DOM saat komponen dilepas
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trailRef.current.forEach((el) => document.body.removeChild(el));
    };
  }, []);

  return null;
};

export default MouseTrail;
