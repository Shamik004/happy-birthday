import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function Candle({ lit, onClick, index }) {
  return (
    <div
      onClick={() => onClick(index)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: lit ? 'pointer' : 'default',
        gap: '0px',
        transition: 'transform 0.2s',
        transform: lit ? 'none' : 'scale(0.95)',
      }}
      title={lit ? 'Click to blow!' : ''}
    >
      {/* Flame */}
      <div style={{ width: 10, height: lit ? 18 : 0, position: 'relative', transition: 'height 0.4s' }}>
        {lit && (
          <>
            <div className="flame" style={{
              width: 8, height: 14,
              background: 'linear-gradient(180deg, #fff9c4 0%, #ffeb3b 30%, #ff9800 60%, #f44336 100%)',
              borderRadius: '50% 50% 20% 20%',
              position: 'absolute', left: 1, top: 0,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 6px #ffeb3b, 0 0 12px #ff9800',
            }} />
            <div style={{
              width: 4, height: 6,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              position: 'absolute', left: 3, top: 2,
              filter: 'blur(1px)',
            }} />
          </>
        )}
        {!lit && (
          <div style={{ width: 2, height: 8, background: 'rgba(100,100,100,0.5)', margin: '0 auto', borderRadius: 2 }} />
        )}
      </div>
      {/* Wick */}
      <div style={{ width: 2, height: 5, background: '#333', borderRadius: 1 }} />
      {/* Candle body */}
      <div style={{
        width: 8, height: 30,
        background: lit
          ? 'linear-gradient(180deg, #fff9c4, #ffe082)'
          : 'linear-gradient(180deg, #e0e0e0, #bdbdbd)',
        borderRadius: '3px 3px 2px 2px',
        boxShadow: lit ? '0 0 8px rgba(255,235,59,0.5)' : 'none',
        transition: 'all 0.4s',
      }} />
    </div>
  );
}

