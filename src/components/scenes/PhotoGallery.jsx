import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all real photos
import holi from '../../assets/WhatsApp Image 2026-06-23 at 02.50.30 (1).jpeg';
import riverside from '../../assets/WhatsApp Image 2026-06-23 at 02.50.30.jpeg';
import saree from '../../assets/WhatsApp Image 2026-06-23 at 02.50.31.jpeg';
import bench from '../../assets/WhatsApp Image 2026-06-23 at 02.50.55.jpeg';
import hands1 from '../../assets/WhatsApp Image 2026-06-23 at 02.52.33 (1).jpeg';
import hands2 from '../../assets/WhatsApp Image 2026-06-23 at 02.52.33.jpeg';

const PHOTOS = [
  {
    src: riverside,
    caption: 'Golden Smile 🌊',
    date: 'By the River',
    story: 'Dariya ki lehron se zyada sukoon mujhe teri muskaan deti hai,\nHar baar tujhe dekh kar lagta hai, meri duniya bas tu hi hai. 🌊',
    tag: 'Her',
    accentColor: '#f39c12',
    rotate: -3,
    size: 'tall',
  },

  {
    src: bench,
    caption: 'Golden Hour 🌿',
    date: 'Park Days',
    story: 'Us shaam dhoop bhi tere saath thodi der aur rukna chahti thi,\nShayad usse bhi pata tha ki tu meri sabse khoobsurat yaad banne waali thi. 🌿',
    tag: 'Her',
    accentColor: '#27ae60',
    rotate: 2,
    size: 'tall',
  },
  {
    src: hands2,
    caption: 'Together ❤️',
    date: 'Us',
    story: 'Jab tera haath mere haath mein aata hai,\nTab har mushkil raasta bhi ghar jaisa lagta hai. ❤️',
    tag: 'Us',
    accentColor: '#ff6b9d',
    rotate: -2,
    size: 'square',
    special: true,
  },

  {
    src: holi,
    caption: 'Holi Magic 🎨',
    date: 'Festival of Colours',
    story: 'Rang toh uss din bahut the, par meri nazar sirf tujh par thi,\nHar rang feeka lag raha tha, kyunki sabse khoobsurat rang tu hi thi. 🎨',
    tag: 'Vibes',
    accentColor: '#e91e8c',
    rotate: 4,
    size: 'tall',
  },

  {
    src: saree,
    caption: 'Graceful ✨',
    date: 'Traditional Days',
    story: 'Sach kahoon?\nIss tasveer ko jitni baar dekhta hoon, utni baar lagta hai ki tumhe dekh kar shabdon ki kami pad jaati hai. ✨',
    tag: 'Her',
    accentColor: '#9b59b6',
    rotate: 3,
    size: 'tall',
  },


  {
    src: hands1,
    caption: 'Holding On 💛',
    date: 'Always',
    story: 'Main vaada karta hoon, chahe waqt kitna bhi badal jaaye,\nMera haath hamesha tere haath ko waise hi thaame rahega jaise aaj hai. 💛',
    tag: 'Us',
    accentColor: '#f39c12',
    rotate: -1,
    size: 'tall',
    special: true,
  }
  ,
];

