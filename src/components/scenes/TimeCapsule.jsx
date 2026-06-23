import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PORTALS = [
  {
    emoji: '✨',
    label: 'Dreams',
    color: '#f39c12',
    gradient: 'linear-gradient(135deg, #f39c12, #e67e22)',
    titleEmoji: '✨',
    titleText: 'To Future Megha',
    content: [
      'I hope you never stop believing in yourself, even on the days when things feel uncertain.',
      'You are capable of so much more than you realize right now.',
      'Whatever dream is living in your heart today, I hope you chase it fearlessly.',
      'And when you achieve it, I hope you remember this birthday and smile. 💫',
    ],
  },

  {
    emoji: '🌸',
    label: 'Future Adventures',
    color: '#ff6b9d',
    gradient: 'linear-gradient(135deg, #ff6b9d, #e91e8c)',
    titleEmoji: '🌸',
    titleText: 'The Adventures Ahead',
    content: [
      'There are still so many sunsets waiting for you to admire.',
      'So many places waiting to become your favourite memories.',
      'So many moments waiting to make you laugh until your stomach hurts.',
      'I hope the years ahead are filled with stories you\'ll love telling. 🦋',
    ],
  },

  {
    emoji: '❤️',
    label: 'A Message From Me',
    color: '#9b59b6',
    gradient: 'linear-gradient(135deg, #9b59b6, #6c3483)',
    titleEmoji: '❤️',
    titleText: 'For Megha',
    content: [
      'Right now, as you read this, we have been together for only a few months.',
      'But these months have already given me so many reasons to be grateful for you.',
      'I don\'t know what the future holds, but I do know this: ',
      'Meeting you has been one of my favourite parts of this year. ❤️',
    ],
  },
];


function Portal({ portal, index, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 120 }}
      style={{ textAlign: 'center', cursor: 'pointer' }}
      onClick={onOpen}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="portal"
        style={{
          width: 140, height: 140,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          background: `radial-gradient(circle, ${portal.color}25 0%, ${portal.color}10 50%, transparent 70%)`,
          borderColor: `${portal.color}70`,
          position: 'relative',
        }}
      >
        {/* Rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            border: `2px dashed ${portal.color}40`,
          }}
        />
        <div style={{ fontSize: '3rem', filter: `drop-shadow(0 0 10px ${portal.color})` }}>
          {portal.emoji}
        </div>
      </motion.div>
      <p style={{
        fontFamily: 'Playfair Display, serif',
        color: portal.color, fontWeight: 700, fontSize: '1rem',
      }}>
        {portal.label}
      </p>
    </motion.div>
  );
}

export default function TimeCapsule({ onNext }) {
  const [openPortal, setOpenPortal] = useState(null);

  return (
    <div className="scene" style={{ zIndex: 1, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '50px' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          marginBottom: '10px',
          color: '#fff',
        }}>
          <span style={{ marginRight: '10px' }}>🔮</span>
          <span style={{
            background: 'linear-gradient(135deg, #9b59b6, #ff6b9d, #f39c12)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Future Time Capsule
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
          Step into a portal to glimpse what awaits you ✨
        </p>
      </motion.div>

      <div style={{
        display: 'flex', gap: '40px', justifyContent: 'center',
        flexWrap: 'wrap', marginBottom: '50px',
      }}>
        {PORTALS.map((portal, i) => (
          <Portal key={i} portal={portal} index={i} onOpen={() => setOpenPortal(i)} />
        ))}
      </div>

      {/* Portal overlay */}
      <AnimatePresence>
        {openPortal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(10,10,15,0.92)',
              backdropFilter: 'blur(15px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setOpenPortal(null)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="glass"
              style={{
                maxWidth: '480px', width: '100%',
                padding: '40px',
                borderColor: `${PORTALS[openPortal].color}40`,
                boxShadow: `0 0 60px ${PORTALS[openPortal].color}30`,
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.8rem',
                marginBottom: '24px', textAlign: 'center',
                color: '#fff',
              }}>
                <span style={{ marginRight: '10px' }}>{PORTALS[openPortal].titleEmoji}</span>
                <span style={{
                  background: PORTALS[openPortal].gradient,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {PORTALS[openPortal].titleText}
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {PORTALS[openPortal].content.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '1rem', lineHeight: 1.7,
                      paddingLeft: '12px',
                      borderLeft: `3px solid ${PORTALS[openPortal].color}60`,
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <button
                onClick={() => setOpenPortal(null)}
                style={{
                  marginTop: '28px', width: '100%',
                  background: PORTALS[openPortal].gradient,
                  border: 'none', borderRadius: '50px',
                  padding: '12px', color: '#fff',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.95rem',
                }}
              >
                Close Portal ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ textAlign: 'center' }}
      >
        <button className="btn-glow" onClick={onNext}>
          One More Surprise 💌
        </button>
      </motion.div>
    </div>
  );
}
