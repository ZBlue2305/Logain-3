import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Key as KeyIcon, Lock, Sparkles, Check, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import './App.css';

// Highly Immersive Sound Synthesizer for Magical SFX
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'teleport') {
      // Mystical teleport / portal swoop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'poof') {
      // Magic puff of smoke sound (noise + sweep)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'crack') {
      // Buzzing error sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'paper') {
      // Paper rustle sound using synth noise
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      noise.connect(filter);
      filter.connect(gain);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      noise.start();
    } else if (type === 'clink') {
      // Key metallic clink
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'metal_crack') {
      // Heavy mechanical latch release
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'coin_drop') {
      // Multiple metal coin pings
      const playPing = (delay, freq, vol) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        g.gain.setValueAtTime(vol, ctx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);
        o.start(ctx.currentTime + delay);
        o.stop(ctx.currentTime + delay + 0.15);
      };
      playPing(0, 1500, 0.3);
      playPing(0.05, 1800, 0.25);
      playPing(0.12, 1300, 0.2);
    } else if (type === 'success') {
      // Happy magical triumph sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    }
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
};

export default function App() {
  const [step, setStep] = useState(1);
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/hedwigs_theme.mp3');
      audioRef.current.loop = true;
    }
  }, []);

  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setAudioStarted(true);
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (muted) {
            clearInterval(fadeInterval);
            return;
          }
          vol += 0.05;
          if (vol >= 0.4) {
            clearInterval(fadeInterval);
            audioRef.current.volume = 0.4;
          } else {
            audioRef.current.volume = vol;
          }
        }, 200); // 2 seconds fade-in!
      }).catch(e => console.log('Autoplay blocked initially, will start on click:', e));
    }
  };

  const toggleMuted = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.volume = 0.4;
      setMuted(false);
    } else {
      audioRef.current.volume = 0;
      setMuted(true);
    }
  };

  const handleNext = (nextStep) => {
    startAudio();
    setStep(nextStep);
  };

  // Magical 'Alohomora' secret bypass cheat code (3 quick clicks on Lojain logo)
  const handleLogoClick = (e) => {
    e.stopPropagation();
    startAudio();

    logoClicksRef.current += 1;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);

    if (logoClicksRef.current >= 3) {
      playSound('success');
      logoClicksRef.current = 0;
      
      // Advance stage or skip current state
      if (step < 4) {
        // Find if there is a skip event dispatcher
        const event = new CustomEvent('alohomora-cheat');
        window.dispatchEvent(event);
      }
    } else {
      playSound('clink');
      logoTimerRef.current = setTimeout(() => {
        logoClicksRef.current = 0;
      }, 1000);
    }
  };

  return (
    <div className="app-container" onClick={startAudio}>
      <div 
        className="brand-name" 
        onClick={handleLogoClick}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        title="Tap 3 times to cast Alohomora ✨"
      >
        Lojain
      </div>
      
      {/* Audio Mute Controller */}
      {audioStarted && (
        <button className="mute-btn" onClick={toggleMuted} title={muted ? "Unmute Theme" : "Mute Theme"}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <Screen1 
            key="s1" 
            onNext={() => { 
              playSound('teleport'); 
              handleNext(2); 
            }} 
          />
        )}
        {step === 2 && <Screen2 key="s2" onNext={() => handleNext(3)} />}
        {step === 3 && <Screen3 key="s3" onNext={() => handleNext(4)} />}
        {step === 4 && <Screen4 key="s4" />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SCREEN 1: CALL TO ADVENTURE
// ==========================================
function Screen1({ onNext }) {
  const [noPos, setNoPos] = useState({ top: 'auto', left: 'auto', position: 'relative' });
  const [flash, setFlash] = useState(false);
  const containerRef = useRef(null);

  // Alohomora cheat code listener
  useEffect(() => {
    const handleCheat = () => {
      onNext();
    };
    window.addEventListener('alohomora-cheat', handleCheat);
    return () => window.removeEventListener('alohomora-cheat', handleCheat);
  }, [onNext]);

  // Smooth random jumping for "No, I'm scared..." button
  const moveNo = () => {
    playSound('teleport');
    
    // Confine to viewport safely to prevent scrollbars or going off-screen
    const pad = 80;
    const x = Math.max(pad, Math.min(window.innerWidth - 250, Math.random() * (window.innerWidth - 300)));
    const y = Math.max(pad, Math.min(window.innerHeight - 100, Math.random() * (window.innerHeight - 150)));
    
    setNoPos({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      margin: 0,
      zIndex: 9999
    });
  };

  const handleYes = () => {
    playSound('success');
    setFlash(true);
    setTimeout(() => {
      onNext();
    }, 600); // Wait for bright flash overlay
  };

  return (
    <motion.div 
      className="screen-1"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Mystical Layered Magical Portal / Cipher Lock */}
      <div className="portal-wrapper">
        <motion.div 
          className="portal-ring ring-outer"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        />
        <motion.div 
          className="portal-ring ring-runic"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        />
        <motion.div 
          className="portal-ring ring-inner"
          animate={{ rotate: 180 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        
        {/* Magic Core with Floating Matrix/Cipher Lines */}
        <div className="portal-center">
          <motion.div 
            className="portal-hologram"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <div className="portal-symbols">✦ 🔮 ✦</div>
        </div>
        
        {/* Floating Sparks */}
        <div className="portal-glow-halo" />
      </div>

      <h1 className="question">
        Lojain, are you ready to solve the mystery and embark on the ultimate adventure?
      </h1>

      <div className="buttons-container">
        <motion.button 
          className="btn-yes" 
          onClick={handleYes}
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(212, 175, 55, 0.9)" }}
          whileTap={{ scale: 0.95 }}
        >
          Bring it on! 🪄
        </motion.button>
        <button 
          className="btn-no" 
          style={noPos} 
          onMouseEnter={moveNo}
          onTouchStart={moveNo} // Double protection for touch screens
        >
          No, I'm scared...
        </button>
      </div>

      {/* Magical Screen Flash Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            className="flash-overlay-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// SCREEN 2: THE THREE MAGICAL TRIALS
// ==========================================
function Screen2({ onNext }) {
  const [activePuzzle, setActivePuzzle] = useState(1);
  const [runes, setRunes] = useState([false, false, false]);

  const completePuzzle = (puzzleIndex) => {
    const newRunes = [...runes];
    newRunes[puzzleIndex - 1] = true;
    setRunes(newRunes);
    playSound('success');

    if (puzzleIndex < 3) {
      setTimeout(() => {
        setActivePuzzle(puzzleIndex + 1);
      }, 1000);
    } else {
      setTimeout(onNext, 1200); // Small pause for beautiful final rune lighting
    }
  };

  // Alohomora cheat code listener
  useEffect(() => {
    const handleCheat = () => {
      completePuzzle(activePuzzle);
    };
    window.addEventListener('alohomora-cheat', handleCheat);
    return () => window.removeEventListener('alohomora-cheat', handleCheat);
  }, [activePuzzle, completePuzzle]);

  return (
    <motion.div 
      className="screen-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 3 Celtic/Star Magical Runes Top-Right */}
      <div className="runes-dock">
        {[1, 2, 3].map((num, i) => (
          <div key={num} className={`magical-rune ${runes[i] ? 'lit' : ''}`} title={`Trial ${num}`}>
            <svg className="rune-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
              {i === 0 && <path d="M 50 15 L 20 80 L 80 80 Z M 50 15 L 50 80" fill="none" stroke="currentColor" strokeWidth="4" />}
              {i === 1 && <path d="M 30 20 L 70 80 M 70 20 L 30 80 M 50 10 L 50 90 M 10 50 L 90 50" fill="none" stroke="currentColor" strokeWidth="4" />}
              {i === 2 && <path d="M 50 10 L 85 35 L 75 75 L 25 75 L 15 35 Z M 50 10 L 50 75" fill="none" stroke="currentColor" strokeWidth="4" />}
            </svg>
            <span className="rune-spark">✦</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activePuzzle === 1 && <Puzzle1 key="p1" onComplete={() => completePuzzle(1)} />}
        {activePuzzle === 2 && <Puzzle2 key="p2" onComplete={() => completePuzzle(2)} />}
        {activePuzzle === 3 && <Puzzle3 key="p3" onComplete={() => completePuzzle(3)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ------------------------------------------
// PUZZLE 1: THE DETECTIVE'S CIPHER
// ------------------------------------------
function Puzzle1({ onComplete }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.toLowerCase().trim();
    if (val === 'echo' || val === 'صدى') {
      onComplete();
    } else {
      setError(true);
      playSound('crack');
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <motion.div 
      className="puzzle-box"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -30 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Decorative Vintage Magnifying Glass */}
      <div className="detective-mag-glass">
        <svg viewBox="0 0 100 100" className="mag-svg">
          <circle cx="45" cy="45" r="30" fill="rgba(212, 175, 55, 0.05)" stroke="#D4AF37" strokeWidth="4" className="mag-lens" />
          <path d="M 45 15 A 30 30 0 0 1 75 45" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="66" y1="66" x2="90" y2="90" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round" />
          <line x1="72" y1="72" x2="88" y2="88" stroke="#0B1226" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="68" x2="74" y2="74" stroke="#FFF" strokeWidth="4" />
        </svg>
        <div className="mag-glow" />
      </div>

      <h2 className="puzzle-heading">Puzzle I: The Detective's Cipher</h2>
      <p className="puzzle-riddle">
        "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
      </p>

      <form onSubmit={handleSubmit} className="puzzle-form">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className={`cipher-input-box ${error ? 'cipher-shake' : ''}`}
          placeholder="Type your deciphered answer..."
          autoFocus
        />
        <motion.button 
          type="submit" 
          className="btn-puzzle-submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Decipher
        </motion.button>
      </form>
    </motion.div>
  );
}

// ------------------------------------------
// PUZZLE 2: THE PIRATE KING'S NAVIGATION
// ------------------------------------------
function Puzzle2({ onComplete }) {
  // Scattered pieces tracking. We scatter them at initial random offsets.
  // Each piece is draggable and we compare its bounding rect with the target slot on release.
  const [locked, setLocked] = useState([false, false, false, false]);
  const slotsRef = useRef([]);
  const piecesRef = useRef([]);

  const puzzleFinished = locked.every(item => item === true);

  // Initialize slots and pieces refs array
  useEffect(() => {
    slotsRef.current = slotsRef.current.slice(0, 4);
    piecesRef.current = piecesRef.current.slice(0, 4);
  }, []);

  const handleDragEnd = (index) => {
    const pieceEl = piecesRef.current[index];
    const slotEl = slotsRef.current[index];
    if (!pieceEl || !slotEl) return;

    const pieceRect = pieceEl.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    // Check distance between center coordinates
    const pCenterX = pieceRect.left + pieceRect.width / 2;
    const pCenterY = pieceRect.top + pieceRect.height / 2;
    const sCenterX = slotRect.left + slotRect.width / 2;
    const sCenterY = slotRect.top + slotRect.height / 2;

    const dist = Math.hypot(pCenterX - sCenterX, pCenterY - sCenterY);

    if (dist < 60) {
      // Snapped successfully!
      const newLocked = [...locked];
      newLocked[index] = true;
      setLocked(newLocked);
      playSound('clink');

      // Check if all solved
      if (newLocked.every(v => v === true)) {
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    } else {
      playSound('poof'); // small sound denoting snap back
    }
  };

  // We can render custom scattered starting items
  // Piece index grid layout mapping:
  // 0: Row 0, Col 0. 1: Row 0, Col 1.
  // 2: Row 1, Col 0. 3: Row 1, Col 1.
  const pieceLayouts = [
    { name: "Top-Left", bgPos: "0% 0%" },
    { name: "Top-Right", bgPos: "100% 0%" },
    { name: "Bottom-Left", bgPos: "0% 100%" },
    { name: "Bottom-Right", bgPos: "100% 100%" }
  ];

  return (
    <motion.div 
      className="puzzle-box jigsaw-puzzle-container"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -30 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Decorative Cartoon Treasure Chest SVG */}
      <div className="pirate-treasure-chest">
        <svg viewBox="0 0 100 100" className="chest-svg">
          {/* Base structure */}
          <rect x="20" y="45" width="60" height="35" rx="5" fill="#8B5A2B" stroke="#4A2F13" strokeWidth="3" />
          {/* Dome lid */}
          <path d="M 20 45 C 20 20, 80 20, 80 45 Z" fill="#A0522D" stroke="#4A2F13" strokeWidth="3" />
          {/* Lock bracket */}
          <rect x="45" y="40" width="10" height="15" fill="#D4AF37" stroke="#8C6E14" strokeWidth="2" />
          <circle cx="50" cy="48" r="2" fill="#000" />
          {/* Steel bands */}
          <path d="M 30 29 L 30 80 M 70 29 L 70 80" stroke="#D4AF37" strokeWidth="3" opacity="0.8" />
        </svg>
        <div className="chest-shimmer" />
      </div>

      <h2 className="puzzle-heading">Puzzle II: The Pirate King's Navigation</h2>
      <p className="puzzle-riddle">
        Drag and drop the scrambled pieces of Luffy's Straw Hat onto the navigation grid to lock the route!
      </p>

      {/* Puzzle board containing slots */}
      <div className="jigsaw-board">
        {locked.map((isLocked, idx) => (
          <div 
            key={idx} 
            ref={el => slotsRef.current[idx] = el}
            className={`jigsaw-slot slot-${idx} ${isLocked ? 'filled' : 'empty'}`}
          >
            {isLocked ? (
              // Locked Piece inside slot (perfect alignment, no dragging)
              <div 
                className="jigsaw-piece-locked"
                style={{ 
                  backgroundImage: "url('/straw_hat.png')",
                  backgroundPosition: pieceLayouts[idx].bgPos
                }}
              />
            ) : (
              // Faded guide for what goes here
              <div className="jigsaw-slot-guide">✦</div>
            )}
          </div>
        ))}
      </div>

      {/* Drag area for scattered pieces */}
      <div className="jigsaw-dock">
        {locked.map((isLocked, idx) => {
          if (isLocked) return null; // vanish scattered piece when locked

          return (
            <motion.div
              key={idx}
              ref={el => piecesRef.current[idx] = el}
              className="jigsaw-piece-draggable"
              style={{ 
                backgroundImage: "url('/straw_hat.png')",
                backgroundPosition: pieceLayouts[idx].bgPos,
                // Add staggered scattered locations initially
                touchAction: 'none'
              }}
              drag
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={() => handleDragEnd(idx)}
              whileDrag={{ scale: 1.15, zIndex: 1000, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.6)" }}
            />
          );
        })}
      </div>

      {puzzleFinished && (
        <div className="jigsaw-success-badge">
          <Check size={16} /> Course Locked!
        </div>
      )}
    </motion.div>
  );
}

// ------------------------------------------
// PUZZLE 3: THE HIDDEN KEY
// ------------------------------------------
function Puzzle3({ onComplete }) {
  const [keys, setKeys] = useState([]);
  const keysContainerRef = useRef(null);

  useEffect(() => {
    // Generate 15 keys floating in randomized positions and vectors
    const generated = Array.from({ length: 15 }).map((_, i) => {
      // 1 special, 14 normal
      const isSpecial = i === 5;
      return {
        id: i,
        isSpecial,
        // Start randomly scattered in screen
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
        // Movement speeds (slower and easier to catch)
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        poofed: false,
        // Random wing flap offset
        flapDelay: `${Math.random() * 0.5}s`
      };
    });
    setKeys(generated);

    // Bouncing simulation loop
    let animId;
    const updatePhysics = () => {
      setKeys((prevKeys) =>
        prevKeys.map((k) => {
          if (k.poofed) return k;

          let newX = k.x + k.speedX;
          let newY = k.y + k.speedY;

          let newSpeedX = k.speedX;
          let newSpeedY = k.speedY;

          // Elastic bounce off walls
          if (newX <= 5 || newX >= 95) {
            newSpeedX = -k.speedX;
            newX = Math.max(5, Math.min(95, newX));
          }
          if (newY <= 15 || newY >= 85) {
            newSpeedY = -k.speedY;
            newY = Math.max(15, Math.min(85, newY));
          }

          return {
            ...k,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY
          };
        })
      );
      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleKeyClick = (id, isSpecial) => {
    if (isSpecial) {
      playSound('success');
      // Triggers zoom animation
      setKeys(prev => prev.map(k => k.id === id ? { ...k, speedX: 0, speedY: 0 } : k));
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      playSound('poof');
      playSound('clink');
      setKeys(prev => prev.map(k => k.id === id ? { ...k, poofed: true } : k));
    }
  };

  return (
    <motion.div 
      className="keys-room-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={keysContainerRef}
    >
      <div className="keys-room-header">
        <h2 className="puzzle-heading text-glow-white">Puzzle III: The Hidden Key</h2>
        <p className="puzzle-riddle">
          Find and snatch the specific flying key with a <strong style={{ color: '#FFF', textShadow: '0 0 5px #FFF' }}>broken/bent wing</strong> that <strong style={{ color: '#D4AF37' }}>glows slightly in white</strong>. The rest will vanish in clinks!
        </p>
      </div>

      {/* Screen flooded with Flying Keys */}
      <div className="flying-keys-arena">
        {keys.map((k) => {
          if (k.poofed) return null;

          return (
            <div
              key={k.id}
              className={`key-container ${k.isSpecial ? 'glowing-special-key' : ''}`}
              style={{
                left: `${k.x}%`,
                top: `${k.y}%`,
                transform: `translate(-50%, -50%)`
              }}
              onClick={() => handleKeyClick(k.id, k.isSpecial)}
            >
              {/* Customized Winged Key representation */}
              <div className="winged-key-visual">
                {/* Left wing flapping */}
                <div 
                  className="magical-wing wing-left"
                  style={{ animationDelay: k.flapDelay }}
                />
                
                {/* Vintage Key Core */}
                <svg viewBox="0 0 100 100" className="key-svg-body">
                  <path d="M 40 50 C 40 38, 60 38, 60 50 C 60 62, 40 62, 40 50 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                  <line x1="50" y1="58" x2="50" y2="85" stroke="currentColor" strokeWidth="6" />
                  <rect x="42" y="72" width="8" height="4" fill="currentColor" />
                  <rect x="42" y="80" width="8" height="4" fill="currentColor" />
                </svg>

                {/* Right wing flapping - Special key has a broken/bent right wing */}
                <div 
                  className={`magical-wing wing-right ${k.isSpecial ? 'wing-broken-bent' : ''}`}
                  style={{ animationDelay: k.flapDelay }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ==========================================
// SCREEN 3: VAULT OPENS & THE LETTER
// ==========================================
function Screen3({ onNext }) {
  const [vaultState, setVaultState] = useState('locked'); // 'locked' | 'unlocked' | 'opened'
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    // Initiate heavy vault opening sequence
    const t1 = setTimeout(() => {
      playSound('metal_crack');
      setVaultState('unlocked');
    }, 1200);

    const t2 = setTimeout(() => {
      playSound('teleport');
      setVaultState('opened');
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Alohomora cheat code listener
  useEffect(() => {
    const handleCheat = () => {
      onNext();
    };
    window.addEventListener('alohomora-cheat', handleCheat);
    return () => window.removeEventListener('alohomora-cheat', handleCheat);
  }, [onNext]);

  const handleOpenEnvelope = () => {
    playSound('paper');
    setEnvelopeOpened(true);
  };

  return (
    <motion.div 
      className="screen-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Heavy Mechanical Vault Door Animation */}
      {vaultState !== 'opened' && (
        <div className={`heavy-vault-door ${vaultState === 'unlocked' ? 'unlatching' : ''}`}>
          <div className="vault-outer-rim">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="rim-bolt" style={{ transform: `rotate(${i * 30}deg) translateY(-140px)` }} />
            ))}
          </div>

          <div className="vault-plate-left" />
          <div className="vault-plate-right" />

          {/* Central Rotating Wheel Latch */}
          <div className="vault-central-mechanism">
            <motion.div 
              className="vault-wheel"
              animate={vaultState === 'unlocked' ? { rotate: 540 } : { rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <div className="wheel-spoke spoke-1" />
              <div className="wheel-spoke spoke-2" />
              <div className="wheel-spoke spoke-3" />
              <div className="wheel-spoke spoke-4" />
              <div className="wheel-center-nub">
                <Lock size={32} color="#0B1226" />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Inside the Vault - Owl & Hogwarts Envelope */}
      {vaultState === 'opened' && (
        <>
          {/* Flying Hedwig dropping the Hogwarts Letter */}
          <motion.div 
            className="hedwig-owl-carrier"
            initial={{ x: '110vw', y: '-20vh', scale: 0.8 }}
            animate={{ x: '-110vw', y: '60vh', scale: 1.2 }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
          >
            {/* Detailed Vector SVG Owl */}
            <svg viewBox="0 0 200 150" className="owl-svg">
              {/* Flapping wing left */}
              <motion.path 
                d="M 50 70 C 10 30, 20 10, 40 40 C 60 70, 70 70, 70 70" 
                fill="#FFF" stroke="#DDD" strokeWidth="2" 
                animate={{ rotate: [-20, 20, -20] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                style={{ transformOrigin: '70px 70px' }}
              />
              {/* Body */}
              <ellipse cx="100" cy="80" rx="35" ry="45" fill="#FFF" stroke="#DDD" strokeWidth="2" />
              <circle cx="85" cy="65" r="8" fill="#FFF" stroke="#000" strokeWidth="2" />
              <circle cx="85" cy="65" r="4" fill="#000" />
              <circle cx="115" cy="65" r="8" fill="#FFF" stroke="#000" strokeWidth="2" />
              <circle cx="115" cy="65" r="4" fill="#000" />
              <polygon points="100,72 95,85 105,85" fill="#D4AF37" />
              <path d="M 80 120 L 85 130 M 115 120 L 110 130" stroke="#8C6E14" strokeWidth="4" />
              {/* Flapping wing right */}
              <motion.path 
                d="M 150 70 C 190 30, 180 10, 160 40 C 140 70, 130 70, 130 70" 
                fill="#FFF" stroke="#DDD" strokeWidth="2"
                animate={{ rotate: [20, -20, 20] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                style={{ transformOrigin: '130px 70px' }}
              />
            </svg>
          </motion.div>

          <div className="envelope-centerpiece-stage">
            <motion.div 
              className={`hogwarts-envelope-3d ${envelopeOpened ? 'isOpen' : ''}`}
              initial={{ scale: 0, rotate: -70, y: -400 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 90, damping: 14 }}
            >
              {/* Backside envelope backing */}
              <div className="envelope-face back-panel" />

              {/* Rotating Flap */}
              <motion.div 
                className="envelope-flap-3d"
                initial={{ rotateX: 0 }}
                animate={envelopeOpened ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* Premium Parchment Letter Sliding Out */}
              <motion.div 
                className="parchment-letter"
                initial={{ y: 0, scale: 0.95 }}
                animate={envelopeOpened ? { y: -50, scale: 1.12, zIndex: 99 } : { y: 0 }}
                transition={{ duration: 1.1, delay: 0.6, ease: "easeInOut" }}
              >
                <div className="scroll-paper-texture">
                  <div className="letter-margins">
                    <h3 className="letter-top-title">Case Solved! Vault Unlocked.</h3>
                    <p className="letter-header-salutation">Dear Lojain,</p>
                    <p className="letter-body-prose">
                      I knew that the brightest witch and greatest detective of our era would easily crack the code. They say the best gifts in life are the ones that arrive for no specific reason at all, just like the best friendships. We might have known each other for a short time, but it has truly been the most enchanting and beautiful chapter. There are endless things I admire about you, but my absolute favorite is how flawlessly you handle my absolute craziness and mischief.
                    </p>
                    <p className="letter-body-prose">
                      Here is to us—may we continue to solve life’s mysteries side by side, and grow to become the CEOs of the world’s biggest companies together, while staying safe, healthy, and full of peace.
                    </p>
                    <p className="letter-signature-block">
                      Mischief Managed. Always.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Solid V-Pocket covering the letter */}
              <div className="envelope-face envelope-front-pocket" />

              {/* Wax Seal Latch */}
              {!envelopeOpened && (
                <motion.div 
                  className="hogwarts-wax-seal"
                  onClick={handleOpenEnvelope}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="seal-monogram">H</span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Action button appears after the parchment fully emerges */}
          <AnimatePresence>
            {envelopeOpened && (
              <motion.button 
                className="btn-gringotts-proceed"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                onClick={onNext}
              >
                Enter Gringotts Vault <ArrowRight size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

// ==========================================
// SCREEN 4: GRINGOTTS PREMIUM REWARDS
// ==========================================
function Screen4() {
  return (
    <motion.div 
      className="screen-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="gringotts-vault-heading">Gringotts Premium Rewards</h2>
      <p className="gringotts-sub">
        Unlock your wizarding vaults! Tap the massive gold coins to flip and claim your premium rewards.
      </p>

      <div className="coins-vault-row">
        <GoldCoin 
          coinTitle="Feast" 
          coinSubtitle="Gryffindor Feast"
          revealImg="/shawarma.png" 
          rewardLabel="Gryffindor Feast Approved! [Claimed]" 
        />
        <GoldCoin 
          coinTitle="Sweet" 
          coinSubtitle="Sweetness of Success"
          revealImg="/basbousa.png" 
          rewardLabel="Sweetness of Success! [Claimed]" 
        />
      </div>
    </motion.div>
  );
}

// ------------------------------------------
// 3D COIN ROTATE Y REVEAL CARD
// ------------------------------------------
function GoldCoin({ coinTitle, coinSubtitle, revealImg, rewardLabel }) {
  const [flipped, setFlipped] = useState(false);

  const handleCoinClick = () => {
    if (!flipped) {
      playSound('metal_crack');
      playSound('coin_drop');
      setFlipped(true);
    }
  };

  return (
    <div className="coin-3d-wrapper">
      <motion.div 
        className="gringotts-premium-coin"
        onClick={handleCoinClick}
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={!flipped ? { 
          scale: 1.05, 
          boxShadow: "0 0 35px rgba(212, 175, 55, 0.8)",
          filter: "brightness(1.15)"
        } : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        {/* Front Face: High-Detail Gringotts Gold Coin */}
        <div className="coin-side coin-face-front">
          <div className="coin-relief-edge">
            <div className="coin-runic-orbit">
              <span>✦ GRINGOTTS ✦ SECURE ✦ VAULT ✦ REWARD ✦</span>
            </div>
            
            {/* Goblin Crest/Key Emblem center */}
            <div className="coin-central-crest">
              <svg viewBox="0 0 100 100" className="coin-crest-svg">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 35 45 C 35 25, 65 25, 65 45 M 50 45 L 50 75" fill="none" stroke="currentColor" strokeWidth="3" />
                <rect x="42" y="60" width="16" height="8" rx="2" fill="currentColor" />
                <circle cx="50" cy="45" r="4" fill="currentColor" />
              </svg>
              <div className="coin-value-text">{coinTitle}</div>
            </div>

            <div className="coin-filigree-decor">✦ ✦ ✦</div>
          </div>
        </div>

        {/* Back Face: Premium Reward Card Reveal */}
        <div className="coin-side coin-face-back">
          <div className="coin-back-container">
            <div className="reward-glow-sunburst" />
            <div className="gringotts-certificate-border" />
            
            <div className="voucher-header">GRINGOTTS OFFICIAL VOUCHER</div>
            
            <div className="reward-image-wrapper">
              <img src={revealImg} alt={coinSubtitle} className="reward-vector-img" />
              <div className="image-halo-glow" />
            </div>
            
            <h4 className="reward-card-title">{coinSubtitle}</h4>
            <div className="reward-divider">✦ ✦ ✦</div>
            <p className="reward-card-status">{rewardLabel}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
