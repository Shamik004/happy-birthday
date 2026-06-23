import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TYPING_TEXTS = [
  'Happy Birthday Megha ❤️',
  'A special celebration has been prepared just for you...',
];

export default function IntroScene({ onNext }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [charIdx, setCharIdx] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (lineIndex >= TYPING_TEXTS.length) {
      setTimeout(() => setShowButton(true), 400);
      return;
    }
    const text = TYPING_TEXTS[lineIndex];
    if (charIdx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + text[charIdx]);
        setCharIdx(c => c + 1);
      }, charIdx === 0 ? 600 : 55);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed('');
        setCharIdx(0);
        setLineIndex(l => l + 1);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIndex]);

  return (
    <div className="scene" style={{ background: 'transparent', zIndex: 1 }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,157,0.15) 0%, rgba(155,89,182,0.1) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ textAlign: 'center', zIndex: 2, padding: '20px', maxWidth: '700px' }}
      >
        {/* Main title */}
        <div style={{ minHeight: '80px', marginBottom: '20px' }}>
          {lineIndex === 0 && (
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff6b9d, #f39c12, #9b59b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
            }}>
              {displayed}<span style={{ animation: 'blink 1s step-end infinite', WebkitTextFillColor: '#ff6b9d' }}>|</span>
            </h1>
          )}
        </div>

        {/* Sub text */}
        <div style={{ minHeight: '50px', marginBottom: '40px' }}>
          {lineIndex === 1 && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.5px',
            }}>
              {displayed}<span style={{ opacity: 0.7 }}>|</span>
            </p>
          )}
          {lineIndex >= 2 && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.5px',
            }}>
              A special celebration has been prepared just for you...
            </p>
          )}
        </div>

        {/* Begin button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <button className="btn-glow animate-pulse-glow" onClick={onNext}
              style={{ fontSize: '1.1rem', padding: '16px 50px' }}>
              ✨ Begin The Celebration
            </button>
          </motion.div>
        )}

        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${1 + Math.random()}rem`,
              opacity: 0.4,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          >
            {['💕', '✨', '🌟', '💖', '🎀', '💫'][i]}
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
