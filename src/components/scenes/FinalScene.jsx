import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function useStarFinale(trigger) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // "MEGHA ❤️" particle text
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.min(window.innerWidth / 6, 90)}px Playfair Display, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MEGHA ❤️', canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const targetPixels = [];
    for (let x = 0; x < canvas.width; x += 5) {
      for (let y = 0; y < canvas.height; y += 5) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          targetPixels.push({ x, y });
        }
      }
    }

    const stars = targetPixels.map(p => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: p.x, ty: p.y,
      r: Math.random() * 2 + 1,
      color: ['#ff6b9d', '#f39c12', '#fff', '#9b59b6', '#ffb3d1'][Math.floor(Math.random() * 5)],
      vx: 0, vy: 0,
    }));

    let frame = 0;
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let done = 0;
      stars.forEach(s => {
        const dx = s.tx - s.x;
        const dy = s.ty - s.y;
        s.x += dx * 0.04;
        s.y += dy * 0.04;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) done++;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      frame++;
      if (frame < 180) {
        animId = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [trigger]);

  return canvasRef;
}

export default function FinalScene() {
  const [phase, setPhase] = useState('stars'); // stars | text | love | complete
  const canvasRef = useStarFinale(phase === 'stars');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 2000);
    const t2 = setTimeout(() => {
      setPhase('love');
      // Fireworks
      const duration = 5000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60, spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#ff6b9d', '#f39c12', '#9b59b6', '#fff'],
        });
        confetti({
          particleCount: 4,
          angle: 120, spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#ff6b9d', '#f39c12', '#9b59b6', '#fff'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 4500);
    const t3 = setTimeout(() => setPhase('complete'), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="scene" style={{ zIndex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* Star particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,157,0.12) 0%, transparent 70%)',
      }} />

      <AnimatePresence>
        {phase === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}
          >
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 900,
              lineHeight: 1.1, marginBottom: '8px',
              filter: 'drop-shadow(0 0 30px rgba(255,107,157,0.5))',
              color: '#fff',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ff6b9d, #f39c12, #9b59b6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                MEGHA
              </span>{' '}
              <span style={{ display: 'inline-block' }}>❤️</span>
            </h1>
          </motion.div>
        )}

        {(phase === 'love' || phase === 'complete') && (
          <motion.div
            key="love"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', zIndex: 3, position: 'relative',
              padding: '20px', maxWidth: '650px', width: '100%',
            }}
          >
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.1, marginBottom: '12px',
                color: '#fff',
              }}
            >
              <span style={{
                background: 'linear-gradient(135deg, #ff6b9d, #f39c12, #9b59b6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                MEGHA
              </span>{' '}
              <span style={{ display: 'inline-block' }}>❤️</span>
            </motion.h1>

            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)',
                color: '#fff',
                marginBottom: '20px',
                textShadow: '0 0 20px rgba(255,107,157,0.5)',
              }}
            >
              HAPPY 20TH BIRTHDAY 🎂
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                marginBottom: '12px', lineHeight: 1.7,
                fontFamily: 'Dancing Script, cursive',
              }}
            >
              "You are loved more than you know."
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p style={{
                fontFamily: 'Dancing Script, cursive',
                fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
                color: '#ff6b9d',
                marginBottom: '30px',
              }}>
                With Love,<br />
                <span style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    Shamik
                  </span>{' '}
                  <span style={{ display: 'inline-block' }}>❤️</span>
                </span>
              </p>
            </motion.div>

            {/* Floating hearts finale */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: `${1.2 + Math.random() * 1.5}rem`,
                  left: `${5 + i * 12}%`,
                  bottom: '10%',
                }}
                animate={{
                  y: [0, -300 - Math.random() * 200],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut',
                }}
              >
                {['💕', '💖', '💗', '❤️', '🌸', '✨', '💫', '🌟'][i]}
              </motion.div>
            ))}

            {/* Replay / Restart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <button
                className="btn-glow"
                onClick={() => window.location.reload()}
                style={{ fontSize: '0.95rem', padding: '12px 36px' }}
              >
                🔄 Relive the Magic
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle decorations */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${0.8 + Math.random()}rem`,
            pointerEvents: 'none', zIndex: 2,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
