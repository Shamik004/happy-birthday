import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function GiftBoxScene({ onNext }) {
  const [state, setState] = useState('idle'); // idle | shaking | open

  const handleClick = () => {
    if (state === 'open') return;
    setState('shaking');
    setTimeout(() => {
      setState('open');
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#ff6b9d', '#9b59b6', '#f39c12', '#ffb3d1', '#fff'],
      });
      setTimeout(() => {
        confetti({ angle: 60, spread: 80, particleCount: 100, origin: { x: 0 }, colors: ['#ff6b9d', '#f39c12'] });
        confetti({ angle: 120, spread: 80, particleCount: 100, origin: { x: 1 }, colors: ['#9b59b6', '#ffb3d1'] });
      }, 300);
    }, 700);
  };

  return (
    <div className="scene" style={{ zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 2, padding: '20px' }}
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontSize: '1.1rem' }}
        >
          A special surprise is waiting inside...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '40px',
            color: '#fff',
          }}
        >
          <span style={{ marginRight: '10px' }}>🎁</span>
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Click to Open Your Gift
          </span>
        </motion.h2>

        {/* Gift Box */}
        <motion.div
          onClick={handleClick}
          animate={state === 'shaking' ? {
            x: [-5, 5, -5, 5, -3, 3, 0],
            rotate: [-3, 3, -3, 3, -2, 2, 0],
          } : {}}
          transition={{ duration: 0.6 }}
          style={{ cursor: state === 'open' ? 'default' : 'pointer', display: 'inline-block' }}
        >
          <div style={{ position: 'relative', width: 200, height: 220, margin: '0 auto' }}>
            {/* Box lid */}
            <motion.div
              animate={state === 'open' ? { y: -80, opacity: 0, rotateX: 60 } : {}}
              transition={{ duration: 0.5, ease: 'backOut' }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 55, zIndex: 3,
              }}
            >
              {/* Lid body */}
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #e91e8c, #9c27b0)',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 4px 20px rgba(233,30,140,0.4)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Lid shine */}
                <div style={{
                  position: 'absolute', top: 0, left: '-20%',
                  width: '50%', height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'skewX(-20deg)',
                }} />
                {/* Ribbon center */}
                <div style={{
                  position: 'absolute', left: '50%', top: 0, bottom: 0,
                  width: 22, transform: 'translateX(-50%)',
                  background: '#f39c12',
                }} />
              </div>
              {/* Bow */}
              <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }}>
                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 8px rgba(243,156,18,0.8))' }}>🎀</span>
              </div>
            </motion.div>

            {/* Box body */}
            <div style={{
              position: 'absolute', top: 55, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(135deg, #c2185b, #7b1fa2)',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 8px 30px rgba(194,24,91,0.4)',
              overflow: 'hidden',
            }}>
              {/* Shine */}
              <div style={{
                position: 'absolute', top: 0, left: '-20%',
                width: '40%', height: '100%',
                background: 'rgba(255,255,255,0.08)',
                transform: 'skewX(-20deg)',
              }} />
              {/* Ribbon vertical */}
              <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0,
                width: 22, transform: 'translateX(-50%)',
                background: '#f39c12', opacity: 0.9,
              }} />
              {/* Ribbon horizontal */}
              <div style={{
                position: 'absolute', top: '40%', left: 0, right: 0,
                height: 22, background: '#f39c12', opacity: 0.9,
              }} />
              {/* Polka dots */}
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  left: `${15 + (i % 2) * 55}%`,
                  top: `${20 + Math.floor(i / 2) * 35}%`,
                }} />
              ))}
            </div>

            {/* Open state: stars burst */}
            <AnimatePresence>
              {state === 'open' && (
                <>
                  {['✨', '🌟', '💖', '🎉', '💕', '⭐'].map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 100, y: 55 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.5, 1.2, 0],
                        x: 100 + (Math.cos(i * 60 * Math.PI / 180) * 120),
                        y: 55 + (Math.sin(i * 60 * Math.PI / 180) * 100),
                      }}
                      transition={{ duration: 1.2, delay: i * 0.05 }}
                      style={{
                        position: 'absolute', fontSize: '1.8rem',
                        pointerEvents: 'none', zIndex: 10,
                      }}
                    >
                      {e}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Glow pulse */}
          {state === 'idle' && (
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 220, height: 220, borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(233,30,140,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </motion.div>

        {/* After open */}
        <AnimatePresence>
          {state === 'open' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ marginTop: '30px' }}
            >
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '24px',
              }}>
                🎊 The celebration begins! 🎊
              </p>
              <button className="btn-glow" onClick={onNext}>
                Continue the Journey ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {state !== 'open' && (
          <motion.p
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginTop: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}
          >
            👆 Click the gift box!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
