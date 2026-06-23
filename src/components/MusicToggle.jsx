import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Happy Birthday melody — all frequencies in Hz, durations in beats (quarter note = 0.4s)
// Notes: C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00,
//        Bb4=466.16, B4=493.88, C5=523.25, D5=587.33, E5=659.25, F5=698.46, G5=783.99
const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, Bb4: 466.16, C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99, REST: 0,
};

// Correct B4 usage
const MELODY = [
  // "Hap-py birth-day to you"
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1], [NOTE.G4, 1], [NOTE.C5, 1], [493.88, 2],
  // "Hap-py birth-day to you"
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1], [NOTE.G4, 1], [NOTE.D5, 1], [NOTE.C5, 2],
  // "Hap-py birth-day dear Me-gha"
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.G5, 1], [NOTE.E5, 1], [NOTE.C5, 1], [NOTE.Bb4, 1], [NOTE.A4, 1],
  // "Hap-py birth-day to you"
  [NOTE.F5, 0.75], [NOTE.F5, 0.25], [NOTE.E5, 1], [NOTE.C5, 1], [NOTE.D5, 1], [NOTE.C5, 2.5],
  // Short pause
  [0, 0.5],
  // Verse 2
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1], [NOTE.G4, 1], [NOTE.C5, 1], [493.88, 2],
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1], [NOTE.G4, 1], [NOTE.D5, 1], [NOTE.C5, 2],
  [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.G5, 1], [NOTE.E5, 1], [NOTE.C5, 1], [NOTE.Bb4, 1], [NOTE.A4, 1],
  [NOTE.F5, 0.75], [NOTE.F5, 0.25], [NOTE.E5, 1], [NOTE.C5, 1], [NOTE.D5, 1], [NOTE.C5, 3],
];

const BEAT_DURATION = 0.42; // seconds per beat at ~143bpm (lively birthday tempo)
const MASTER_VOLUME = 0.28;

function playHappyBirthday(ctx, masterGain, loop = true) {
  let time = ctx.currentTime + 0.1;
  const allOscs = [];

  const scheduleNote = (freq, duration) => {
    const dur = duration * BEAT_DURATION;
    if (freq === 0) { time += dur; return; }

    // Main melody oscillator (sine + triangle blend)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2, time); // octave above for brightness

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, time);

    // ADSR envelope — attack, sustain, release
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(1, time + 0.04);      // attack
    noteGain.gain.setValueAtTime(0.85, time + 0.06);            // decay
    noteGain.gain.setValueAtTime(0.75, time + dur - 0.08);      // sustain
    noteGain.gain.linearRampToValueAtTime(0, time + dur - 0.02); // release

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
    allOscs.push(osc1, osc2);

    // Add a soft harmony (a minor third below) for warmth
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();
    harmOsc.type = 'sine';
    harmOsc.frequency.setValueAtTime(freq * 0.794, time); // ~minor third below
    harmGain.gain.setValueAtTime(0, time);
    harmGain.gain.linearRampToValueAtTime(0.25, time + 0.05);
    harmGain.gain.setValueAtTime(0.2, time + dur - 0.08);
    harmGain.gain.linearRampToValueAtTime(0, time + dur - 0.02);
    harmOsc.connect(harmGain);
    harmGain.connect(masterGain);
    harmOsc.start(time);
    harmOsc.stop(time + dur);
    allOscs.push(harmOsc);

    time += dur;
  };

  MELODY.forEach(([freq, beats]) => scheduleNote(freq, beats));

  const totalDuration = MELODY.reduce((sum, [, b]) => sum + b * BEAT_DURATION, 0);

  return { oscs: allOscs, totalDuration, endTime: time };
}

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const loopTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, []);

  // Remove auto-start listeners so music only plays when explicitly toggled.
  const startMusic = (withFadeIn = false) => {
    if (ctxRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    if (withFadeIn) {
      // Gentle 5-second fade-in from silence
      masterGain.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + 5);
    } else {
      masterGain.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + 0.3);
    }
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Simple reverb using convolver (impulse response)
    try {
      const convolver = ctx.createConvolver();
      const bufferSize = ctx.sampleRate * 1.5;
      const impulse = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const channelData = impulse.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.5);
        }
      }
      convolver.buffer = impulse;
      const wetGain = ctx.createGain();
      wetGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(ctx.destination);
    } catch (e) {
      // Reverb not supported, continue without
    }

    const schedule = () => {
      const { totalDuration } = playHappyBirthday(ctx, masterGain, true);
      // Loop with a 1.5s gap between repeats
      loopTimerRef.current = setTimeout(schedule, (totalDuration + 1.5) * 1000);
    };

    schedule();
    setPlaying(true);
  };

  const stopMusic = () => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5);
    }
    setTimeout(() => {
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
        ctxRef.current = null;
        masterGainRef.current = null;
      }
    }, 600);
  };

  const toggle = () => {
    if (playing) {
      stopMusic();
      setPlaying(false);
    } else {
      startMusic(true); // Fade in over 5 seconds when turned on
    }
  };

  if (!visible) return null;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: playing ? 1 : [1, 1.04, 1],
      }}
      transition={{
        opacity: { duration: 0.5 },
        x: { duration: 0.5 },
        scale: playing ? { duration: 0.2 } : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
      }}
      onClick={toggle}
      title={playing ? 'Mute Happy Birthday 🎵' : 'Play Happy Birthday 🎂'}
      style={{
        position: 'fixed', top: '20px', right: '20px',
        zIndex: 1000,
        height: 48,
        borderRadius: '24px',
        padding: playing ? '0 16px' : '0 20px',
        background: playing
          ? 'linear-gradient(135deg, #ff6b9d, #9b59b6)'
          : 'linear-gradient(135deg, rgba(255, 107, 157, 0.25), rgba(155, 89, 182, 0.15))',
        border: `1px solid ${playing ? 'rgba(255,107,157,0.6)' : 'rgba(255,107,157,0.4)'}`,
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: '0.95rem',
        backdropFilter: 'blur(10px)',
        transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
        boxShadow: playing
          ? '0 0 20px rgba(255,107,157,0.6), 0 0 40px rgba(255,107,157,0.2)'
          : '0 0 15px rgba(255,107,157,0.2), 0 4px 15px rgba(0,0,0,0.2)',
      }}
    >
      <motion.span
        animate={playing ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.6, repeat: playing ? Infinity : 0, repeatDelay: 2 }}
        style={{ display: 'inline-block', fontSize: '1.3rem' }}
      >
        {playing ? '🎂' : '🎵'}
      </motion.span>
      <span style={{ display: 'inline-block' }}>
        {playing ? 'Mute' : 'Play Music'}
      </span>
    </motion.button>
  );
}
