import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEMORIES = [
  {
    emoji: '💖',
    title: 'That Smile',
    msg: 'I don’t know how you do it, but one smile from you can fix a day that was going completely wrong. ❤️',
    color: '#ff6b9d'
  },
  {
    emoji: '🌙',
    title: 'Late Night Talks',
    msg: 'Some of my favourite moments are the random conversations that somehow turn into hours without us even noticing. ✨',
    color: '#9b59b6'
  },
  {
    emoji: '🥹',
    title: 'My Lucky Chapter',
    msg: 'Three months may not sound like much, but they’ve already given me countless reasons to smile because of you. 💕',
    color: '#f39c12'
  },
  {
    emoji: '📸',
    title: 'Every Picture',
    msg: 'Every photo here tells a story, but my favourite part of every story is always you. 📷',
    color: '#e91e8c'
  },
  {
    emoji: '🌸',
    title: 'The Way You Care',
    msg: 'You care about people in a way that’s rare. It’s one of the many things that makes you special to me. 🌷',
    color: '#ff6b9d'
  },
  {
    emoji: '🤍',
    title: 'Comfort',
    msg: 'No matter how stressful a day gets, talking to you somehow makes everything feel lighter. 🤍',
    color: '#9b59b6'
  },
  {
    emoji: '💫',
    title: 'My Favourite Notification',
    msg: 'It’s funny how a simple message from you can instantly make me smile at my phone. ✨',
    color: '#f39c12'
  },
  {
    emoji: '🎂',
    title: '20 & Amazing',
    msg: 'Twenty years of making the world brighter, and somehow I got lucky enough to be part of your story this year. 🎂❤️',
    color: '#e91e8c'
  },
];


const POSITIONS = [
  [-200, -150], [150, -180], [-280, 50], [220, 30],
  [-150, 150], [100, 160], [-50, -200], [0, 100],
];

function MemoryCard({ item, initialX, initialY, delay }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0, x: initialX, y: initialY }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 14 }}
      style={{
        position: 'absolute',
        x: initialX,
        y: initialY,
        cursor: 'grab',
        userSelect: 'none',
        zIndex: open ? 20 : 1,
        touchAction: 'none',
      }}
      whileDrag={{ cursor: 'grabbing', scale: 1.05, zIndex: 30 }}
      whileHover={!open ? { scale: 1.12 } : {}}
      onClick={(e) => {
        // Only toggle if not a drag — check if pointer moved
        if (e.defaultPrevented) return;
        setOpen(o => !o);
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          /* ── Closed bubble ── */
          <motion.div
            key="closed"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 70, height: 70,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${item.color}50, ${item.color}20)`,
              border: `2px solid ${item.color}90`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: `0 0 24px ${item.color}60, 0 0 6px ${item.color}30`,
              backdropFilter: 'blur(10px)',
              // floating bob animation
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${delay}s`,
              // emoji must NOT inherit gradient text fill
              color: 'unset',
            }}
          >
            <span style={{ WebkitTextFillColor: 'initial', color: 'initial' }}>
              {item.emoji}
            </span>
          </motion.div>
        ) : (
          /* ── Open card ── */
          <motion.div
            key="open"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{
              width: 210,
              background: 'rgba(15,5,30,0.85)',
              backdropFilter: 'blur(20px)',
              border: `1.5px solid ${item.color}60`,
              borderRadius: '16px',
              padding: '18px',
              boxShadow: `0 8px 40px ${item.color}40, 0 0 0 1px ${item.color}20`,
              pointerEvents: 'none', // card body doesn't capture drag events
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px', lineHeight: 1 }}>
              <span style={{ WebkitTextFillColor: 'initial', color: 'initial' }}>
                {item.emoji}
              </span>
            </div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1rem', fontWeight: 700,
              color: item.color, marginBottom: '8px',
            }}>
              {item.title}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0 }}>
              {item.msg}
            </p>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
              Tap to close · Drag to move
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MemoryUniverse({ onNext }) {
  return (
    <div className="scene" style={{ zIndex: 1 }}>
      {/* Background nebula glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(155,89,182,0.1) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', padding: '30px 20px 0', zIndex: 2, position: 'relative', pointerEvents: 'none' }}
        >
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            background: 'linear-gradient(135deg, #9b59b6, #ff6b9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            display: 'block',
          }}>
            {/* Emoji outside the gradient span so it renders normally */}
            <span style={{ WebkitTextFillColor: 'initial', color: '#fff' }}>🌌 </span>
            <span>Memory Universe</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Click, drag &amp; explore the floating memories ✨
          </p>
        </motion.div>

        {/* Floating memory cards — positioned from center */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 0, height: 0,
        }}>
          {MEMORIES.map((item, i) => (
            <MemoryCard
              key={i}
              item={item}
              initialX={POSITIONS[i][0]}
              initialY={POSITIONS[i][1]}
              delay={i * 0.12}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            position: 'absolute', bottom: '30px', left: '45%',
            transform: 'translateX(-50%)', zIndex: 10,
          }}
        >
          <button className="btn-glow" onClick={onNext}>
            Continue ✨
          </button>
        </motion.div>
      </div>
    </div>
  );
}
