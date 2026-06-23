import React, { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1,
      color: ['#ff6b9d', '#9b59b6', '#f39c12', '#ffb3d1'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      // Draw stars
      stars.forEach(s => {
        const a = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed * 100 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.fill();
      });

      // Draw floating particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `,${p.alpha})`).replace('rgb', 'rgba');
        const alpha = 0.2 + 0.3 * Math.abs(Math.sin(t * 0.5 + p.x));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
