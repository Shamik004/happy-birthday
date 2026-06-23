import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const HEART_MESSAGES = [
  { msg: 'Your smile can improve any bad day 😊', emoji: '😊' },
  { msg: 'You make ordinary moments feel magical ✨', emoji: '✨' },
  { msg: 'Your laugh is the best sound in the world 🎶', emoji: '🎶' },
  { msg: 'You\'re braver than you believe 💪', emoji: '💪' },
  { msg: 'Kindness looks beautiful on you 🌸', emoji: '🌸' },
  { msg: 'You light up every room you walk into 💡', emoji: '💡' },
  { msg: 'Your vibe is absolutely contagious ✨', emoji: '✨' },
  { msg: 'You\'re one in a billion, Megha 🌟', emoji: '🌟' },
  { msg: 'That day you made everyone laugh — never forget it 😂', emoji: '😂' },
  { msg: 'Your style? Effortlessly iconic 💅', emoji: '💅' },
  { msg: 'Proud of how far you\'ve come 🦋', emoji: '🦋' },
  { msg: '20 looks incredible on you 🎂', emoji: '🎂' },
  { msg: 'You give the best hugs. Fact. 🤗', emoji: '🤗' },
  { msg: 'Your heart is your greatest superpower ❤️', emoji: '❤️' },
  { msg: 'You\'re going to do amazing things 🚀', emoji: '🚀' },
  { msg: 'Every moment with you is a memory worth keeping 📸', emoji: '📸' },
  { msg: 'You\'ve grown so beautifully, inside and out 🌺', emoji: '🌺' },
  { msg: 'The world is better with you in it 🌍', emoji: '🌍' },
  { msg: 'You are so deeply loved, Megha ❤️', emoji: '❤️' },
  { msg: 'Happy Birthday! You deserve all of this and more 🎉', emoji: '🎉' },
];

const POSITIONS = [
  { top: '12%', left: '8%' }, { top: '18%', left: '88%' },
  { top: '25%', left: '35%' }, { top: '30%', left: '68%' },
  { top: '42%', left: '15%' }, { top: '45%', left: '82%' },
  { top: '55%', left: '50%' }, { top: '60%', left: '25%' },
  { top: '65%', left: '75%' }, { top: '72%', left: '10%' },
  { top: '75%', left: '60%' }, { top: '80%', left: '88%' },
  { top: '8%', left: '55%' }, { top: '38%', left: '47%' },
  { top: '50%', left: '35%' }, { top: '20%', left: '20%' },
  { top: '85%', left: '40%' }, { top: '90%', left: '70%' },
  { top: '10%', left: '75%' }, { top: '70%', left: '45%' },
];

