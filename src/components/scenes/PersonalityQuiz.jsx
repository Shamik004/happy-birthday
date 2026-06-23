import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    q: 'What do you think I love most about you? ❤️',
    options: [
      'My smile 😊',
      'My caring nature 🌸',
      'My chaotic energy 😆',
      'Everything 😌'
    ],
  },
  {
    q: 'If we could disappear for a day, where would we go? ✈️',
    options: [
      'Mountains ⛰️',
      'Beach 🌊',
      'A cute café ☕',
      'Anywhere, as long as we are together ❤️'
    ],
  },
  {
    q: 'What is my secret superpower? ✨',
    options: [
      'Making you smile 😁',
      'Stealing your attention 😏',
      'Being adorable without trying 🥹',
      'All of the above 💖'
    ],
  },
  {
    q: 'What should Megha do on her 20th Birthday? 🎂',
    options: [
      'Smile more 😊',
      'Eat lots of cake 🍰',
      'Make beautiful memories 📸',
      'All of the above ❤️'
    ],
  },
  {
    q: 'Who is the birthday girl? 👑',
    options: [
      'The prettiest girl 💕',
      'The sweetest girl 🌷',
      'My favourite person ❤️',
      'All of the above ✨'
    ],
  },
];

export default function PersonalityQuiz({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (opt) => {
    setSelected(opt);
    setTimeout(() => {
      const newAnswers = [...answers, opt];
      setAnswers(newAnswers);
      setSelected(null);
      if (current < QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setShowResult(true);
        confetti({
          particleCount: 200, spread: 100, origin: { y: 0.6 },
          colors: ['#ff6b9d', '#9b59b6', '#f39c12', '#fff'],
        });
      }
    }, 600);
  };

  const progress = ((current + (selected ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="scene" style={{ zIndex: 1, padding: '20px' }}>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{ maxWidth: '560px', width: '100%', zIndex: 2 }}
          >
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                marginBottom: '8px',
                color: '#fff',
              }}>
                <span style={{ marginRight: '10px' }}>🎯</span>
                <span style={{
                  background: 'linear-gradient(135deg, #9b59b6, #ff6b9d)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  How Well Do You Know Yourself?
                </span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Question {current + 1} of {QUESTIONS.length}
              </p>
            </div>

            {/* Progress bar */}
            <div style={{
              width: '100%', height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3, marginBottom: '30px',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="progress-bar"
                style={{ height: '100%', borderRadius: 3 }}
              />
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="glass"
                style={{ padding: '30px', marginBottom: '20px' }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem', color: '#fff',
                  marginBottom: '24px', lineHeight: 1.5,
                }}>
                  {QUESTIONS[current].q}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {QUESTIONS[current].options.map((opt, i) => (
                    <motion.button
                      key={opt}
                      className={`quiz-option ${selected === opt ? 'selected' : ''}`}
                      onClick={() => handleSelect(opt)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ x: 5 }}
                    >
                      <span style={{ color: '#ff6b9d', marginRight: '10px', fontWeight: 700 }}>
                        {['A', 'B', 'C', 'D'][i]}.
                      </span>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="glass"
            style={{
              maxWidth: '520px', width: '90%', padding: '40px 30px',
              textAlign: 'center', zIndex: 2,
              borderColor: 'rgba(255, 107, 157, 0.4)',
              boxShadow: '0 0 60px rgba(255, 107, 157, 0.25)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
              style={{ fontSize: '4.5rem', marginBottom: '15px' }}
            >
              👑
            </motion.div>

            <div style={{
              display: 'inline-block',
              background: 'rgba(255,107,157,0.15)',
              border: '1px solid rgba(255,107,157,0.4)',
              borderRadius: '50px', padding: '6px 20px',
              color: '#ff6b9d', fontSize: '0.8rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              marginBottom: '16px', fontWeight: 600,
            }}>
              ✨ Quiz Result ✨
            </div>

            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)',
              marginBottom: '12px', lineHeight: 1.3,
              color: '#fff',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ff6b9d, #f39c12, #9b59b6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Congratulations!
              </span>{' '}
              <span style={{ display: 'inline-block' }}>💖</span>
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.05rem',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '24px',
            }}>
              You are officially:
            </p>

            {/* Checklist of qualities */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '300px',
              margin: '0 auto 28px',
              textAlign: 'left',
            }}>
              {['Beautiful', 'Adorable', 'Amazing', 'Loved by Shamik'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.25, duration: 0.5, type: 'spring' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.15rem',
                    color: index === 3 ? '#ff6b9d' : 'rgba(255,255,255,0.95)',
                    fontWeight: index === 3 ? 700 : 500,
                    fontFamily: 'Inter, sans-serif',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${index === 3 ? 'rgba(255,107,157,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <span style={{ color: '#ff6b9d', fontWeight: '900', fontSize: '1.25rem' }}>✓</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Score Pill */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(243,156,18,0.15))',
                border: '1px solid rgba(255,107,157,0.4)',
                borderRadius: '50px',
                padding: '10px 24px',
                marginBottom: '32px',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'Playfair Display, serif',
                boxShadow: '0 0 20px rgba(255,107,157,0.2)',
              }}
            >
              <span>Score: 20/20</span>
              <span>🎂❤️</span>
            </motion.div>

            <div>
              <button className="btn-glow" onClick={onNext} style={{ width: '100%', maxWidth: '280px' }}>
                Continue the Journey 🌸
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
