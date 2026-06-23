import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeScene({ onNext }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(h => [
        ...h.slice(-15),
        {
          id: Date.now(),
          x: 10 + Math.random() * 80,
          size: 0.8 + Math.random() * 1.5,
          duration: 4 + Math.random() * 3,
          emoji: ['💕', '💖', '💗', '🌸', '✨'][Math.floor(Math.random() * 5)],
        },
      ]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scene" style={{ zIndex: 1, overflow: 'hidden' }}>
      {/* Floating hearts background */}
      {hearts.map(h => (
        <motion.div
          key={h.id}
          initial={{ bottom: '-5%', left: `${h.x}%`, opacity: 0, scale: 0 }}
          animate={{ bottom: '105%', opacity: [0, 0.8, 0.8, 0], scale: h.size }}
          transition={{ duration: h.duration, ease: 'easeOut' }}
          onAnimationComplete={() => setHearts(prev => prev.filter(x => x.id !== h.id))}
          style={{
            position: 'absolute', fontSize: '1.5rem',
            pointerEvents: 'none', zIndex: 0,
          }}
        >
          {h.emoji}
        </motion.div>
      ))}

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%)',
        top: '10%', left: '-10%', borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(155,89,182,0.12) 0%, transparent 70%)',
        bottom: '10%', right: '-5%', borderRadius: '50%', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', zIndex: 2, padding: '20px', maxWidth: '750px' }}
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{
            display: 'inline-block',
            background: 'rgba(255,107,157,0.15)',
            border: '1px solid rgba(255,107,157,0.4)',
            borderRadius: '50px', padding: '6px 20px',
            color: '#ff6b9d', fontSize: '0.85rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '20px', fontWeight: 600,
          }}
        >
          ✨ A Special Experience ✨
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15, marginBottom: '16px',
            color: '#fff',
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #f39c12, #9b59b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Happy 20th Birthday<br />Megha
          </span>{' '}
          <span style={{ display: 'inline-block' }}>❤️</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '520px', margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          This isn't just a birthday website. It's a little journey made especially for you. 🌸
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6, type: 'spring' }}
        >
          <button
            className="btn-glow animate-pulse-glow"
            onClick={onNext}
            style={{ fontSize: '1.1rem', padding: '18px 55px' }}
          >
            🎁 Start Your Surprise
          </button>
        </motion.div>

        {/* Decorative stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${1 + i * 0.3}rem`,
              left: `${5 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              opacity: 0.5,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
