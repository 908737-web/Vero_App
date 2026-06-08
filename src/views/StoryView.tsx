import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye } from 'lucide-react';

interface MagicWord {
  word: string;
  trans: string;
}

interface StorySegment {
  it: string;
  magic: MagicWord[];
}

interface StorySelection {
  text: string;
  nextId: string;
}

interface StoryNode {
  id: string;
  paragraphs: StorySegment[];
  choices: StorySelection[];
}

const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: 'start',
    paragraphs: [
      {
        it: "Arrivi davanti al vecchio cancello arrugginito di Villa Foscarini. La luna piena illumina a malapena le statue di pietra coperte di muschio.",
        magic: [
          { word: "cancello", trans: "gate" },
          { word: "arrugginito", trans: "rusty" },
          { word: "muschio", trans: "moss" },
          { word: "pietra", trans: "stone" }
        ]
      },
      {
        it: "Il vento gelido fischia tra i rami degli alberi. Un brivido ti percorre la schiena. Devi entrare per trovare il diario perduto, ma come?",
        magic: [
          { word: "gelido", trans: "freezing" },
          { word: "brivido", trans: "shiver" },
          { word: "perduto", trans: "lost" },
          { word: "schiena", trans: "back" }
        ]
      }
    ],
    choices: [
      { text: "Spingi il cancello con forza", nextId: 'push_gate' },
      { text: "Cerca un'altra entrata lungo il muro", nextId: 'search_wall' }
    ]
  },
  push_gate: {
    id: 'push_gate',
    paragraphs: [
      {
        it: "Spingi il cancello con tutte le tue forze. Produce un cigolio terribile che riecheggia nella notte. Improvvisamente, un cane inizia ad abbaiare in lontananza.",
        magic: [
          { word: "forze", trans: "strength" },
          { word: "cigolio", trans: "creak" },
          { word: "riecheggia", trans: "echoes" },
          { word: "abbaiare", trans: "to bark" }
        ]
      },
      {
        it: "Corri verso la porta d'ingresso della villa e vedi che è socchiusa.",
        magic: [
          { word: "d'ingresso", trans: "front (door)" },
          { word: "socchiusa", trans: "ajar" }
        ]
      }
    ],
    choices: [
      { text: "Entra velocemente dall'ingresso", nextId: 'enter_door' },
      { text: "Nasconditi dietro una statua", nextId: 'hide_statue' }
    ]
  },
  search_wall: {
    id: 'search_wall',
    paragraphs: [
      {
        it: "Cammini lungo il muro di cinta. Trovi una piccola finestra della cantina aperta. Sotto c'è un mucchio di foglie secche.",
        magic: [
          { word: "muro di cinta", trans: "perimeter wall" },
          { word: "cantina", trans: "basement" },
          { word: "foglie secche", trans: "dry leaves" }
        ]
      },
      {
        it: "Ti cali lentamente nel buio. Senti odore di muffa e vino vecchio.",
        magic: [
          { word: "Ti cali", trans: "You lower yourself" },
          { word: "muffa", trans: "mold" }
        ]
      }
    ],
    choices: [
      { text: "Accendi la torcia del telefono", nextId: 'turn_on_flashlight' },
      { text: "Avanza al buio tastando i muri", nextId: 'walk_dark' }
    ]
  },
  enter_door: {
    id: 'enter_door',
    paragraphs: [
      {
        it: "Appena entri, la porta si chiude di scatto dietro di te. Sei in trappola, ma sul tavolo vedi esattamente quello che stavi cercando: il diario.",
        magic: [
          { word: "di scatto", trans: "suddenly" },
          { word: "in trappola", trans: "trapped" },
          { word: "stavi cercando", trans: "you were looking for" }
        ]
      }
    ],
    choices: [
      { text: "Rigioca l'avventura", nextId: 'start' }
    ]
  },
  hide_statue: {
    id: 'hide_statue',
    paragraphs: [
      {
        it: "Ti abbassi dietro una grande statua di marmo. Dalla porta esce una figura incappucciata con una lanterna. Ti ha visto.",
        magic: [
          { word: "Ti abbassi", trans: "You crouch" },
          { word: "incappucciata", trans: "hooded" },
          { word: "lanterna", trans: "lantern" }
        ]
      }
    ],
    choices: [
      { text: "Rigioca l'avventura", nextId: 'start' }
    ]
  },
  turn_on_flashlight: {
    id: 'turn_on_flashlight',
    paragraphs: [
      {
        it: "La luce illumina la cantina. Davanti a te c'è uno scaffale pieno di bottiglie e, nascosto in un angolo, un passaggio segreto.",
        magic: [
          { word: "scaffale", trans: "shelf" },
          { word: "nascosto", trans: "hidden" },
          { word: "passaggio segreto", trans: "secret passage" }
        ]
      }
    ],
    choices: [
      { text: "Rigioca l'avventura", nextId: 'start' }
    ]
  },
  walk_dark: {
    id: 'walk_dark',
    paragraphs: [
      {
        it: "Fai un passo al buio, inciampi in una vecchia botte e fai un rumore assordante. Qualcuno scende le scale di corsa.",
        magic: [
          { word: "inciampi", trans: "you stumble" },
          { word: "botte", trans: "barrel" },
          { word: "assordante", trans: "deafening" },
          { word: "di corsa", trans: "running" }
        ]
      }
    ],
    choices: [
      { text: "Rigioca l'avventura", nextId: 'start' }
    ]
  }
};

