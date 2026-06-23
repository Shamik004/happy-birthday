import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import StarBackground from './components/StarBackground';
import MusicToggle from './components/MusicToggle';

import IntroScene from './components/scenes/IntroScene';
import CandleScene from './components/scenes/CandleScene';
import WelcomeScene from './components/scenes/WelcomeScene';
import GiftBoxScene from './components/scenes/GiftBoxScene';
import MemoryUniverse from './components/scenes/MemoryUniverse';
import HeartsChallenge from './components/scenes/HeartsChallenge';
import PhotoGallery from './components/scenes/PhotoGallery';
import PersonalityQuiz from './components/scenes/PersonalityQuiz';
import TimeCapsule from './components/scenes/TimeCapsule';
import SecretLetter from './components/scenes/SecretLetter';
import FinalScene from './components/scenes/FinalScene';

const SCENES = [
  'intro',
  'candle',
  'welcome',
  'gift',
  'memory',
  'hearts',
  'gallery',
  'quiz',
  'capsule',
  'letter',
  'final',
];

const SCENE_LABELS = {
  intro: '✨ Intro',
  candle: '🕯️ Candles',
  welcome: '🎉 Welcome',
  gift: '🎁 Gift Box',
  memory: '🌌 Memories',
  hearts: '💕 Hearts',
  gallery: '📸 Gallery',
  quiz: '🎯 Quiz',
  capsule: '🔮 Time Capsule',
  letter: '💌 Letter',
  final: '🎆 Finale',
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  enter: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
};

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showNav, setShowNav] = useState(false);

  const goNext = () => {
    setSceneIndex(i => Math.min(i + 1, SCENES.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentScene = SCENES[sceneIndex];

  const renderScene = () => {
    switch (currentScene) {
      case 'intro': return <IntroScene onNext={goNext} />;
      case 'candle': return <CandleScene onNext={goNext} />;
      case 'welcome': return <WelcomeScene onNext={goNext} />;
      case 'gift': return <GiftBoxScene onNext={goNext} />;
      case 'memory': return <MemoryUniverse onNext={goNext} />;
      case 'hearts': return <HeartsChallenge onNext={goNext} />;
      case 'gallery': return <PhotoGallery onNext={goNext} />;
      case 'quiz': return <PersonalityQuiz onNext={goNext} />;
      case 'capsule': return <TimeCapsule onNext={goNext} />;
      case 'letter': return <SecretLetter onNext={goNext} />;
      case 'final': return <FinalScene />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0a0f 0%, #12121a 40%, #1a0a2e 100%)' }}>
      {/* Persistent star background */}
      <StarBackground />

      {/* Music toggle */}
      <MusicToggle />

      {/* Navigation dots */}
      <div style={{
        position: 'fixed', left: '16px', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 100,
      }}
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
      >
        {SCENES.map((scene, i) => (
          <motion.button
            key={scene}
            onClick={() => setSceneIndex(i)}
            title={SCENE_LABELS[scene]}
            animate={{
              scale: i === sceneIndex ? 1.4 : 1,
              backgroundColor: i === sceneIndex
                ? '#ff6b9d'
                : i < sceneIndex ? 'rgba(255,107,157,0.4)' : 'rgba(255,255,255,0.2)',
            }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              padding: 0, display: 'flex', alignItems: 'center',
              boxShadow: i === sceneIndex ? '0 0 8px rgba(255,107,157,0.8)' : 'none',
              transition: 'box-shadow 0.3s',
            }}
          />
        ))}

        {/* Nav labels on hover */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{
                position: 'absolute', left: '20px', top: 0,
                display: 'flex', flexDirection: 'column', gap: '8px',
                pointerEvents: 'none',
              }}
            >
              {SCENES.map((scene, i) => (
                <div key={scene} style={{
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,107,157,0.2)',
                  borderRadius: '8px', padding: '3px 10px',
                  fontSize: '0.7rem', color: i === sceneIndex ? '#ff6b9d' : 'rgba(255,255,255,0.6)',
                  whiteSpace: 'nowrap', fontWeight: i === sceneIndex ? 700 : 400,
                  height: '24px', display: 'flex', alignItems: 'center',
                }}>
                  {SCENE_LABELS[scene]}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scene progress indicator */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 3, zIndex: 100,
        background: 'rgba(255,255,255,0.05)',
      }}>
        <motion.div
          animate={{ width: `${((sceneIndex + 1) / SCENES.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff6b9d, #f39c12, #9b59b6)',
          }}
        />
      </div>

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ minHeight: '100vh', position: 'relative' }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
