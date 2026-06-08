import {
  AudioLines,
  ChevronDown,
  Heart,
  MessageCircle,
  Quote,
  Sparkles,
  Volume2
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import React, { useCallback, useState } from 'react';
import { CardCategory, FlashcardData, Gender, SRSLevel } from '../types';
import { GlassCard } from './GlassCard';

interface FlashcardProps {
  data: FlashcardData;
  onAnswer?: (level: SRSLevel) => void;
}

const Accordion = ({ title, icon, children, isOpen, onClick }: {
  title: string,
  icon: React.ReactNode,
  children: React.ReactNode,
  isOpen: boolean,
  onClick: () => void
}) => {
  return (
    <div className="w-full space-y-2">
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="w-full glass px-3 py-4 rounded-2xl flex items-center justify-between border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="text-white/40">{icon}</div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-white/60">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="accordion-content"
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 mb-2 max-h-[10rem] overflow-y-auto custom-scrollbar"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Flashcard: React.FC<FlashcardProps> = ({ data, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showXP, setShowXP] = useState(false);
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipStartTime = React.useRef<number | null>(null);

  // Parallax Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Swipe Motion Values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-300, 300], [15, -15]), { damping: 25, stiffness: 150 });
  const rotateYTilt = useTransform(x, [-190, 190], [-15, 15]);
  const rotateYSpring = useSpring(rotateYTilt, { damping: 25, stiffness: 150 });

  // Swipe labels opacity and scale
  const hardOpacity = useTransform(dragX, [0, -150], [0, 1]);
  const goodOpacity = useTransform(dragX, [0, 150], [0, 1]);
  const easyOpacity = useTransform(dragY, [0, -150], [0, 1]);

  const hardScale = useTransform(dragX, [0, -150], [0.5, 1.2]);
  const goodScale = useTransform(dragX, [0, 150], [0.5, 1.2]);
  const easyScale = useTransform(dragY, [0, -150], [0.5, 1.2]);

  const swipeRotate = useTransform(dragX, [-200, 200], [-15, 15]);

  // Haptic Feedback Simulation
  const triggerHaptic = useCallback((type: 'light' | 'medium') => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(type === 'light' ? 10 : 30);
      }
    } catch (e) {
      console.warn('Haptic feedback not supported:', e);
    }
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFlip = () => {
    // Only flip if not clicking internal controls
    if (isRevealed) return;
    triggerHaptic('medium');
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);

    if (newFlippedState) {
      flipStartTime.current = Date.now();
    } else {
      flipStartTime.current = null;
    }

    setOpenAccordion(null);
    handleMouseLeave();
  };

  const handleAnswerWrapper = (level: SRSLevel, direction?: { x: number, y: number }) => {
    if (flipStartTime.current) {
      const duration = Date.now() - flipStartTime.current;
      if (duration <= 3000) {
        setShowXP(true);
        triggerHaptic('medium');
        setTimeout(() => setShowXP(false), 1500);
      }
    }

    const finish = () => {
      dragX.set(0);
      dragY.set(0);
      onAnswer?.(level);
    };

    if (direction) {
      // Animate off-screen
      const targetX = direction.x * window.innerWidth * 1.5;
      const targetY = direction.y * window.innerHeight * 1.5;

      const animationX = animate(dragX, targetX, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
      const animationY = animate(dragY, targetY, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });

      Promise.all([animationX, animationY]).then(finish);
    } else {
      finish();
    }
  };

  const onDragEnd = (_: any, info: any) => {
    const threshold = 100;
    const velocityThreshold = 500;
    const { offset, velocity } = info;

    if (offset.x < -threshold || velocity.x < -velocityThreshold) {
      handleAnswerWrapper('hard', { x: -1, y: 0 });
    } else if (offset.x > threshold || velocity.x > velocityThreshold) {
      handleAnswerWrapper('good', { x: 1, y: 0 });
    } else if (offset.y < -threshold || velocity.y < -velocityThreshold) {
      handleAnswerWrapper('easy', { x: 0, y: -1 });
    } else {
      // Snap back if not swiped far enough
      animate(dragX, 0, { type: 'spring', damping: 20, stiffness: 200 });
      animate(dragY, 0, { type: 'spring', damping: 20, stiffness: 200 });
    }
  };

  const handleLongPressStart = () => {
    triggerHaptic('light');
    setIsRevealed(true);
  };

  const handleLongPressEnd = () => {
    setIsRevealed(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    setIsFavorite(!isFavorite);
  };

  const playAudio = useCallback((rate?: number) => {
    const finalRate = rate ?? playbackRate;
    triggerHaptic(finalRate === 1.0 ? 'light' : 'medium');
    console.log(`Playing audio for ${data.word_it} at rate ${finalRate}`);

    if (finalRate < 1.0) {
      setIsSlowPlaying(true);
      setTimeout(() => setIsSlowPlaying(false), 2000);
    }
  }, [data.word_it, triggerHaptic, playbackRate]);

  const handleAudioPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    longPressTimer.current = setTimeout(() => {
      playAudio(0.4);
      longPressTimer.current = null;
    }, 400);
  };

  const handleAudioPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      // It was a tap
      playAudio(1.0);
    }
  };

  const genderColor = data.gender === Gender.MASCULINE
    ? '#00f2fe'
    : data.gender === Gender.FEMININE
      ? '#ff0844'
      : '#ffffff';

  const auraColor = data.gender === Gender.MASCULINE
    ? 'rgba(0, 242, 254, 0.4)'
    : data.gender === Gender.FEMININE
      ? 'rgba(255, 8, 68, 0.4)'
      : 'rgba(255, 255, 255, 0.2)';

  return (
    <div
      className="perspective-1000 w-full max-w-[23.75rem] h-[75vh] max-h-[40rem] min-h-[31.25rem] cursor-pointer touch-none relative flex justify-center items-center"
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      onClick={handleFlip}
    >
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          >
            <span className="text-4xl font-black italic text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">+2x XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Feedback Labels */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none z-[110] flex justify-between px-12 overflow-hidden w-full">
        <motion.div
          style={{ opacity: hardOpacity, scale: hardScale }}
          className="bg-red-500 text-white px-3 py-3 rounded-2xl font-black uppercase tracking-widest shadow-2xl skew-x-[-10deg]"
        >
          Hard
        </motion.div>
        <motion.div
          style={{ opacity: goodOpacity, scale: goodScale }}
          className="bg-blue-500 text-white px-3 py-3 rounded-2xl font-black uppercase tracking-widest shadow-2xl skew-x-[10deg]"
        >
          Good
        </motion.div>
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none z-[110]">
        <motion.div
          style={{ opacity: easyOpacity, scale: easyScale }}
          className="bg-emerald-500 text-white px-3 py-4 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl flex flex-col items-center"
        >
          <Sparkles className="mb-2" />
          Easy
        </motion.div>
      </div>

      {/* Outer wrapper: parallax tilt only (no drag) */}
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 0 : rotateYSpring,
        }}
      >
        {/* Inner wrapper: flip animation + drag/swipe */}
        <motion.div
          className="relative w-full h-full preserve-3d"
          drag={isFlipped}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.8}
          onDragEnd={onDragEnd}
          style={{
            x: dragX,
            y: dragY,
            rotateZ: swipeRotate,
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
        {/* FRONT SIDE */}
        <div className={`absolute inset-0 backface-hidden border rounded-[2.5rem] overflow-hidden transition-colors ${isFlipped ? 'border-white/10 pointer-events-none' : 'border-transparent'}`}>
          {/* Breathing Aura */}
          {!isFlipped && (
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
              animate={{
                boxShadow: [
                  `0 0 40px -10px ${auraColor}`,
                  `0 0 60px -5px ${auraColor}`,
                  `0 0 40px -10px ${auraColor}`
                ],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ border: `1px solid ${genderColor}33` }}
            />
          )}

          <GlassCard
            style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
            className="h-full flex flex-col p-0 border-0 rounded-none shadow-none"
          >
            {/* Level Tag */}
            <div className="absolute top-6 right-8 z-20 text-blue-300 font-bold text-[0.625rem] uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {data.category} • {data.level}
            </div>

            {/* Cinematic Media Section */}
            <div className="w-full h-[45%] min-h-[10rem] max-h-[13.75rem] shrink-0 relative overflow-hidden group mb-2 bg-white/[0.02]">
              <img
                key={data.media_url}
                src={data.media_url}
                alt={data.word_it}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('placehold.co')) return;
                  console.error('Image load failed:', data.media_url);
                  target.src = `https://placehold.co/400x320/030712/white?text=${data.word_it}`;
                }}
              />
              {/* Bottom Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-3 pb-4 space-y-3">
              <div className="space-y-2">
                <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight flex items-center justify-center gap-2">
                  <span
                    className="opacity-60 font-extralight italic"
                    style={{ color: genderColor }}
                  >
                    {data.article}
                  </span>
                  {data.word_it}
                </h1>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onPointerDown={handleAudioPointerDown}
                    onPointerUp={handleAudioPointerUp}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all active:scale-90 ${isSlowPlaying ? 'text-blue-400 border-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.3)]' : 'text-white/20 hover:text-white/50 hover:bg-white/10'
                      }`}
                  >
                    <motion.div
                      animate={isSlowPlaying ? { scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.div>
                  </button>
                  <span className="text-[0.6875rem] font-mono text-white/50 tracking-tighter">
                    {data.phonetic}
                  </span>
                </div>
              </div>

              {/* Steam-Wipe Hint Reveal */}
              <div className="w-full mt-auto">
                <p className="text-[0.5625rem] text-white/30 uppercase tracking-[0.3em] font-bold mb-2">Hint</p>
                <div
                  className="w-full relative h-14 rounded-3xl overflow-hidden glass border-white/5 active:scale-[0.98] transition-transform"
                  onPointerDown={(e) => { e.stopPropagation(); handleLongPressStart(); }}
                  onPointerUp={(e) => { e.stopPropagation(); handleLongPressEnd(); }}
                  onPointerLeave={handleLongPressEnd}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
                    animate={{
                      filter: isRevealed ? 'blur(0px)' : 'blur(15px)',
                      opacity: isRevealed ? 1 : 0,
                      scale: isRevealed ? 1 : 0.95
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <span className="text-white/80 font-bold text-lg tracking-wide uppercase">{data.translation_en}</span>
                  </motion.div>

                  {/* Wiping Animation layer */}
                  <AnimatePresence>
                    {!isRevealed && (
                      <motion.div
                        className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-auto pb-4">
              <div className="h-1 w-6 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
            </div>
          </GlassCard>
        </div>

        {/* BACK SIDE */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 border-white/10 border rounded-[2.5rem] overflow-hidden ${!isFlipped ? 'pointer-events-none' : ''}`}>
          <GlassCard
            style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
            className="h-full flex flex-col p-4 px-3 border-0 rounded-none shadow-none bg-[#030712]/50 overflow-hidden"
          >
            {/* Speed Burner Line */}
            <div className="absolute top-0 left-0 right-0 h-[0.1875rem] z-50">
              <motion.div
                key={isFlipped ? 'active' : 'inactive'}
                initial={{ width: '100%', opacity: 1 }}
                animate={isFlipped ? { width: 0, opacity: 0.5 } : { width: '100%', opacity: 1 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              />
            </div>

            {/* Favorite Button */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleToggleFavorite}
              className="absolute top-4 left-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-white/40'}`}
              />
            </button>

            {/* Scrollable Main Block */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 mb-2 flex flex-col"
            >
              {/* Core Info */}
              <div className="text-center space-y-1 mb-3 mt-4 shrink-0">
                <div className="flex items-baseline justify-center gap-2">
                  <h2 className="text-white text-3xl font-bold tracking-tight">{data.translation_en}</h2>
                  <span className={`text-[0.625rem] font-black uppercase px-2 py-0.5 rounded-md ${data.gender === Gender.MASCULINE ? 'bg-sky-500/20 text-sky-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                    {data.gender_info_en || (data.gender === Gender.MASCULINE ? 'Masculine' : 'Feminine')}
                  </span>
                </div>
                <div className="inline-flex glass px-3 py-1 rounded-full border-white/5 text-[0.625rem] font-bold text-white/30 uppercase tracking-tighter">
                  Part Of Speech: <span className="text-white/60 ml-1">{data.category}</span>
                </div>
              </div>

              {/* Matrix View for Adjectives */}
              {(data.category === CardCategory.ADJECTIVE || data.category === CardCategory.ADVERB) && data.declensions && (
                <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                  {data.declensions.map((dec, i) => (
                    <div key={i} className="glass p-3 rounded-2xl border-white/5 flex flex-col items-center justify-center space-y-1 group hover:bg-white/10 transition-colors">
                      <span className="text-[0.5625rem] font-bold text-white/20 uppercase">{dec.label}</span>
                      <span className="text-white text-sm font-semibold tracking-tight">{dec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pb-2 shrink-0">
                <Accordion
                  title="Native Usage"
                  icon={<AudioLines className="w-4 h-4" />}
                  isOpen={openAccordion === 'usage'}
                  onClick={() => setOpenAccordion(openAccordion === 'usage' ? null : 'usage')}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><Quote className="w-5 h-5 text-blue-400/40" /></div>
                    <div className="space-y-2">
                      <p className="text-white text-[0.8125rem] font-medium leading-relaxed italic">"{data.examples?.[0]?.it}"</p>
                      <p className="text-white/40 text-[0.8125rem] leading-relaxed">{data.examples?.[0]?.en}</p>
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  title="Micro-Dialogue"
                  icon={<MessageCircle className="w-4 h-4" />}
                  isOpen={openAccordion === 'dialogue'}
                  onClick={() => setOpenAccordion(openAccordion === 'dialogue' ? null : 'dialogue')}
                >
                  <div className="space-y-4">
                    {data.dialogs.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl shadow-lg ${msg.sender === 'user'
                            ? 'bg-blue-600 rounded-tr-none text-white'
                            : 'bg-white/10 rounded-tl-none text-white/90 border border-white/10'
                          }`}>
                          <p className="text-xs font-medium leading-tight mb-1">{msg.it}</p>
                          <p className={`text-[0.625rem] ${msg.sender === 'user' ? 'text-white/60' : 'text-white/40'}`}>{msg.en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>

                <Accordion
                  title="Short Story & Tags"
                  icon={<Sparkles className="w-4 h-4" />}
                  isOpen={openAccordion === 'story'}
                  onClick={() => setOpenAccordion(openAccordion === 'story' ? null : 'story')}
                >
                  <div className="space-y-4">
                    <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-white/70 text-xs leading-relaxed font-medium italic">{data.story_it}</p>
                      <p className="text-white/30 text-[0.6875rem] leading-relaxed">{data.story_en || data.story_fa}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[0.5625rem] font-bold text-white/40 uppercase tracking-widest">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Accordion>
              </div>
            </div>

            {/* SRS Buttons */}
            <div className="shrink-0 flex flex-col justify-end pt-2 pb-1">
              <div className="flex justify-between space-x-2">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('medium'); handleAnswerWrapper('hard', { x: -1, y: 0 }); }}
                  className="flex-1 flex flex-col items-center py-2.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-200 transition-all active:scale-95 group"
                >
                  <span className="text-[0.625rem] font-black uppercase tracking-widest mb-0.5 group-hover:scale-110 transition-transform">Hard</span>
                  <span className="text-[0.5rem] font-medium text-red-400/60 lowercase">1 min</span>
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('medium'); handleAnswerWrapper('good', { x: 1, y: 0 }); }}
                  className="flex-1 flex flex-col items-center py-2.5 bg-blue-500/20 border border-blue-500/40 rounded-2xl text-blue-200 transition-all active:scale-95 group"
                >
                  <span className="text-[0.625rem] font-black uppercase tracking-widest mb-0.5 group-hover:scale-110 transition-transform">Good</span>
                  <span className="text-[0.5rem] font-medium text-blue-400/60 lowercase">1 day</span>
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('medium'); handleAnswerWrapper('easy', { x: 0, y: -1 }); }}
                  className="flex-1 flex flex-col items-center py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-200 transition-all active:scale-95 group"
                >
                  <span className="text-[0.625rem] font-black uppercase tracking-widest mb-0.5 group-hover:scale-110 transition-transform">Easy</span>
                  <span className="text-[0.5rem] font-medium text-emerald-400/60 lowercase">4 days</span>
                </button>
              </div>

              {/* Side Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-3">
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <div className="h-1 w-6 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              </div>
            </div>
          </GlassCard>
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
