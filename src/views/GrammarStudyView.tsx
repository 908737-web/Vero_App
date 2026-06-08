import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, Lock, Play, X, Sparkles, BookOpen, GraduationCap, Compass, FileText, Landmark, Trophy, RotateCcw, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { DynamicHomeBar } from "../components/DynamicHomeBar";

interface Lesson {
  id: string;
  title: string;
  topic: string;
  progress: number; // 0 to 100
  status: "locked" | "available" | "completed";
  color: string;
  tag?: string;
  subtitle?: string;
  tags?: string[];
}

const DUMMY_LESSONS: Lesson[] = [
  {
    id: "capsule_genere",
    title: "Object Identity (Il Genere)",
    topic: "Discover gender in Venice",
    subtitle: "Discover gender in Venice",
    progress: 100,
    status: "completed",
    color: "#00ffcc", // Neon Cyan/Green glowing color
    tag: "A1 • Essential",
    tags: ["A1", "Essential"],
  },
  {
    id: "capsule_essere",
    title: "The Starting Point (Essere)",
    topic: "Being and presence",
    subtitle: "Being and presence",
    progress: 45,
    status: "available",
    color: "#3b82f6", // Blue
    tag: "A1 • Irregular Verbs",
    tags: ["A1", "Irregular Verbs"],
  },
];

interface NarrativeSpecimen {
  gender: string;
  ending: string;
  pluralEnding: string;
  exampleSingular: string;
  examplePlural: string;
  translation: string;
  notes: string;
}

interface NarrativeConjugation {
  subject: string;
  level: string;
  verb: string;
  translation: string;
  example: string;
  notes: string;
}

interface NarrativeContent {
  concept: string;
  conceptSubtitle: string;
  anatomy: string;
  deepExplanation: string;
  specimens?: NarrativeSpecimen[];
  conjugations?: NarrativeConjugation[];
  contexts: {
    category: string;
    icon: any;
    title_it: string;
    translation_en: string;
  }[];
}

const NARRATIVE_DATA: Record<string, NarrativeContent> = {
  "capsule_genere": {
    concept: "In Venice, everything has a spirit and a gender. The water canal behaves differently from the gondola. To govern this city, first you must uncover the hidden spirit of its words...",
    conceptSubtitle: "Discover how nouns breathe life, structure, and character into daily conversation in Venice.",
    anatomy: "Words ending in -O possess a masculine spirit (Maschile) and shift to -I in plural, while those ending with -A endue a feminine spirit (Femminile) shifting to -E in plural.",
    deepExplanation: "Italian nouns are assigned grammatical gender. While living beings follow natural gender, objects have arbitrary assignments that dictate the form of adjectives and articles. Master the singular-to-plural transformation to unlock native fluency on the streets.",
    specimens: [
      { gender: "Maschile (Masculine)", ending: "-o", pluralEnding: "-i", exampleSingular: "Il gatto", examplePlural: "I gatti", translation: "The cat / The cats", notes: "Covers male beings, animals, days, months, tree names, and metals." },
      { gender: "Femminile (Feminine)", ending: "-a", pluralEnding: "-e", exampleSingular: "La barca", examplePlural: "Le barche", translation: "The boat / The boats", notes: "Covers female beings, sciences, fruits, and continent names." },
      { gender: "Dual Gender Clue", ending: "-e", pluralEnding: "-i", exampleSingular: "Il fiore / La chiave", examplePlural: "I fiori / Le chiavi", translation: "The flower (M) / The key (F)", notes: "Can be masculine or feminine; always study with their accompanying article." }
    ],
    contexts: [
      { category: "Academic", icon: GraduationCap, title_it: "Il professore / La libreria", translation_en: "The professor (Maschile) / The bookstore (Femminile)" },
      { category: "Street/Cafe", icon: Compass, title_it: "Il caffè / La pizza", translation_en: "The coffee (Maschile) / The pizza (Femminile)" },
      { category: "Administrative", icon: FileText, title_it: "Il passaporto / La firma", translation_en: "The passport (Maschile) / The signature (Femminile)" },
    ]
  },
  "capsule_essere": {
    concept: "The verb Essere (To Be) is not mere letters; it is the genesis of your existence in Italy. Without it, you can neither declare who you are, what you feel, nor where you stand.",
    conceptSubtitle: "Master the wild shape-shifter verb that serves as the foundation of all active and passive communication.",
    anatomy: "Being completely irregular, Essere shifts from 'Sono' to 'Sei' and 'È'. Rather than committing it to passive memory, perceive it as a moving tide of identity.",
    deepExplanation: "Essere is used to express identity, nationality, profession, permanent states, and acts as the auxiliary (helper) verb for compound tenses of reflexives or verbs of movement.",
    conjugations: [
      { subject: "Io", level: "1st Sg", verb: "SONO", translation: "I am", example: "Io sono felice (I am happy)", notes: "Also used for 'Loro' (They), differentiated purely by context." },
      { subject: "Tu", level: "2nd Sg", verb: "SEI", translation: "You are (informal)", example: "Tu sei qui (You are here)", notes: "Informal singular format used with friends and peers." },
      { subject: "Lui / Lei", level: "3rd Sg", verb: "È", translation: "He / She / It is", example: "Lei è stanca (She is tired)", notes: "Use capitalized 'Lei' for formal 'You' interaction." },
      { subject: "Noi", level: "1st Pl", verb: "SIAMO", translation: "We are", example: "Noi siamo pronti (We are ready)", notes: "Unified collective reference for plural actors." },
      { subject: "Voi", level: "2nd Pl", verb: "SIETE", translation: "You all are", example: "Voi siete qui (You all are here)", notes: "Addresses a group of people directly." },
      { subject: "Loro", level: "3rd Pl", verb: "SONO", translation: "They are", example: "Loro sono stanchi (They are tired)", notes: "Matches the spelling of 'Io sono' in 1st Person Singular." }
    ],
    contexts: [
      { category: "Academic", icon: GraduationCap, title_it: "Sono uno studente a Ca' Foscari.", translation_en: "I am a student at Ca' Foscari." },
      { category: "Street/Cafe", icon: Compass, title_it: "Dov'è la stazione?", translation_en: "Where is the station?" },
      { category: "Administrative", icon: FileText, title_it: "Sono qui per il visto.", translation_en: "I am here for the visa." },
    ]
  }
};

