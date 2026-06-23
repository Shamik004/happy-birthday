import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTER_LINES = [
  'Dear Megha,',
  '',
  'Happy 20th Birthday, my love. ❤️',
  '',
  'It feels a little funny writing this because we have only been together for a few months,',
  'but somehow you have already become such an important part of my days.',
  '',
  'You are the person I look forward to talking to.',
  'The notification I secretly hope to see.',
  'And the reason so many ordinary days have become special lately.',
  '',
  'I don’t know what the future has planned for us,',
  'but I know that meeting you has been one of the best things that happened to me this year.',
  '',
  'As you step into your twenties,',
  'I hope you keep smiling the way you do.',
  'I hope you keep chasing the things that make you happy.',
  'And I hope you never forget how special you are to the people who love you.',
  '',
  'Thank you for every conversation, every laugh,',
  'every memory we have made so far, and every memory still waiting for us.',
  '',
  'Today is all about you.',
  'So eat the cake, make wishes, take pictures,',
  'and enjoy every second of being the birthday girl. 🎂✨',
  '',
  'Happy 20th Birthday, Megha.',
  'I am really glad that our stories crossed paths. ❤️',
  '',
  'With love,',
  'Shamik',
];


export default function SecretLetter({ onNext }) {
  const [phase, setPhase] = useState('sealed'); // sealed | opening | open

  const handleOpen = () => {
    setPhase('opening');
    setTimeout(() => setPhase('open'), 800);
  };

  return (
    <div className="scene" style={{ zIndex: 1, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '30px' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: '#fff',
        }}>
          <span style={{ marginRight: '10px' }}>💌</span>
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #9b59b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            A Secret Letter
          </span>
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase !== 'open' ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              onClick={handleOpen}
              animate={phase === 'sealed' ? {
                y: [0, -8, 0],
              } : { rotateX: [0, -20, 0] }}
              transition={{ duration: 2, repeat: phase === 'sealed' ? Infinity : 0 }}
              style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Envelope */}
              <div style={{ position: 'relative', width: 260, height: 180 }}>
                {/* Envelope body */}
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(160deg, #2d1b4e, #1a0a2e)',
                  border: '2px solid rgba(255,107,157,0.4)',
                  borderRadius: '4px',
                  boxShadow: '0 0 40px rgba(155,89,182,0.3), 0 8px 30px rgba(0,0,0,0.5)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Envelope shine */}
                  <div style={{
                    position: 'absolute', top: 0, left: '-30%',
                    width: '60%', height: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    transform: 'skewX(-20deg)',
                  }} />

                  {/* V-fold lines */}
                  <svg viewBox="0 0 260 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <line x1="0" y1="0" x2="130" y2="90" stroke="rgba(255,107,157,0.25)" strokeWidth="1" />
                    <line x1="260" y1="0" x2="130" y2="90" stroke="rgba(255,107,157,0.25)" strokeWidth="1" />
                    <line x1="0" y1="180" x2="130" y2="90" stroke="rgba(255,107,157,0.2)" strokeWidth="1" />
                    <line x1="260" y1="180" x2="130" y2="90" stroke="rgba(255,107,157,0.2)" strokeWidth="1" />
                  </svg>

                  {/* Wax seal */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'radial-gradient(circle, #e91e8c, #ad1457)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem',
                    boxShadow: '0 0 20px rgba(233,30,140,0.5)',
                    border: '2px solid rgba(255,107,157,0.6)',
                  }}>
                    ❤️
                  </div>
                </div>

                {/* Lid / flap - opens on click */}
                <motion.div
                  animate={phase === 'opening' ? { rotateX: -180, opacity: 0 } : {}}
                  transition={{ duration: 0.7 }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                    transformOrigin: 'top',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    background: 'linear-gradient(160deg, #3d2060, #2d1b4e)',
                    border: '2px solid rgba(255,107,157,0.3)',
                    borderBottom: 'none',
                  }}
                />
              </div>

              {phase === 'sealed' && (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    color: 'rgba(255,255,255,0.6)', marginTop: '16px',
                    fontSize: '0.9rem',
                  }}
                >
                  👆 Click to unseal your letter
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ maxWidth: '540px', width: '100%', zIndex: 2 }}
          >
            {/* Letter paper */}
            <div style={{
              background: 'linear-gradient(160deg, #1e0a2e 0%, #2d1b4e 100%)',
              border: '1px solid rgba(255,107,157,0.3)',
              borderRadius: '8px',
              padding: '40px 36px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(155,89,182,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Paper texture lines */}
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: `${40 + i * 28}px`, height: '1px',
                  background: 'rgba(255,255,255,0.03)',
                }} />
              ))}

              {/* Letter content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {LETTER_LINES.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    style={{
                      fontFamily: i === 0 || i >= LETTER_LINES.length - 3
                        ? 'Dancing Script, cursive'
                        : 'Dancing Script, cursive',
                      fontSize: i === 0 ? '1.3rem' : '1rem',
                      color: i === 0 ? '#ff6b9d'
                        : i === LETTER_LINES.length - 1 ? '#f39c12'
                          : i === LETTER_LINES.length - 2 ? 'rgba(255,255,255,0.9)'
                            : 'rgba(255,255,255,0.8)',
                      lineHeight: line === '' ? '0.8' : '1.8',
                      fontWeight: i === 0 || i >= LETTER_LINES.length - 2 ? 700 : 400,
                      marginBottom: line === '' ? '8px' : '0',
                    }}
                  >
                    {line || '\u00A0'}
                  </motion.p>
                ))}
              </div>

              {/* Corner decorations */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', opacity: 0.3, fontSize: '1rem' }}>❀</div>
              <div style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.3, fontSize: '1rem' }}>❀</div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', opacity: 0.3, fontSize: '1rem' }}>❀</div>
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', opacity: 0.3, fontSize: '1rem' }}>❀</div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ textAlign: 'center', marginTop: '30px' }}
            >
              <button className="btn-glow" onClick={onNext}>
                The Grand Finale 🎆
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