export default function CandleScene({ onNext }) {
  const [candles, setCandles] = useState(Array(20).fill(true));
  const [phase, setPhase] = useState('wish'); // wish | blown | done
  const micRef = useRef(null);
  const micStreamRef = useRef(null);
  const micRafRef = useRef(null);
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [smokeParticles, setSmokeParticles] = useState([]);
  const [windFlash, setWindFlash] = useState(false);
  const [blowCount, setBlowCount] = useState(0);
  const blowCooldownRef = useRef(false);
  // ── KEY FIX: ref always holds latest candle state so mic closure never goes stale ──
  const candlesRef = useRef(Array(20).fill(true));

  const litCount = candles.filter(Boolean).length;

  // ── Magic candle blow: pick 3-6 random lit candles to extinguish ──
  const blowSome = (currentCandles) => {
    const litIndices = currentCandles
      .map((lit, i) => (lit ? i : -1))
      .filter(i => i !== -1);

    if (litIndices.length === 0) return null;

    const countToBlow = Math.min(
      litIndices.length,
      Math.floor(Math.random() * 4) + 3  // 3, 4, 5, or 6
    );

    const shuffled = [...litIndices].sort(() => Math.random() - 0.5);
    const toBlow = shuffled.slice(0, countToBlow);

    const next = [...currentCandles];
    toBlow.forEach(i => { next[i] = false; });

    return { next, toBlow };
  };

  // Called by button, candle click, AND mic (closure-safe via candlesRef)
  const triggerBlow = () => {
    if (blowCooldownRef.current) return;
    blowCooldownRef.current = true;

    // Always read from ref — safe in stale closures (e.g. mic rAF loop)
    const result = blowSome(candlesRef.current);
    if (!result) {
      blowCooldownRef.current = false;
      return;
    }

    const { next, toBlow } = result;

    // Update ref FIRST so any immediate follow-up reads the new state
    candlesRef.current = next;
    setCandles(next);

    // Wind gust
    setWindFlash(true);
    setTimeout(() => setWindFlash(false), 500);

    // Smoke puffs from blown candles
    const newSmoke = toBlow.map((i, idx) => ({
      id: Date.now() + idx,
      col: i % 10,
      row: Math.floor(i / 10),
    }));
    setSmokeParticles(p => [...p, ...newSmoke]);

    // Blow counter
    setBlowCount(c => c + 1);

    // All out → transition
    if (next.every(c => !c)) {
      setTimeout(() => setPhase('blown'), 1000);
    }

    // Release cooldown
    setTimeout(() => { blowCooldownRef.current = false; }, 850);
  };

  // Microphone support — robust blow detection
  const toggleMic = async () => {
    // --- STOP ---
    if (micActive) {
      if (micRafRef.current) cancelAnimationFrame(micRafRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
      micRef.current = null;
      micStreamRef.current = null;
      setMicActive(false);
      setMicLevel(0);
      return;
    }

    // --- START ---
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;           // higher resolution
      analyser.smoothingTimeConstant = 0.6; // smooth out spikes
      source.connect(analyser);
      micRef.current = analyser;
      setMicActive(true);

      const data = new Uint8Array(analyser.frequencyBinCount);

      // ── Step 1: Calibrate ambient noise over 60 frames (~1 second) ──
      let calibFrames = 0;
      let ambientSum = 0;
      let ambientBaseline = 0;

      // ── Step 2: Blow detection state ──
      // Requires BLOW_FRAMES consecutive frames above threshold before triggering.
      // If sound drops back down, counter decays — prevents gradual accumulation.
      const BLOW_FRAMES = 20;      // ~0.33s of sustained loud blow needed
      const THRESHOLD_MARGIN = 55; // must be this many units above ambient baseline
      const MIN_THRESHOLD = 80;    // absolute floor — even if room is noisy
      let blowCounter = 0;

      const check = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;

        // Calibration phase: first 60 frames
        if (calibFrames < 60) {
          ambientSum += avg;
          calibFrames++;
          if (calibFrames === 60) {
            ambientBaseline = ambientSum / 60;
          }
          micRafRef.current = requestAnimationFrame(check);
          return;
        }

        // Effective threshold = ambient + margin, but never below MIN_THRESHOLD
        const threshold = Math.max(ambientBaseline + THRESHOLD_MARGIN, MIN_THRESHOLD);

        // Update UI level meter (0–100 relative to threshold)
        const levelPct = Math.min(100, Math.round(((avg - ambientBaseline) / THRESHOLD_MARGIN) * 100));
        setMicLevel(Math.max(0, levelPct));

        if (avg > threshold) {
          blowCounter++;
          if (blowCounter >= BLOW_FRAMES) {
            // Genuine sustained blow detected!
            setMicLevel(0);
            triggerBlow();
            // Reset counter for next blow — DON'T stop the mic
            blowCounter = 0;
          }
        } else {
          blowCounter = Math.max(0, blowCounter - 2);
        }

        micRafRef.current = requestAnimationFrame(check);
      };

      micRafRef.current = requestAnimationFrame(check);
    } catch (e) {
      alert('Microphone access denied. Click candles instead!');
    }
  };

  // Cake cut phase
  const [cakePhase, setCakePhase] = useState('whole'); // whole | cut | celebrate
  const [knifeDrag, setKnifeDrag] = useState({ x: 0, dragging: false });
  const knifeRef = useRef(null);

  const handleCakeCut = () => {
    setCakePhase('cut');
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#9b59b6', '#f39c12', '#ffb3d1', '#c39bd3'],
    });
    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 }, colors: ['#ff6b9d', '#f39c12'] });
      confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 }, colors: ['#9b59b6', '#ffb3d1'] });
    }, 300);
    setTimeout(() => setCakePhase('celebrate'), 1500);
    setTimeout(() => onNext(), 3500);
  };

  if (phase === 'blown') {
    return (
      <div className="scene" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', zIndex: 2, padding: '20px', maxWidth: '600px' }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '4rem', marginBottom: '20px' }}
          >
            🎂
          </motion.div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '12px',
          }}>
            Wish Accepted ❤️
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '30px' }}>
            Now it's time to cut the cake 🎂
          </p>

          {/* Cake cutting */}
          <div style={{ position: 'relative', width: '240px', margin: '0 auto 30px' }}>
            {/* Cake SVG */}
            <svg viewBox="0 0 200 150" style={{ width: '100%', filter: 'drop-shadow(0 0 20px rgba(255,107,157,0.5))' }}>
              {/* Plate */}
              <ellipse cx="100" cy="138" rx="90" ry="10" fill="rgba(255,255,255,0.1)" />
              {/* Bottom tier */}
              <rect x="20" y="100" width="160" height="40" rx="8" fill="url(#cakeGrad1)" />
              {/* Middle tier */}
              <rect x="35" y="65" width="130" height="40" rx="6" fill="url(#cakeGrad2)" />
              {/* Top tier */}
              <rect x="55" y="38" width="90" height="30" rx="5" fill="url(#cakeGrad3)" />
              {/* Frosting drips */}
              {[30,50,70,90,110,130,150].map((x, i) => (
                <ellipse key={i} cx={x} cy="100" rx="8" ry="6" fill="rgba(255,255,255,0.9)" />
              ))}
              {[45,65,85,105,125,145].map((x, i) => (
                <ellipse key={i} cx={x} cy="65" rx="6" ry="5" fill="rgba(255,255,255,0.9)" />
              ))}
              {[65,85,105,125].map((x, i) => (
                <ellipse key={i} cx={x} cy="38" rx="5" ry="4" fill="rgba(255,255,255,0.9)" />
              ))}
              {/* Cut line */}
              {cakePhase !== 'whole' && (
                <line x1="100" y1="38" x2="100" y2="140" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeDasharray="4" />
              )}
              {/* Slice highlight */}
              {cakePhase === 'cut' && (
                <polygon points="100,90 130,140 70,140" fill="rgba(255,107,157,0.3)" stroke="#ff6b9d" strokeWidth="1" />
              )}
              <defs>
                <linearGradient id="cakeGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e91e8c" />
                  <stop offset="100%" stopColor="#c2185b" />
                </linearGradient>
                <linearGradient id="cakeGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9c27b0" />
                  <stop offset="100%" stopColor="#6a1b9a" />
                </linearGradient>
                <linearGradient id="cakeGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b9d" />
                  <stop offset="100%" stopColor="#e91e8c" />
                </linearGradient>
              </defs>
            </svg>

            {/* Knife emoji */}
            <motion.div
              drag="x"
              dragConstraints={{ left: -60, right: 60 }}
              onDragEnd={() => handleCakeCut()}
              style={{
                position: 'absolute', top: '10px', left: '50%',
                fontSize: '2.5rem', cursor: 'grab',
                transform: 'translateX(-50%) rotate(45deg)',
                filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))',
              }}
              whileHover={{ scale: 1.1 }}
              title="Drag to cut!"
            >
              🔪
            </motion.div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            Drag the knife across the cake ✨
          </p>

          {cakePhase === 'celebrate' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ marginTop: '20px' }}
            >
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                color: '#fff',
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Happy Birthday Megha
                </span>{' '}
                <span style={{ display: 'inline-block' }}>🎉</span>
              </h3>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="scene" style={{ zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 2, padding: '20px', maxWidth: '700px', width: '100%' }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '8px' }}>
          Before we begin...
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          marginBottom: '6px',
          color: '#fff',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ff6b9d, #f39c12)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Make a Wish
          </span>{' '}
          <span style={{ display: 'inline-block' }}>✨</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '20px', fontSize: '0.9rem' }}>
          🪄 Magic candles! Keep blowing — {litCount > 0 ? `${litCount} still lit` : 'all out!'}
          {blowCount > 0 && (
            <span style={{ marginLeft: '10px', color: '#f39c12', fontWeight: 600 }}>
              Blow #{blowCount} 💨
            </span>
          )}
        </p>

        {/* Cake with candles */}
        <div style={{ position: 'relative', margin: '0 auto 24px', maxWidth: '380px' }}>
          {/* Candle row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '4px', justifyItems: 'center', marginBottom: '4px',
          }}>
            {candles.map((lit, i) => (
              <Candle key={i} lit={lit} onClick={() => triggerBlow()} index={i} />
            ))}
          </div>

          {/* Cake body */}
          <svg viewBox="0 0 380 160" style={{ width: '100%', filter: 'drop-shadow(0 0 20px rgba(255,107,157,0.4))' }}>
            <rect x="20" y="100" width="340" height="50" rx="10" fill="url(#c1)" />
            <rect x="50" y="60" width="280" height="45" rx="8" fill="url(#c2)" />
            <rect x="90" y="28" width="200" height="36" rx="6" fill="url(#c3)" />
            {/* Frosting drips top tier */}
            {[100,120,140,160,180,200,220,240,260,280].map((x,i) => (
              <ellipse key={i} cx={x} cy="64" rx="10" ry="7" fill="rgba(255,255,255,0.85)" />
            ))}
            {/* Frosting drips middle */}
            {[55,80,105,130,155,180,205,230,255,280,305,330].map((x,i) => (
              <ellipse key={i} cx={x} cy="100" rx="11" ry="8" fill="rgba(255,255,255,0.85)" />
            ))}
            {/* Sprinkles */}
            {Array.from({length:20}, (_,i) => (
              <rect key={i}
                x={60 + Math.sin(i * 2.3) * 120 + 120}
                y={70 + (i % 4) * 15}
                width="4" height="2" rx="1"
                fill={['#ff6b9d','#f39c12','#9b59b6','#4fc3f7'][i%4]}
                transform={`rotate(${i * 30}, ${100 + i * 10}, ${80 + i % 4 * 15})`}
              />
            ))}
            {/* "20" text */}
            <text x="190" y="88" textAnchor="middle" fill="rgba(255,255,255,0.9)"
              fontFamily="Playfair Display, serif" fontSize="18" fontWeight="bold">20</text>
            <ellipse cx="190" cy="158" rx="170" ry="10" fill="rgba(255,255,255,0.07)" />
            <defs>
              <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e91e8c" /><stop offset="100%" stopColor="#ad1457" />
              </linearGradient>
              <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9c27b0" /><stop offset="100%" stopColor="#6a1b9a" />
              </linearGradient>
              <linearGradient id="c3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b9d" /><stop offset="100%" stopColor="#e91e8c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Ambient glow from candles */}
          {litCount > 0 && (
            <div style={{
              position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '80px',
              background: `radial-gradient(ellipse, rgba(255,235,59,${0.05 + litCount * 0.003}) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
          )}

          {/* Wind gust — SVG streak lines sweeping left to right inside the cake wrapper */}
          <AnimatePresence>
            {windFlash && (
              <motion.svg
                key="wind"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  pointerEvents: 'none', zIndex: 20, overflow: 'visible',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.9, 0] }}
                transition={{ duration: 0.5 }}
              >
                {[
                  { y: '6%',  len: 65, delay: 0.00 },
                  { y: '14%', len: 85, delay: 0.03 },
                  { y: '22%', len: 55, delay: 0.06 },
                  { y: '30%', len: 90, delay: 0.01 },
                  { y: '40%', len: 70, delay: 0.04 },
                  { y: '52%', len: 50, delay: 0.07 },
                  { y: '65%', len: 80, delay: 0.02 },
                  { y: '78%', len: 60, delay: 0.05 },
                ].map((s, i) => (
                  <motion.line
                    key={i}
                    y1={s.y} y2={s.y}
                    stroke={`rgba(180,220,255,${0.4 + (i % 3) * 0.1})`}
                    strokeWidth={0.8 + (i % 3) * 0.5}
                    strokeLinecap="round"
                    initial={{ x1: '-10%', x2: `${-10 + s.len * 0.3}%` }}
                    animate={{
                      x1: ['-10%', `${90 + s.len * 0.2}%`],
                      x2: ['-10%', '130%'],
                    }}
                    transition={{ duration: 0.38, delay: s.delay, ease: [0.2, 0.6, 0.8, 1] }}
                  />
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Smoke puffs — INSIDE the relative wrapper (max-width 380px).
              Grid: repeat(10, 1fr) with gap:4px → cellW = (380 - 9*4)/10 = 34.4px.
              Row 0 = indices 0-9 (top grid row), Row 1 = indices 10-19 (bottom grid row).
              Candle total height = flame(18) + wick(5) + body(30) = 53px.
              So row 0 flame tip ≈ y:2px, row 1 flame tip ≈ y:55px from top of wrapper. */}
          {smokeParticles.map(p => {
            const cellW = 34.4;
            const cellGap = 4;
            const smokeCx = p.col * (cellW + cellGap) + cellW / 2;
            const smokeCy = p.row === 0 ? 2 : 55;
            return (
              <React.Fragment key={p.id}>
                {[
                  { subId: 0, dxFactor: -1, delay: 0 },
                  { subId: 1, dxFactor:  1, delay: 0.07 },
                  { subId: 2, dxFactor:  0, delay: 0.14 },
                ].map(({ subId, dxFactor, delay }) => (
                  <motion.div
                    key={subId}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity:  [0, 0.75, 0.45, 0],
                      scale:    [0.2, 1.1, 2.0, 3.0],
                      x: [smokeCx + dxFactor * 2, smokeCx + dxFactor * 8],
                      y: [smokeCy, smokeCy - 50],
                    }}
                    transition={{ duration: 1.1, delay, ease: 'easeOut' }}
                    onAnimationComplete={() => {
                      if (subId === 2)
                        setSmokeParticles(prev => prev.filter(s => s.id !== p.id));
                    }}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'rgba(200,200,200,0.8)',
                      filter: 'blur(3px)',
                      pointerEvents: 'none', zIndex: 15,
                    }}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-glow" onClick={triggerBlow} disabled={blowCooldownRef.current}>
            💨 Blow! {litCount > 0 ? `(${litCount} left)` : '🎉'}
          </button>
          <button
            onClick={toggleMic}
            style={{
              background: micActive
                ? 'linear-gradient(135deg, #ff6b9d, #f39c12)'
                : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,107,157,0.4)',
              borderRadius: '50px', padding: '14px 28px',
              color: '#fff', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '0.95rem',
              transition: 'all 0.3s',
              minWidth: '190px',
            }}
          >
            {micActive ? (
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span>🎤 Blow now! 💨</span>
                {/* Blow strength meter */}
                <span style={{
                  display: 'block', width: '120px', height: '5px',
                  background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden',
                }}>
                  <span style={{
                    display: 'block', height: '100%', borderRadius: 3,
                    width: `${micLevel}%`,
                    background: micLevel > 70
                      ? 'linear-gradient(90deg,#ff6b9d,#f39c12)'
                      : 'rgba(255,255,255,0.5)',
                    transition: 'width 0.1s',
                  }} />
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Calibrating... blow hard! 💪</span>
              </span>
            ) : '🎤 Use Microphone'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