import { ThemeColors } from '../types';

interface StoryViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  currentTheme?: ThemeColors;
}

const HoldChoiceButton: React.FC<{ choice: StorySelection; onComplete: () => void; isDarkMode: boolean }> = ({ choice, onComplete, isDarkMode }) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 1500;

  const handleDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (isSuccess) return;
    setIsHolding(true);
    timeoutRef.current = setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
        setIsSuccess(false);
        setIsHolding(false);
      }, 400); // Wait for success flash
    }, HOLD_DURATION);
  };

  const handleUp = () => {
    if (isSuccess) return;
    setIsHolding(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <motion.button
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full text-left rounded-2xl overflow-hidden border transition-colors duration-300 select-none touch-none
        ${isDarkMode 
           ? 'border-white/10 bg-white/[0.02] text-white' 
           : 'border-slate-200 bg-white text-slate-800 shadow-sm'}
      `}
      animate={
        isSuccess ? { scale: 1.05, opacity: 0 } :
        isHolding ? { scale: 0.98 } : 
        { scale: 1 }
      }
      transition={{ duration: isSuccess ? 0.4 : 0.4, ease: "easeOut" }}
    >
      {/* Dynamic Background Fill */}
      <motion.div
        className={`absolute inset-0 origin-left ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHolding ? 1 : 0 }}
        transition={{ duration: isHolding ? HOLD_DURATION / 1000 : 0.3, ease: isHolding ? "linear" : "easeOut" }}
      />
      
      {/* Glitch/Shake Content Wrapper */}
      <motion.div 
        className="relative z-10 px-3 py-5 flex items-center justify-between"
        animate={isHolding && !isSuccess ? { x: [-1, 1, -1, 1, 0] } : {}}
        transition={{ duration: 0.2, repeat: isHolding ? Infinity : 0 }}
      >
        <span className={`text-lg font-medium transition-all duration-300 ${isHolding ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}>
           {choice.text}
        </span>
        <AnimatePresence>
           {isHolding && !isSuccess && (
             <motion.div
               initial={{ opacity: 0, filter: 'blur(4px)' }}
               animate={{ opacity: 0.7, filter: 'blur(0px)' }}
               exit={{ opacity: 0, filter: 'blur(4px)' }}
               className="text-[10px] uppercase tracking-widest shrink-0 ml-4"
             >
               Hold...
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>

      {/* Success Flash Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            className="absolute inset-0 z-20 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const StoryView: React.FC<StoryViewProps> = ({ onBack, isDarkMode, currentTheme }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [isMagicActive, setIsMagicActive] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const node = STORY_NODES[currentNodeId];

  const handleChoice = (nextId: string) => {
    if (nextId === 'start') {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
  };

  const handleHoldStart = () => setIsMagicActive(true);
  const handleHoldEnd = () => setIsMagicActive(false);

  useEffect(() => {
    // Reset magic when unmounting or switching nodes to be safe
    return () => setIsMagicActive(false);
  }, [currentNodeId]);

  const renderParagraph = (segment: StorySegment, pIndex: number) => {
    if (!segment.magic.length) {
      return (
        <p key={pIndex} className={`text-xl md:text-2xl leading-relaxed mb-6 font-serif transition-colors duration-500 ${isMagicActive ? 'text-white/40' : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>
          {segment.it}
        </p>
      );
    }

    // Sort to match longest phrases first
    const sortedMagic = [...segment.magic].sort((a, b) => b.word.length - a.word.length);
    const regexSource = sortedMagic.map(m => m.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexSource})`, 'gi');
    
    const parts = segment.it.split(regex);
    
    return (
      <p key={pIndex} className={`text-xl md:text-2xl leading-relaxed mb-6 font-serif transition-colors duration-500 ${isMagicActive ? 'text-white/40' : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>
        {parts.map((part, i) => {
          const magicMatch = sortedMagic.find(m => m.word.toLowerCase() === part.toLowerCase());
          if (magicMatch) {
            return (
              <span key={i} className="relative inline-block transition-colors duration-300">
                <span className={`transition-all duration-300 ${isMagicActive ? 'text-amber-400 font-bold drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : ''}`}>
                  {part}
                </span>
                
                <AnimatePresence>
                  {isMagicActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -5, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-amber-200 text-xs font-sans font-bold uppercase tracking-widest rounded-lg whitespace-nowrap z-20 border border-amber-500/30 shadow-2xl"
                    >
                      {magicMatch.trans}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div 
      className={`w-full h-full flex flex-col relative overflow-hidden transition-colors duration-700 ${
        isMagicActive 
          ? 'bg-black/90' 
          : (isDarkMode ? 'bg-black/40 backdrop-blur-3xl' : 'bg-white/40 backdrop-blur-3xl')
      }`}
    >
      {/* Background Ambience for Magic Mode */}
      <AnimatePresence>
        {isMagicActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 120%, rgba(251, 191, 36, 0.15) 0%, transparent 60%)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Top Elements */}
      <div className="absolute top-0 left-0 right-0 w-full pt-8 px-3 pointer-events-none z-[150] flex justify-center items-start">
        <div className={`text-xs uppercase tracking-widest font-bold transition-colors duration-500 pointer-events-auto ${isMagicActive ? 'text-amber-500/50' : (isDarkMode ? 'text-white/30' : 'text-slate-400')}`}>
          IL BIVIO
        </div>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-3 pt-24 pb-32 overflow-y-auto no-scrollbar relative z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            {/* Story Text */}
            <div className="mb-12 mt-4">
              {node.paragraphs.map((p, idx) => renderParagraph(p, idx))}
            </div>

            {/* Choices */}
            <div className={`space-y-4 transition-opacity duration-500 ${isMagicActive ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>
              <div className="h-px w-16 bg-slate-200 dark:bg-white/10 mb-8 mx-auto" />
              
              {node.choices.map((choice, idx) => (
                <HoldChoiceButton
                  key={idx}
                  choice={choice}
                  onComplete={() => handleChoice(choice.nextId)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Magic Lens Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
         <motion.button
           onMouseDown={handleHoldStart}
           onMouseUp={handleHoldEnd}
           onMouseLeave={handleHoldEnd}
           onTouchStart={handleHoldStart}
           onTouchEnd={handleHoldEnd}
           whileTap={{ scale: 0.95 }}
           className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-md
             ${isMagicActive 
               ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
               : (isDarkMode ? 'bg-white/10 border-white/20 text-white/50' : 'bg-slate-900 border-slate-800 text-slate-300')
             }
           `}
         >
           {/* Inner glow effect when active */}
           <AnimatePresence>
             {isMagicActive && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.5 }}
                 className="absolute inset-0 bg-amber-500/20 rounded-full blur-md"
               />
             )}
           </AnimatePresence>
           <Eye className="w-6 h-6 relative z-10" />
         </motion.button>
         
         <div className={`text-center mt-3 text-[10px] uppercase tracking-widest font-bold transition-opacity duration-500 ${isMagicActive ? 'opacity-0' : (isDarkMode ? 'text-white/30' : 'text-slate-400')}`}>
           Tieni premuto
         </div>
      </div>
    </div>
  );
};