function PolaroidCard({ photo, index, onZoom }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (!flipped) setFlipped(true);
    else setFlipped(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: photo.rotate }}
      animate={{ opacity: 1, y: 0, rotate: flipped ? 0 : photo.rotate }}
      transition={{ delay: index * 0.12, duration: 0.6, type: 'spring', stiffness: 100 }}
      style={{ perspective: 1000, cursor: 'pointer', position: 'relative' }}
      whileHover={{ scale: 1.06, rotate: 0, zIndex: 10, transition: { duration: 0.25 } }}
      onClick={handleClick}
      onDoubleClick={() => onZoom(photo)}
    >
      {/* Glow ring for "Us" photos */}
      {photo.special && (
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            position: 'absolute', inset: -6,
            borderRadius: '6px',
            background: `linear-gradient(135deg, ${photo.accentColor}60, transparent, ${photo.accentColor}40)`,
            filter: 'blur(6px)',
            zIndex: 0,
          }}
        />
      )}

      {/* Flip card */}
      <div style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4,0.2,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        position: 'relative', zIndex: 1,
      }}>
        {/* FRONT */}
        <div style={{
          backfaceVisibility: 'hidden',
          background: '#fff',
          borderRadius: '4px',
          padding: '8px 8px 32px 8px',
          boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)`,
          width: photo.size === 'tall' ? '150px' : '145px',
          transition: 'box-shadow 0.3s',
        }}>
          {/* Photo */}
          <div style={{
            width: '100%',
            height: photo.size === 'tall' ? '190px' : '145px',
            overflow: 'hidden', borderRadius: '2px',
            background: '#eee',
          }}>
            <img
              src={photo.src}
              alt={photo.caption}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: photo.src === saree ? 'center top' : 'center center',
                display: 'block',
              }}
            />
          </div>
          {/* Caption */}
          <div style={{ paddingTop: '8px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Dancing Script, cursive',
              fontSize: '0.88rem', color: '#333',
              lineHeight: 1.3, marginBottom: '2px',
            }}>
              {photo.caption}
            </p>
            <p style={{ fontSize: '0.62rem', color: '#999', fontFamily: 'Inter, sans-serif' }}>
              {photo.date}
            </p>
          </div>

          {/* Tag badge */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: photo.accentColor,
            color: '#fff', fontSize: '0.55rem',
            padding: '2px 6px', borderRadius: '8px',
            fontFamily: 'Inter, sans-serif', fontWeight: 700,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            {photo.tag}
          </div>

          {/* Double-click hint */}
          <div style={{
            position: 'absolute', bottom: 6, left: 0, right: 0,
            textAlign: 'center', fontSize: '0.55rem',
            color: '#bbb', fontFamily: 'Inter, sans-serif',
          }}>
            tap flip · dbl-tap zoom
          </div>
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute', top: 0, left: 0,
          width: photo.size === 'tall' ? '150px' : '145px',
          height: '100%',
          background: 'linear-gradient(160deg, #1e0a2e, #2d1b4e)',
          borderRadius: '4px',
          border: `1.5px solid ${photo.accentColor}60`,
          boxShadow: `0 0 20px ${photo.accentColor}30`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 14px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: '1.8rem', marginBottom: '10px',
            filter: `drop-shadow(0 0 8px ${photo.accentColor})`,
          }}>
            {photo.special ? '❤️' : '✨'}
          </div>
          <div style={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.8, fontStyle: 'italic',
          }}>
            {photo.story.split('\n').map((line, i) => (
              <p key={i} style={{ margin: i === 0 ? '0 0 6px' : '0' }}>{line}</p>
            ))}
          </div>
          <div style={{
            marginTop: '12px', fontSize: '0.65rem',
            color: photo.accentColor, fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
          }}>
            — Shamik ❤️
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ZoomOverlay({ photo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(5,2,15,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        flexDirection: 'column', gap: '16px',
      }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.6, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '6px',
          padding: '10px 10px 20px',
          maxWidth: '360px', width: '100%',
          boxShadow: `0 0 60px ${photo.accentColor}50, 0 30px 80px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Full-size image */}
        <div style={{
          width: '100%', height: '420px',
          overflow: 'hidden', borderRadius: '3px', marginBottom: '12px',
        }}>
          <img
            src={photo.src}
            alt={photo.caption}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: photo.src === saree ? 'center top' : 'center center',
            }}
          />
        </div>
        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <p style={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: '1.1rem', color: '#333', marginBottom: '6px',
          }}>
            {photo.caption}
          </p>
          <div style={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: '0.92rem', color: '#555',
            lineHeight: 1.9, fontStyle: 'italic',
          }}>
            {photo.story.split('\n').map((line, i) => (
              <p key={i} style={{ margin: i === 0 ? '0 0 8px' : '0' }}>{line}</p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Caption outside the card */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
        }}
      >
        Click anywhere to close
      </motion.p>
    </motion.div>
  );
}

export default function PhotoGallery({ onNext }) {
  const [zoomed, setZoomed] = useState(null);

  return (
    <div className="scene" style={{ zIndex: 1, padding: '30px 16px 40px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '10px' }}
      >
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,107,157,0.12)',
          border: '1px solid rgba(255,107,157,0.3)',
          borderRadius: '50px', padding: '5px 18px',
          color: '#ff6b9d', fontSize: '0.75rem',
          letterSpacing: '2px', textTransform: 'uppercase',
          marginBottom: '12px', fontWeight: 600,
        }}>
          📸 Our Story in Photos
        </div>

        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          marginBottom: '8px',
          color: '#fff',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #f39c12, #ff6b9d, #9b59b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Memory Gallery
          </span>{' '}
          <span style={{ display: 'inline-block' }}>❤️</span>
        </h2>

        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
          Tap to flip & read the story · Double-tap to zoom in full
        </p>
      </motion.div>

      {/* Gallery grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'flex-end',
        maxWidth: '820px',
        margin: '20px auto',
        position: 'relative', zIndex: 2,
      }}>
        {PHOTOS.map((photo, i) => (
          <PolaroidCard
            key={i}
            photo={photo}
            index={i}
            onZoom={setZoomed}
          />
        ))}
      </div>

      {/* Shayari banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '24px', padding: '0 16px' }}
      >
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(255,107,157,0.1), rgba(155,89,182,0.1))',
          border: '1px solid rgba(255,107,157,0.3)',
          borderRadius: '16px',
          padding: '22px 32px',
          maxWidth: '580px',
          boxShadow: '0 0 30px rgba(255,107,157,0.1)',
          position: 'relative',
        }}>
          {/* Decorative quote mark */}
          <div style={{
            position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
            fontSize: '2.2rem', lineHeight: 1,
            background: 'linear-gradient(135deg, #ff6b9d, #9b59b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>❝</div>

          {[
            'Bees saal pehle rab ne ek khoobsurat tohfa banaya tha,',
            'Teen mahine pehle us tohfe ne meri zindagi ko sajaya tha.',
            'Ab har pal, har khwaab mein tu hi tu nazar aaye,',
            'Happy Birthday Megha, meri duniya yun hi muskuraaye. ❤️',
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.2, duration: 0.5 }}
              style={{
                fontFamily: 'Dancing Script, cursive',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                color: i === 3 ? '#ff6b9d' : 'rgba(255,255,255,0.88)',
                lineHeight: 1.9,
                margin: 0,
                fontStyle: 'italic',
                fontWeight: i === 3 ? 700 : 400,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{ textAlign: 'center' }}
      >
        <button className="btn-glow" onClick={onNext}>
          Continue 💫
        </button>
      </motion.div>

      {/* Zoom overlay */}
      <AnimatePresence>
        {zoomed && <ZoomOverlay photo={zoomed} onClose={() => setZoomed(null)} />}
      </AnimatePresence>
    </div>
  );
}