const GAME_PLAYLOADS: Record<string, {
  mechanic: string;
  instruction: string;
  leftLabel: string;
  rightLabel: string;
  words: { word: string; correct: 'left' | 'right'; type: string }[];
}> = {
  "capsule_genere": {
    mechanic: "swipe_sort",
    instruction: "SWIPE RIGHT: Maschile (O) | SWIPE LEFT: Femminile (A)",
    leftLabel: "Femminile (A)",
    rightLabel: "Maschile (O)",
    words: [
      { word: "Il Canale", correct: "right", type: "Maschile" },
      { word: "La Gondola", correct: "left", type: "Femminile" },
      { word: "Il Vaporetto", correct: "right", type: "Maschile" },
      { word: "La Notte", correct: "left", type: "Femminile" },
      { word: "Il Gatto", correct: "right", type: "Maschile" },
      { word: "La Barca", correct: "left", type: "Femminile" },
      { word: "Il Tempio", correct: "right", type: "Maschile" },
      { word: "La Piazza", correct: "left", type: "Femminile" }
    ]
  },
  "capsule_essere": {
    mechanic: "swipe_sort",
    instruction: "SWIPE RIGHT: Singolare (Sono/Sei/È) | SWIPE LEFT: Plurale (Siamo/Siete/Sono)",
    leftLabel: "Plurale (We/You/They)",
    rightLabel: "Singolare (I/You/He)",
    words: [
      { word: "Io sono", correct: "right", type: "Singular" },
      { word: "Noi siamo", correct: "left", type: "Plurale" },
      { word: "Tu sei", correct: "right", type: "Singular" },
      { word: "Loro sono", correct: "left", type: "Plurale" },
      { word: "Voi siete", correct: "left", type: "Plurale" },
      { word: "Lei è", correct: "right", type: "Singular" },
      { word: "Lui è", correct: "right", type: "Singular" }
    ]
  }
};

import { ThemeColors } from "../types";

interface GrammarStudyViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  onStartStudy?: () => void;
  onRegisterBackInterceptor?: (fn: (() => boolean) | null) => void;
  currentTheme?: ThemeColors;
}