export default function HeartsChallenge({ onNext }) {
  const [found, setFound] = useState(Array(20).fill(false));
  const [activePopup, setActivePopup] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const foundCount = found.filter(Boolean).length;
  const popupTimerRef = useRef(null);   // tracks the active popup timeout

  const handleFind = (i) => {
    if (found[i]) return;
    const next = [...found];
    next[i] = true;
    setFound(next);
    setActivePopup(i);
    // Cancel any running popup timer so the new popup always gets its full 5 s
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setActivePopup(null), 5000);

    if (next.every(Boolean)) {
      setTimeout(() => {
        setShowReward(true);
        confetti({ particleCount: 300, spread: 140, origin: { y: 0.5 }, colors: ['#ff6b9d','#9b59b6','#f39c12','#fff'] });
        setTimeout(() => confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0 } }), 400);
        setTimeout(() => confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1 } }), 600);
      }, 500);
    }
  };

  return (
    <div className="scene" style={{ zIndex: 1, minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '30px 20px 10px', zIndex: 5, position: 'relative' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          marginBottom: '8px',
          color: '#fff',
        }}>
          <span style={{ marginRight: '10px' }}>💝</span>
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            20 Hidden Hearts Challenge
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '16px' }}>
          Find all 20 hidden hearts across the page!
        </p>

        {/* Progress */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,107,157,0.3)',
          borderRadius: '50px', padding: '8px 20px',
        }}>
          <span style={{ color: '#ff6b9d', fontWeight: 700, fontSize: '1.1rem' }}>
            💕 {foundCount} / 20
          </span>
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
            <motion.div
              animate={{ width: `${(foundCount / 20) * 100}%` }}
              style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, #ff6b9d, #f39c12)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Hearts playground */}
      <div style={{ position: 'relative', width: '100%', height: '75vh' }}>
        {POSITIONS.map((pos, i) => {
          // Parse percentages so we can nudge the popup smartly
          const topPct = parseFloat(pos.top);
          const leftPct = parseFloat(pos.left);

          // Popup floats above the heart; flip below if heart is near top
          const popupTop = topPct < 20 ? `${topPct + 8}%` : `${topPct - 2}%`;
          // Clamp left so popup (≈260px) doesn't overflow right edge
          const popupLeft = leftPct > 75 ? `${leftPct - 30}%`
                          : leftPct < 15 ? `${leftPct + 2}%`
                          : `${leftPct - 10}%`;

          return (
            <React.Fragment key={i}>
              {/* Heart button */}
              <AnimatePresence>
                {!found[i] && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 2 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="hidden-heart"
                    style={{ ...pos, position: 'absolute', background: 'none', border: 'none' }}
                    onClick={() => handleFind(i)}
                    aria-label={`Hidden heart ${i + 1}`}
                  >
                    💗
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Popup — appears right at this heart's location */}
              <AnimatePresence>
                {activePopup === i && (
                  <motion.div
                    key={`popup-${i}`}
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="glass"
                    style={{
                      position: 'absolute',
                      top: popupTop,
                      left: popupLeft,
                      transform: 'translateY(-100%)',
                      padding: '16px 20px',
                      textAlign: 'center',
                      zIndex: 100,
                      width: '220px',
                      borderColor: 'rgba(255,107,157,0.4)',
                      boxShadow: '0 0 30px rgba(255,107,157,0.35)',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Tiny connector triangle pointing at the heart */}
                    <div style={{
                      position: 'absolute', bottom: '-8px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0, height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid rgba(255,107,157,0.25)',
                    }} />
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      {HEART_MESSAGES[i].emoji}
                    </div>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '0.88rem', color: '#fff', lineHeight: 1.5, margin: 0,
                    }}>
                      {HEART_MESSAGES[i].msg}
                    </p>
                    <div style={{
                      marginTop: '8px', fontSize: '0.72rem',
                      color: '#ff6b9d', fontWeight: 600,
                    }}>
                      Heart #{i + 1} found! 💕
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          );
        })}
      </div>

      {/* Reward */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(10,10,15,0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="glass"
              style={{
                padding: '50px 40px', textAlign: 'center',
                maxWidth: '480px', margin: '20px',
                borderColor: 'rgba(243,156,18,0.5)',
                boxShadow: '0 0 60px rgba(243,156,18,0.3)',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                background: 'linear-gradient(135deg, #f39c12, #ff6b9d)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '12px',
              }}>
                All 20 Hearts Found!
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem',
                lineHeight: 1.6, marginBottom: '24px',
              }}>
                🎉 You found every heart!<br />
                Just like you've found a place in so many hearts, Megha. ❤️<br />
                <span style={{ color: '#f39c12', fontWeight: 600 }}>You unlocked your special reward!</span>
              </p>
              <button className="btn-glow" onClick={onNext}>
                Claim Your Reward 🎁
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {!showReward && (
        <div style={{ textAlign: 'center', padding: '10px', position: 'relative', zIndex: 5 }}>
          <button
            onClick={onNext}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50px', padding: '8px 24px',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            Skip Challenge →
          </button>
        </div>
      )}
    </div>
  );
}