export const GrammarStudyView: React.FC<GrammarStudyViewProps> = ({
  onBack,
  isDarkMode,
  onStartStudy,
  onRegisterBackInterceptor,
  currentTheme,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>(DUMMY_LESSONS);
  const [activeIndex, setActiveIndex] = useState(1); // Start at the first available (index 1)
  const [zoomingLessonId, setZoomingLessonId] = useState<string | null>(null);
  const [selectedLessonForNarrative, setSelectedLessonForNarrative] = useState<Lesson | null>(null);
  const [selectedContextIndex, setSelectedContextIndex] = useState(0);

  // Station 3 - The Neon Arena Gameplay States
  const [arenaState, setArenaState] = useState<'reading' | 'transitioning' | 'playing' | 'reward' | 'completed'>('reading');
  const [countdown, setCountdown] = useState<number | string>(3);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [droplets, setDroplets] = useState<{ id: number; delay: number }[]>([]);
  const [shakeActive, setShakeActive] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Station 5 - The Liquid Ceremony States
  const [liquidLevel, setLiquidLevel] = useState(45);
  const [isMaxedOut, setIsMaxedOut] = useState(false);
  const [rewardDroplets, setRewardDroplets] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [showContinueBtn, setShowContinueBtn] = useState(false);

  // Transition and countdown effect
  useEffect(() => {
    if (arenaState !== 'transitioning') return;
    setCountdown(3);
    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else if (currentCount === 0) {
        setCountdown("GO!");
      } else {
        clearInterval(interval);
        setArenaState('playing');
      }
    }, 900);
    return () => clearInterval(interval);
  }, [arenaState]);

  // Clean up flying reward droplets
  useEffect(() => {
    if (droplets.length > 0) {
      const timer = setTimeout(() => {
        setDroplets([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [droplets]);

  // Reset arena state when selected lesson changes
  useEffect(() => {
    setArenaState('reading');
    setLiquidLevel(45);
    setIsMaxedOut(false);
    setRewardDroplets([]);
    setShowContinueBtn(false);
  }, [selectedLessonForNarrative]);

  // Trigger this effect when entering the 'reward' state (Station 5 - The Liquid Ceremony)
  useEffect(() => {
    if (arenaState === 'reward') {
      setShowContinueBtn(false);
      // Generate reward droplets falling from top based on score
      const drops = Array.from({ length: score }).map((_, index) => ({
        id: index,
        left: Math.max(10, Math.min(90, 15 + Math.random() * 70)), // random percentage for left positioning
        delay: index * 0.15, // staggered falling delays
      }));
      setRewardDroplets(drops);

      // Wait for the droplets to form, then animate liquid rising
      const levelTimer = setTimeout(() => {
        // Calculate new level: starts at lesson's starting progress, every correct answer adds a portion
        const currentInitialProgress = selectedLessonForNarrative ? selectedLessonForNarrative.progress : 45;
        const wordsCount = GAME_PLAYLOADS[selectedLessonForNarrative?.id as keyof typeof GAME_PLAYLOADS]?.words?.length || 8;
        const progressDelta = (score / wordsCount) * (100 - currentInitialProgress);
        const newLevel = Math.min(100, Math.round(currentInitialProgress + progressDelta));
        setLiquidLevel(newLevel);
        
        if (newLevel >= 100) {
          setTimeout(() => setIsMaxedOut(true), 1200); // Wait for liquid to rise before pulse
        }

        // Update the lesson progress list state to trigger visual updates back on the timeline
        setLessons(prev => prev.map(les => {
          if (les.id === selectedLessonForNarrative?.id) {
            const updatedProgress = Math.min(100, Math.round(les.progress + progressDelta));
            const updatedStatus = updatedProgress >= 100 ? "completed" as const : les.status;
            return {
              ...les,
              progress: updatedProgress,
              status: updatedStatus
            };
          }
          return les;
        }));
      }, 1500); // Delay for droplets animation

      // Show Continua button after a delay of 3.2 seconds
      const btnTimer = setTimeout(() => {
        setShowContinueBtn(true);
      }, 3200);

      return () => {
        clearTimeout(levelTimer);
        clearTimeout(btnTimer);
      };
    }
  }, [arenaState, score, selectedLessonForNarrative]);

  // Register parent back interceptor when narrative modal / arena state changes
  useEffect(() => {
    if (onRegisterBackInterceptor) {
      onRegisterBackInterceptor(() => {
        if (arenaState !== 'reading') {
          setArenaState('reading');
          return true; // handled
        }
        if (selectedLessonForNarrative) {
          setSelectedLessonForNarrative(null);
          return true; // handled
        }
        return false; // not handled
      });
    }
    return () => {
      if (onRegisterBackInterceptor) {
        onRegisterBackInterceptor(null);
      }
    };
  }, [selectedLessonForNarrative, arenaState, onRegisterBackInterceptor]);

  // Handle Swipe/Scroll (simplified with buttons or drag for now)
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    if (zoomingLessonId || selectedLessonForNarrative) return; // ignore during transition
    const swipeThreshold = 50;
    if (offset.y < -swipeThreshold && activeIndex < lessons.length - 1) {
      // Swipe Up (next)
      setActiveIndex(activeIndex + 1);
    } else if (offset.y > swipeThreshold && activeIndex > 0) {
      // Swipe Down (prev)
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleImmerse = (lesson: Lesson) => {
    setZoomingLessonId(lesson.id);
    setSelectedContextIndex(0); // Reset context tab
    setTimeout(() => {
      setSelectedLessonForNarrative(lesson);
      setZoomingLessonId(null); // Reset zooming
    }, 700);
  };


  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col fluid-pathway-container"
    >
      {/* Ambient Venetian Cyberpunk Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="ambient-particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 w-full max-w-[26.875rem] mx-auto relative h-full flex flex-col">
        {/* Dynamic Cinematic Background based on active lesson color */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: `${lessons[activeIndex]?.color || '#00ffcc'}08` }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
            style={{ backgroundColor: lessons[activeIndex]?.color || '#00ffcc' }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
        </div>

        {/* Winding Venetian River scrolling flow container */}
        <div 
          className="flex-1 overflow-y-auto pt-12 pb-32 px-6 relative z-10 scrollbar-none flex flex-col"
          onScroll={(e) => {
            // Find which card is closest to the viewport center and update active color
            const scrollTop = e.currentTarget.scrollTop;
            const threshold = 120;
            if (scrollTop > threshold && activeIndex === 0) {
              setActiveIndex(1);
            } else if (scrollTop <= threshold && activeIndex === 1) {
              setActiveIndex(0);
            }
          }}
        >
          {/* Glowing central river canal pathway flow */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-b from-cyan-500/5 via-[#3b82f6]/5 to-emerald-500/5 blur-3xl pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#00ffcc]/30 via-[#3b82f6]/20 to-transparent pointer-events-none shadow-[0_0_20px_rgba(0,255,204,0.3)]" />

          {/* Winding vertical aligned capsule cards with subtle padding */}
          <div className="w-full flex flex-col items-center gap-14 py-8 relative z-10">
            {lessons.map((lesson, idx) => {
              const isActive = activeIndex === idx;
              const isZooming = zoomingLessonId === lesson.id;
              const isAnyZooming = zoomingLessonId !== null;

              // Alternating alignment layout (left offset, right offset)
              const windingAlign = idx % 2 === 0 ? "self-start pl-2" : "self-end pr-2";

              return (
                <motion.div
                  key={lesson.id}
                  className={`w-[85%] max-w-[310px] h-[185px] relative ${windingAlign}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: isAnyZooming ? (isZooming ? 1 : 0) : 1,
                    scale: isZooming ? 3.5 : (isAnyZooming ? 0.6 : (isActive ? 1.03 : 0.95)),
                    y: isZooming ? -100 : 0,
                    filter: isAnyZooming && !isZooming ? "blur(12px)" : "blur(0px)",
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 140, 
                    damping: 20 
                  }}
                  style={{
                    zIndex: isZooming ? 200 : (isActive ? 50 : 20),
                  }}
                  onClick={() => {
                    if (zoomingLessonId) return;
                    if (!isActive) {
                      setActiveIndex(idx);
                    } else if (lesson.status !== "locked") {
                      handleImmerse(lesson);
                    }
                  }}
                >
                  {/* Glass Capsule Vessel container */}
                  <div className="relative w-full h-full glass-capsule flex flex-col justify-between overflow-hidden cursor-pointer select-none">
                    
                    {/* Glowing highlight ring around active capsule */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]"
                        style={{ boxShadow: `0 0 25px ${lesson.color}25, inset 0 0 15px ${lesson.color}15` }}
                      />
                    )}

                    {/* Highly polished static glass reflection layer */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                    {/* Liquid Filling Level (dynamic progress height & neon color gradient) */}
                    <motion.div
                      className={`liquid-fill ${lesson.progress === 100 ? "fully-filled" : ""}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${lesson.progress}%` }}
                      transition={{
                        duration: 1.6,
                        ease: "easeOut",
                        delay: isActive ? 0.4 : 0.1,
                      }}
                      style={{
                        background: `linear-gradient(180deg, ${lesson.color}d0 0%, ${lesson.color}33 100%)`,
                        boxShadow: `0 0 35px ${lesson.color}60, inset 0 0 25px ${lesson.color}35`,
                      }}
                    >
                      {/* Interactive microbubbles inside the fluid */}
                      {isActive && [...Array(6)].map((_, bi) => (
                        <div
                          key={bi}
                          className="micro-bubble"
                          style={{
                            left: `${15 + Math.random() * 70}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Glass Vessel content layer */}
                    <div className={`relative z-20 w-full h-full p-6 flex flex-col justify-between transition-opacity duration-300 ${isZooming ? "opacity-0" : "opacity-100"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          {lesson.tag && (
                            <span 
                              className="inline-block px-2.5 py-0.5 text-[9px] font-bold text-white/95 border border-white/10 rounded-full mb-3 tracking-wide backdrop-blur-md"
                              style={{ 
                                backgroundColor: `${lesson.color}20`,
                                textShadow: `0 0 8px ${lesson.color}40`,
                                borderColor: `${lesson.color}33`
                              }}
                            >
                              {lesson.tag}
                            </span>
                          )}
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 leading-none select-none">
                            {lesson.topic}
                          </p>
                          <h3 
                            className="text-lg font-extrabold text-white tracking-tight break-words select-none Persian-font font-display"
                            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                          >
                            {lesson.title}
                          </h3>
                        </div>

                        {/* Complete / Status Play Circle */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-lg shrink-0 transition-all select-none backdrop-blur-md"
                          style={{
                            backgroundColor: isActive ? `${lesson.color}25` : "rgba(255,255,255,0.03)",
                            borderColor: isActive ? `${lesson.color}50` : "rgba(255,255,255,0.12)",
                            boxShadow: isActive ? `0 0 15px ${lesson.color}40` : "none"
                          }}
                        >
                          {lesson.status === "completed" ? (
                            <Check size={18} className="text-[#00ffcc]" style={{ filter: "drop-shadow(0 0 8px #00ffcc)" }} />
                          ) : lesson.status === "locked" ? (
                            <Lock size={16} className="text-white/30" />
                          ) : (
                            <Play size={16} className="text-white fill-white ml-0.5" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" }} />
                          )}
                        </div>
                      </div>

                      {/* Footer stats / CTA button */}
                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col select-none">
                          <span 
                            className="text-2xl font-black text-white leading-none tracking-tight"
                            style={{ textShadow: `0 0 10px ${lesson.color}40` }}
                          >
                            {lesson.progress}%
                          </span>
                          <span className="text-[9px] uppercase tracking-widest font-black text-white/40 mt-1">
                            {lesson.progress === 100 ? "Maturity" : "Fluidity"}
                          </span>
                        </div>

                        {isActive && lesson.status !== "locked" && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xl bg-white text-[#020617] transition-all hover:bg-opacity-90 active:scale-95 duration-150"
                            style={{ 
                              boxShadow: `0 8px 25px ${lesson.color}40`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImmerse(lesson);
                            }}
                          >
                            {lesson.status === "completed" ? "Review" : "Immerse"}
                          </motion.button>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Micro-instructions caption at the bottom of flow */}
          <div className="text-center pt-8 pb-4 text-white/30 text-[10px] tracking-wider uppercase select-none">
            Scroll downstream to discover Venice
          </div>
        </div>

      </div>

      {/* Narrative Canvas Interactive Overlay with Station 3: The Neon Arena */}
      <AnimatePresence>
        {selectedLessonForNarrative && (() => {
          const content = NARRATIVE_DATA[selectedLessonForNarrative.id];
          const activePayload = GAME_PLAYLOADS[selectedLessonForNarrative.id as keyof typeof GAME_PLAYLOADS] || GAME_PLAYLOADS["capsule_genere"];
          const activeWord = activePayload.words[currentWordIndex] || { word: "Terminato", correct: "right", type: "Done" };

          const handleDrag = (event: any, info: any) => {
            if (info.offset.x > 40) {
              setDragDirection('right');
            } else if (info.offset.x < -40) {
              setDragDirection('left');
            } else {
              setDragDirection(null);
            }
          };

          const handleDragEndAction = (event: any, info: any) => {
            setDragDirection(null);
            const offsetThreshold = 80;
            const dir = info.offset.x > 0 ? 'right' : 'left';
            const isCorrect = dir === activeWord.correct;
            
            if (Math.abs(info.offset.x) > offsetThreshold) {
              if (isCorrect) {
                 // CORRECT SWIPE
                 const newDropletId = Date.now();
                 setDroplets(prev => [...prev, { id: newDropletId, delay: 0 }]);
                 
                 const nextScore = score + 1;
                 setScore(nextScore);
                 
                 setCombo(prev => {
                   const nextCombo = prev + 1;
                   if (nextCombo > maxCombo) setMaxCombo(nextCombo);
                   return nextCombo;
                 });
                 
                 // Transition to next word or mark game completed
                 if (currentWordIndex + 1 < activePayload.words.length) {
                   setCurrentWordIndex(prev => prev + 1);
                 } else {
                   setArenaState('reward');
                 }
              } else {
                 // WRONG SWIPE
                 setShakeActive(true);
                 setFlashRed(true);
                 setCombo(0);
                 
                 // Hardware Haptics
                 if (window.navigator && window.navigator.vibrate) {
                   window.navigator.vibrate([50, 50, 50]);
                 }
                 
                 setTimeout(() => {
                   setShakeActive(false);
                   setFlashRed(false);
                 }, 400);
              }
            }
          };

          const startNeonArena = () => {
            setArenaState('transitioning');
            setCurrentWordIndex(0);
            setScore(0);
            setCombo(0);
            setMaxCombo(0);
            setDroplets([]);
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="narrative-canvas-overlay fixed inset-0 z-[200] overflow-y-auto w-full h-full p-6 flex flex-col justify-between cursor-pointer"
              onClick={() => {
                if (arenaState === 'reading') {
                  setSelectedLessonForNarrative(null);
                }
              }}
            >
              {/* Dynamic Inline CSS to guarantee responsive cyberpunk layout, cards, droplets & keyframes */}
              <style>{`
                .btn-immersion {
                  background: linear-gradient(90deg, #ffab00, #ff5e00);
                  box-shadow: 0 0 20px rgba(255, 171, 0, 0.4);
                  border: none;
                  border-radius: 30px;
                  color: white;
                  font-weight: 700;
                  letter-spacing: 2px;
                  animation: pulse-glow 2s infinite;
                }

                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 15px rgba(255, 171, 0, 0.4); transform: scale(1); }
                  50% { box-shadow: 0 0 30px rgba(255, 171, 0, 0.7); transform: scale(1.03); }
                }

                .neon-arena-void {
                  position: fixed;
                  inset: 0;
                  background: #020617; /* absolute darkness */
                  z-index: 250;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  animation: voidFadeIn 0.5s ease-out forwards;
                }

                @keyframes voidFadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }

                .countdown-text {
                  font-size: 7rem;
                  font-weight: 950;
                  color: transparent;
                  -webkit-text-stroke: 3px #60efff;
                  animation: heartbeat 1s ease-in-out infinite;
                  line-height: 1;
                }

                @keyframes heartbeat {
                  0% { transform: scale(0.8); opacity: 0; }
                  20% { transform: scale(1.25); opacity: 1; text-shadow: 0 0 40px #60efff; }
                  100% { transform: scale(1); opacity: 0; }
                }

                .holographic-swipe-card {
                  width: 290px;
                  height: 380px;
                  background: rgba(255, 255, 255, 0.03);
                  backdrop-filter: blur(25px);
                  -webkit-backdrop-filter: blur(25px);
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 24px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  cursor: grab;
                  user-select: none;
                  touch-action: none;
                  box-shadow: 0 20px 50px rgba(0,0,0,0.6), 
                              inset 0 0 15px rgba(255,255,255,0.03);
                  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
                }

                .holographic-swipe-card:active {
                  cursor: grabbing;
                }

                .is-dragging-right {
                  border-color: #00ff87 !important;
                  box-shadow: 0 0 40px rgba(0, 255, 135, 0.25), 
                              inset -10px 0 30px rgba(0, 255, 135, 0.2) !important;
                }

                .is-dragging-left {
                  border-color: #ff0055 !important;
                  box-shadow: 0 0 40px rgba(255, 0, 85, 0.25), 
                              inset 10px 0 30px rgba(255, 0, 85, 0.2) !important;
                }

                .shake-error {
                  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                  border-color: #ff0055 !important;
                  box-shadow: 0 0 30px rgba(255, 0, 85, 0.4) !important;
                }

                @keyframes shake {
                  10%, 90% { transform: translate3d(-4px, 0, 0); }
                  20%, 80% { transform: translate3d(6px, 0, 0); }
                  30%, 50%, 70% { transform: translate3d(-10px, 0, 0); }
                  40%, 60% { transform: translate3d(10px, 0, 0); }
                }

                .neon-droplet {
                  position: absolute;
                  width: 14px;
                  height: 14px;
                  background: #00ff87;
                  border-radius: 50%;
                  box-shadow: 0 0 20px #00ff87, 0 0 40px #00ff87;
                  animation: flyToCapsule 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                  z-index: 100;
                }

                @keyframes flyToCapsule {
                  0% { transform: scale(1) translateY(0); opacity: 1; }
                  100% { transform: scale(0.3) translateY(-320px); opacity: 0; }
                }

                .laser-scan {
                  position: absolute;
                  left: 0;
                  right: 0;
                  height: 2px;
                  background: linear-gradient(90deg, transparent, rgba(96, 239, 255, 0.5), transparent);
                  animation: scan 3s linear infinite;
                  pointer-events: none;
                }

                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }

                .reward-capsule-container {
                  width: 250px;
                  height: 440px;
                  background: rgba(255, 255, 255, 0.03);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.15);
                  border-radius: 9999px; /* Pill/Capsule shape */
                  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 
                              inset 0 0 20px rgba(255, 255, 255, 0.05);
                  position: relative;
                  overflow: hidden;
                  margin: 20px auto;
                  
                  /* Entrance animation */
                  animation: floatIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes floatIn {
                  0% { transform: translateY(-80px) scale(0.85); opacity: 0; }
                  100% { transform: translateY(0) scale(1); opacity: 1; }
                }

                .liquid-body {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  /* Height controlled dynamically via React style prop */
                  transition: height 2s cubic-bezier(0.25, 1, 0.5, 1);
                  background: linear-gradient(180deg, #00ff87 0%, #00b8ff 100%);
                  box-shadow: 0 0 40px rgba(0, 255, 135, 0.5);
                  z-index: 1;
                }

                /* The Waves */
                .liquid-body::before,
                .liquid-body::after {
                  content: "";
                  position: absolute;
                  top: -60px; /* Positioned just above the fill line */
                  left: 50%;
                  width: 440px;
                  height: 440px;
                  background: #020617; /* Must match the dark background of the arena void */
                  border-radius: 40%; /* Creates the uneven wave shape */
                  transform: translateX(-50%);
                  animation: waveSpin 6s linear infinite;
                  z-index: 2;
                }

                .liquid-body::after {
                  border-radius: 44%;
                  background: rgba(2, 6, 23, 0.7); /* Slightly transparent for depth */
                  animation: waveSpin 8s linear infinite;
                }

                @keyframes waveSpin {
                  0% { transform: translateX(-50%) rotate(0deg); }
                  100% { transform: translateX(-50%) rotate(360deg); }
                }

                .reward-droplet {
                  position: absolute;
                  width: 12px;
                  height: 12px;
                  background: #00ff87;
                  border-radius: 50%;
                  box-shadow: 0 0 15px #00ff87;
                  animation: dropIn 1s cubic-bezier(0.5, 0, 1, 1) forwards;
                }

                @keyframes dropIn {
                  0% { transform: translateY(-160px) scale(0); opacity: 0; }
                  50% { opacity: 1; transform: scale(1.2); }
                  100% { transform: translateY(350px) scale(0); opacity: 0; } /* Disappears as it hits liquid */
                }

                .is-mastered {
                  animation: masteryPulse 2s ease-out infinite !important;
                  border-color: rgba(0, 255, 135, 0.8) !important;
                }

                @keyframes masteryPulse {
                  0% { box-shadow: 0 0 20px rgba(0, 255, 135, 0.4), inset 0 0 20px rgba(0, 255, 135, 0.2); }
                  50% { box-shadow: 0 0 80px rgba(0, 255, 135, 0.8), inset 0 0 50px rgba(0, 255, 135, 0.5); }
                  100% { box-shadow: 0 0 20px rgba(0, 255, 135, 0.4), inset 0 0 20px rgba(0, 255, 135, 0.2); }
                }
              `}</style>

              {/* Decorative top grid glow */}
              <div 
                className="absolute top-0 inset-x-0 h-64 pointer-events-none opacity-40 blur-3xl rounded-full"
                style={{ background: `radial-gradient(circle, ${selectedLessonForNarrative.color}30 0%, transparent 70%)` }}
              />

              {/* STAGE A: READING NARRATIVE (STATION 2) */}
              {arenaState === 'reading' && (
                <>
                  {/* Central Study Content Board */}
                  <div 
                    className="relative w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center py-6 px-1 z-10 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    {/* Topic and Title */}
                    <div className="text-center mb-4">
                      <span 
                        className="inline-block px-3 py-0.5 text-[9px] font-black tracking-widest border rounded-full mb-2 uppercase"
                        style={{ 
                          borderColor: `${selectedLessonForNarrative.color}40`,
                          color: selectedLessonForNarrative.color,
                          backgroundColor: `${selectedLessonForNarrative.color}05`,
                          textShadow: `0 0 10px ${selectedLessonForNarrative.color}25`
                        }}
                      >
                        {selectedLessonForNarrative.tag}
                      </span>
                      <h2 
                        className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight select-none font-display"
                        style={{ textShadow: `0 2px 20px ${selectedLessonForNarrative.color}30` }}
                      >
                        {selectedLessonForNarrative.title}
                      </h2>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5 font-bold">
                        {selectedLessonForNarrative.topic}
                      </p>
                    </div>

                    {/* Compact elegant narrative intro box */}
                    <div className="w-full max-w-xl mx-auto mb-4 px-4">
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="float-left mr-3 mt-0.5 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
                          <Sparkles size={14} />
                        </div>
                        <p className="text-stone-300 text-xs md:text-sm leading-relaxed text-left font-medium italic">
                          "{content?.concept}"
                        </p>
                        <div className="text-[9px] text-[#00ffcc] uppercase font-black mt-2 tracking-widest text-right" style={{ color: selectedLessonForNarrative.color }}>
                          — Immersive Prologue
                        </div>
                      </div>
                    </div>

                    {/* Glowing Anatomy Rule Card */}
                    <div className="w-full max-w-xl mx-auto px-4 mb-4">
                      <div 
                        className="p-5 md:p-6 bg-slate-950/40 border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-md"
                        style={{ 
                          borderColor: `${selectedLessonForNarrative.color}25`,
                          boxShadow: `0 15px 35px rgba(0,0,0,0.4), inset 0 0 15px ${selectedLessonForNarrative.color}10`
                        }}
                      >
                        <div 
                          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10"
                          style={{ backgroundColor: selectedLessonForNarrative.color }}
                        />
                        
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: selectedLessonForNarrative.color }}>
                          <Sparkles size={14} /> Core Anatomy Formula & Structural Rules
                        </h3>
                        
                        <p className="text-[11px] text-stone-400 mt-2 mb-4 leading-relaxed font-semibold">
                          {content?.deepExplanation}
                        </p>

                        {/* Visualizing the rules beautifully depending on lesson */}
                        {selectedLessonForNarrative.id === "capsule_genere" ? (
                          <div className="space-y-3.5 text-left">
                            {content?.specimens?.map((spec, sidx) => (
                              <div key={sidx} className="bg-white/[0.02] border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all duration-300">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-1.5 mb-1.5">
                                  <span className="text-xs font-black text-white">{spec.gender}</span>
                                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-black">
                                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80">{spec.ending} (Sg)</span>
                                    <span className="text-white/40">➔</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#00ffcc]" style={{ color: selectedLessonForNarrative.color }}>{spec.pluralEnding} (Pl)</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 my-1">
                                  <div>
                                    <span className="text-[9px] block font-black uppercase text-white/30 tracking-wider">Example</span>
                                    <span className="text-[11px] font-bold text-white font-mono">{spec.exampleSingular} ➔ {spec.examplePlural}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[9px] block font-black uppercase text-white/30 tracking-wider">Translation</span>
                                    <span className="text-[11px] font-medium text-white/70">{spec.translation}</span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed border-t border-white/[0.02] pt-1">{spec.notes}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            {content?.conjugations?.map((conj, cidx) => (
                              <div key={cidx} className="bg-white/[0.02] border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all duration-300 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-1 border-b border-white/5 pb-1.5 mb-1.5">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-xs font-black text-white">{conj.subject}</span>
                                    <span className="text-[8px] font-black uppercase tracking-wider text-white/35">({conj.level})</span>
                                  </div>
                                  <span className="text-xs font-black font-mono tracking-widest px-1.5 py-0.5 rounded" style={{ color: selectedLessonForNarrative.color, backgroundColor: `${selectedLessonForNarrative.color}15` }}>
                                    {conj.verb}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/40 font-bold">Meaning:</span>
                                    <span className="text-white/70 font-semibold text-right">{conj.translation}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/40 font-bold">Context:</span>
                                    <span className="text-white/80 italic font-mono font-medium text-right">{conj.example}</span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-white/30 mt-1.5 leading-relaxed border-t border-white/[0.02] pt-1">{conj.notes}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-stone-400 gap-1.5">
                          <span className="font-semibold italic uppercase tracking-wider select-none text-white/35">Takeaway rule:</span>
                          <span className="font-medium text-right text-stone-300">
                            {content?.anatomy}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Context Switcher & Amber-Glow Tabs */}
                    {content && (
                      <div className="w-full max-w-xl mx-auto px-4 space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 flex items-center justify-center gap-1.5 select-none animate-pulse">
                          <BookOpen size={11} /> Explore Context Realities
                        </h4>

                        <div className="flex gap-2 justify-center flex-wrap">
                          {content.contexts.map((ctx, idx) => {
                            const IconComp = ctx.icon;
                            const isSel = selectedContextIndex === idx;
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedContextIndex(idx);
                                }}
                                className={`context-tab flex items-center gap-1.5 justify-center text-[10px] px-3.5 py-1.5 rounded-full border border-white/5 backdrop-blur-md transition-all duration-300 ${
                                  isSel 
                                    ? "bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-lg shadow-amber-500/10" 
                                    : "bg-white/[0.02] text-slate-400 hover:text-white"
                                }`}
                              >
                                <IconComp size={12} />
                                {ctx.category}
                              </button>
                            );
                          })}
                        </div>

                        {/* Display Active Selected Context Example Sentence */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedContextIndex}
                            initial={{ opacity: 0, scale: 0.98, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -5 }}
                            transition={{ duration: 0.25 }}
                            className="bg-amber-500/[0.015] border border-amber-500/10 p-4 rounded-xl relative overflow-hidden backdrop-blur-md text-center"
                          >
                            <div className="absolute top-1 left-2 font-mono text-[8px] text-amber-500/20 select-none uppercase tracking-widest font-black">
                              {content.contexts[selectedContextIndex].category}
                            </div>
                            <p className="text-white text-sm md:text-base font-extrabold tracking-wide mb-1 hover:text-amber-300 transition-colors">
                              {content.contexts[selectedContextIndex].title_it}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {content.contexts[selectedContextIndex].translation_en}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    )}

                  </div>

                  {/* Footer Drill Activation */}
                  <div 
                    className="relative w-full max-w-sm mx-auto z-10 pb-8 pt-4 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 text-[11px] font-black uppercase tracking-widest cursor-pointer relative overflow-hidden btn-immersion flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startNeonArena();
                      }}
                    >
                      <Sparkles size={14} className="text-white fill-white" />
                      Activate Fluency Drills
                    </motion.button>
                  </div>
                </>
              )}

              {/* STAGE B: TRANSITION COUNTDOWN */}
              {arenaState === 'transitioning' && (
                <div 
                  className="neon-arena-void"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div 
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="countdown-text font-display select-none"
                  >
                    {countdown}
                  </motion.div>
                  <p className="text-[#60efff] text-[10px] uppercase tracking-widest font-black mt-8 opacity-60 animate-pulse select-none">
                    Preparing Holographic Arena...
                  </p>
                </div>
              )}

              {/* STAGE C: PLAYING GAME (THE NEON ARENA) */}
              {arenaState === 'playing' && (
                <div 
                  className="fixed inset-0 z-[250] flex flex-col justify-between p-6 bg-black/50 backdrop-blur-3xl text-white overflow-hidden cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Header stats */}
                  <div className="w-full max-w-lg mx-auto flex justify-between items-center pt-4 border-b border-white/5 pb-3">
                    <button
                      onClick={() => setArenaState('reading')}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white active:scale-90 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    
                    <div className="flex-1 mx-4 max-w-xs">
                      <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/50 mb-1 font-black">
                        <span>Arena Precision</span>
                        <span>{Math.round((currentWordIndex / activePayload.words.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/10 relative">
                        <div 
                          className="h-full rounded-full transition-all duration-300 relative"
                          style={{ 
                            width: `${((currentWordIndex) / activePayload.words.length) * 100}%`,
                            background: `linear-gradient(90deg, #00ffcc 0%, ${selectedLessonForNarrative?.color || '#3b82f6'} 100%)`,
                            boxShadow: `0 0 10px ${selectedLessonForNarrative?.color || '#3b82f6'}50`
                          }}
                        />
                      </div>
                    </div>

                    <motion.div 
                      key={combo}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: combo > 0 ? 1.1 : 1 }}
                      className="flex items-center gap-1 bg-[#ff0055]/10 border border-[#ff0055]/30 px-3 py-1 rounded-full shrink-0"
                      style={{
                        borderColor: combo > 2 ? '#00ff87' : combo > 0 ? '#3b82f6' : '#ff0055/30',
                        backgroundColor: combo > 2 ? '#00ff8710' : combo > 0 ? '#3b82f610' : '#ff005510'
                      }}
                    >
                      <Zap size={10} className={combo > 2 ? 'text-[#00ff87]' : combo > 0 ? 'text-[#3b82f6]' : 'text-[#ff0055]'} />
                      <span className={`text-[9px] font-black tracking-widest uppercase ${combo > 2 ? 'text-[#00ff87]' : combo > 0 ? 'text-[#3b82f6]' : 'text-[#ff0055]'}`}>
                        {combo}x Comb
                      </span>
                    </motion.div>
                  </div>

                  {/* Arena Body with guides and swiping card */}
                  <div className="flex-1 w-full max-w-lg mx-auto relative flex flex-col justify-center items-center py-6 overflow-hidden">
                    
                    <AnimatePresence>
                      {flashRed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-red-950/25 pointer-events-none z-0 border border-red-500/20 rounded-3xl"
                        />
                      )}
                    </AnimatePresence>

                    {/* Droplets generator animate reward */}
                    {droplets.map(drop => (
                      <div
                        key={drop.id}
                        className="neon-droplet"
                        style={{
                          left: 'calc(50% - 7px)',
                          top: 'calc(50% + 50px)',
                        }}
                      />
                    ))}

                    {/* Zone indicators Left */}
                    <div className={`absolute top-1/2 left-2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-300 pointer-events-none ${
                      dragDirection === 'left' ? 'scale-110 opacity-100' : 'opacity-25'
                    }`}>
                      <div className="w-1.5 h-16 rounded-full bg-[#ff0055] shadow-[0_0_15px_#ff0055]" />
                      <span className="text-[9px] text-[#ff0055] uppercase font-black tracking-widest transform -rotate-90 origin-center whitespace-nowrap mt-8 font-mono">
                        {activePayload.leftLabel}
                      </span>
                    </div>

                    {/* Zone indicators Right */}
                    <div className={`absolute top-1/2 right-2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-300 pointer-events-none ${
                      dragDirection === 'right' ? 'scale-110 opacity-100' : 'opacity-25'
                    }`}>
                      <div className="w-1.5 h-16 rounded-full bg-[#00ff87] shadow-[0_0_15px_#00ff87]" />
                      <span className="text-[9px] text-[#00ff87] uppercase font-black tracking-widest transform rotate-90 origin-center whitespace-nowrap mt-8 font-mono">
                        {activePayload.rightLabel}
                      </span>
                    </div>

                    {/* Center title instruction */}
                    <div className="absolute top-2 text-center z-10 px-4 select-none">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1 select-none font-bold">
                        SWIPE LEFT OR RIGHT TO CLASSIFY
                      </p>
                      <p className="text-xs text-[#00ffcc] font-medium tracking-wide">
                        {activePayload.instruction}
                      </p>
                    </div>

                    {/* Center Holographic card element */}
                    <div className="relative w-[300px] h-[390px] flex items-center justify-center">
                      {currentWordIndex + 1 < activePayload.words.length && (
                        <div 
                          className="absolute w-[274px] h-[350px] bg-white/[0.015] border border-white/5 rounded-[24px] pointer-events-none transform translate-y-4 scale-[0.93] blur-[1px] opacity-40 filter z-0"
                        />
                      )}

                      <motion.div
                        key={currentWordIndex}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.65}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEndAction}
                        className={`holographic-swipe-card flex flex-col p-8 text-center select-none z-10 ${
                          dragDirection === 'right' ? 'is-dragging-right' : ''
                        } ${
                          dragDirection === 'left' ? 'is-dragging-left' : ''
                        } ${
                          shakeActive ? 'shake-error' : ''
                        }`}
                        style={{
                          touchAction: "none"
                        }}
                      >
                        <div className="laser-scan" />

                        <div className="absolute top-4 left-6 text-[8px] font-black uppercase tracking-widest text-[#60efff]/50 bg-[#60efff]/5 px-2.5 py-1 rounded-md border border-[#60efff]/10 font-mono">
                          STATION iii • IMMERSION
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center gap-2">
                          <span className="text-[9px] text-white/30 uppercase tracking-widest font-black font-mono">
                            ITALY COGNITIVE TARGET
                          </span>
                          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase font-mono py-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] leading-tight">
                            {activeWord.word}
                          </h2>
                          <span 
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/5 font-mono"
                            style={{ 
                              borderColor: `${selectedLessonForNarrative?.color || '#3b82f6'}20`,
                              backgroundColor: `${selectedLessonForNarrative?.color || '#3b82f6'}05`,
                              color: selectedLessonForNarrative?.color || '#3b82f6'
                            }}
                          >
                            {activeWord.type}
                          </span>
                        </div>

                        <div className="absolute bottom-4 inset-x-6 flex justify-between items-center text-[8px] text-white/30 uppercase font-bold tracking-wider font-mono">
                          <div className="flex items-center gap-1 border-b border-white/5 pb-0.5">
                            <ChevronLeft size={10} className="text-[#ff0055]" /> {activePayload.leftLabel}
                          </div>
                          <div className="flex items-center gap-1 border-b border-white/5 pb-0.5">
                            {activePayload.rightLabel} <ChevronRight size={10} className="text-[#00ff87]" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Accessibility Buttons beneath card for Desktop and Tap interactions */}
                    <div className="w-full flex justify-center gap-8 items-center mt-6 z-20">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const mockInfo = { offset: { x: -150 } };
                          handleDragEndAction(null, mockInfo);
                        }}
                        className="w-12 h-12 rounded-full bg-[#ff0055]/5 border border-[#ff0055]/30 flex items-center justify-center text-[#ff0055] hover:bg-[#ff0055]/15 font-black hover:border-[#ff0055]/60 transition-all cursor-pointer shadow-[0_4px_15px_rgba(255,0,85,0.1)]"
                      >
                        <ChevronLeft size={20} />
                      </motion.button>

                      <span className="text-[9px] font-black uppercase text-white/30 tracking-widest select-none font-mono">
                        WORD {currentWordIndex + 1} OF {activePayload.words.length}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const mockInfo = { offset: { x: 150 } };
                          handleDragEndAction(null, mockInfo);
                        }}
                        className="w-12 h-12 rounded-full bg-[#00ff87]/5 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] hover:bg-[#00ff87]/15 font-black hover:border-[#00ff87]/60 transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,135,0.1)]"
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>

                  </div>
                </div>
              )}

              {/* STAGE D: STATION 5 - THE LIQUID CEREMONY REWARD SEQUENCE */}
              {arenaState === 'reward' && (
                <div 
                  className="fixed inset-0 z-[250] flex flex-col justify-center items-center p-6 bg-black/50 backdrop-blur-3xl text-white overflow-hidden cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative background grid glows */}
                  <div 
                    className="absolute top-0 inset-x-0 h-64 pointer-events-none opacity-40 blur-3xl rounded-full"
                    style={{ background: `radial-gradient(circle, ${selectedLessonForNarrative?.color || '#00ffcc'}30 0%, transparent 70%)` }}
                  />

                  {/* Falling Droplets Layer */}
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    {rewardDroplets.map((drop) => (
                      <div
                        key={drop.id}
                        className="reward-droplet"
                        style={{
                          left: `${drop.left}%`,
                          top: `0px`,
                          animationDelay: `${drop.delay}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Title and Badge */}
                  <div className="text-center mb-6 z-20 max-w-xs transition-opacity duration-500">
                    <span 
                      className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#00ffcc] border border-[#00ffcc]/30 rounded-full mb-3 inline-block bg-[#00ffcc]/5 font-mono animate-pulse"
                      style={{
                        borderColor: `${selectedLessonForNarrative?.color || '#00ffcc'}50`,
                        color: selectedLessonForNarrative?.color || '#00ffcc',
                        backgroundColor: `${selectedLessonForNarrative?.color || '#00ffcc'}08`
                      }}
                    >
                      Station v • The Liquid Ceremony
                    </span>
                    <h2 
                      className="text-2xl font-black tracking-tight text-white font-display leading-tight"
                      style={{ textShadow: `0 2px 20px ${selectedLessonForNarrative?.color || '#00ffcc'}40` }}
                    >
                      {isMaxedOut ? "Cognitive Mastery Attained" : "Synthesizing Fluency"}
                    </h2>
                    <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed font-semibold">
                      {isMaxedOut 
                        ? "Flawless synchronization. The concept has stabilized inside your cognitive core." 
                        : "Your droplets of correct understanding are merging with the capsule."}
                    </p>
                  </div>

                  {/* Central Glass Capsule (Frosted Pill shape) */}
                  <div className={`reward-capsule-container flex items-center justify-center z-20 ${
                    isMaxedOut ? 'is-mastered' : ''
                  }`}>
                    {/* Laser scanning visual light overlay */}
                    <div className="laser-scan" style={{ animationDuration: '4s' }} />

                    {/* Numeric tracking value */}
                    <div className="absolute z-20 text-center select-none pointer-events-none">
                      <span className="text-stone-400 block font-black uppercase tracking-widest text-[8px] font-mono">
                        Fluidity Level
                      </span>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl font-mono font-black text-white filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] tracking-tight leading-none my-1"
                      >
                        {liquidLevel}%
                      </motion.div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${
                        isMaxedOut ? 'text-[#00ff87] animate-pulse' : 'text-[#00b8ff]'
                      }`}>
                        {isMaxedOut ? "Fluent" : "Merging"}
                      </span>
                    </div>

                    {/* Dynamic Liquid Body */}
                    <div 
                      className="liquid-body"
                      style={{ 
                        height: `${liquidLevel}%`,
                        background: `linear-gradient(180deg, ${selectedLessonForNarrative?.color || '#00ffcd'} 0%, #00b8ff 100%)`,
                        boxShadow: `0 0 40px ${(selectedLessonForNarrative?.color || '#00ffcd')}50`
                      }}
                    />
                  </div>

                  {/* Score precision telemetry below capsule */}
                  <div className="mt-4 text-center z-20 animate-fade-in">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                      PRECISE EXTRACTION: {score} CORPUS DROPLETS RECEIVED
                    </p>
                  </div>

                  {/* Continua Button appearing with a delay */}
                  <div className="w-full max-w-xs mt-8 z-30 h-14 relative flex justify-center">
                    <AnimatePresence>
                      {showContinueBtn && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ type: 'spring', stiffness: 100 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            // First, smooth fade out and transition to 'completed' stage so they can see full stats
                            setArenaState('completed');
                          }}
                          className="w-full h-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950 flex items-center justify-center gap-1.5 hover:bg-emerald-400 font-mono transition-all duration-300 shadow-[0_10px_35px_rgba(16,185,129,0.3)] border border-emerald-300/30 cursor-pointer"
                        >
                          Continua
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* STAGE E: DRILLS GAME OVER / STATS OVERVIEW */}
              {arenaState === 'completed' && (
                <div 
                  className="fixed inset-0 z-[250] flex flex-col justify-center items-center p-6 bg-black/50 backdrop-blur-3xl text-white cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div 
                    className="relative p-6 rounded-3xl bg-white/[0.01] border border-white/5 max-w-sm w-full text-center backdrop-blur-3xl"
                    style={{
                      boxShadow: `0 20px 50px rgba(0,255,135,0.05)`
                    }}
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff87] mb-6 shadow-[0_0_20px_rgba(0,255,135,0.2)]">
                      <Trophy size={32} />
                    </div>

                    <span className="px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#00ffcc] border border-[#00ffcc]/30 rounded-full mb-2 inline-block bg-[#00ffcc]/5 font-mono">
                      Immersion Completed
                    </span>

                    <h2 className="text-xl font-black tracking-tight text-white mb-2 font-display">
                      Cognitive Mastery Safe
                    </h2>
                    <p className="text-xs text-white/50 px-4 leading-relaxed mb-6">
                      Your reflexes are adapting to the Venetian currents. Your subconscious fluency increased.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                        <span className="text-[9px] uppercase font-black text-white/40 block mb-1 font-mono">
                          Precision
                        </span>
                        <span className="text-xl font-mono font-black text-[#00ff87]">
                          {Math.round((score / activePayload.words.length) * 100)}%
                        </span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-center">
                        <span className="text-[9px] uppercase font-black text-white/40 block mb-1 font-mono">
                          Max combo
                        </span>
                        <span className="text-xl font-mono font-black text-amber-400">
                          {maxCombo}x
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startNeonArena}
                        className="w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#00ff87] text-slate-950 flex items-center justify-center gap-1.5 hover:bg-[#00ff87]/90 transition-all shadow-[0_10px_30px_rgba(0,255,135,0.2)] cursor-pointer font-mono"
                      >
                        <RotateCcw size={12} className="stroke-[3]" /> Replay Drills
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setArenaState('reading');
                          setSelectedLessonForNarrative(null);
                          onStartStudy?.();
                        }}
                        className="w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                      >
                        Return to Path
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

