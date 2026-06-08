import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Beaker, Activity, Radio } from 'lucide-react';
import { ThemeColors } from '../types';

interface VerbLabViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  currentTheme?: ThemeColors;
}

type Subject = 'Io' | 'Tu' | 'Lui/Lei' | 'Noi' | 'Voi' | 'Loro';

interface ConjugationData {
  word: string;
  example: string;
}

interface VerbDef {
  id: string;
  root: string;
  translation: string;
  color: string;
  type: string;
  conjugations: Record<string, Record<Subject, ConjugationData>>;
}

const VERBS: VerbDef[] = [
  {
    id: 'parlare', root: 'Parlare', translation: 'To speak / Harf Zadan', color: '#10b981', type: 'ARE (Reg)',
    conjugations: {
      'Passato Prossimo': {
        'Io': { word: 'ho parlato', example: 'Ho parlato con lui ieri.' },
        'Tu': { word: 'hai parlato', example: 'Hai parlato troppo.' },
        'Lui/Lei': { word: 'ha parlato', example: 'Lei ha parlato bene.' },
        'Noi': { word: 'abbiamo parlato', example: 'Abbiamo parlato a lungo.' },
        'Voi': { word: 'avete parlato', example: 'Avete parlato con il capo?' },
        'Loro': { word: 'hanno parlato', example: 'Hanno parlato in italiano.' },
      },
      'Imperfetto': {
        'Io': { word: 'parlavo', example: 'Parlavo spesso di te.' },
        'Tu': { word: 'parlavi', example: 'Parlavi con tuo fratello.' },
        'Lui/Lei': { word: 'parlava', example: 'Lui parlava a bassa voce.' },
        'Noi': { word: 'parlavamo', example: 'Parlavamo del più e del meno.' },
        'Voi': { word: 'parlavate', example: 'Mentre parlavate, io ascoltavo.' },
        'Loro': { word: 'parlavano', example: 'Parlavano in modo strano.' },
      },
      'Presente': {
        'Io': { word: 'parlo', example: 'Parlo italiano.' },
        'Tu': { word: 'parli', example: 'Parli veloce.' },
        'Lui/Lei': { word: 'parla', example: 'Lei parla lingue diverse.' },
        'Noi': { word: 'parliamo', example: 'Parliamo di cose belle.' },
        'Voi': { word: 'parlate', example: 'Voi parlate inglese?' },
        'Loro': { word: 'parlano', example: 'Loro parlano sempre.' },
      },
      'Condizionale': {
        'Io': { word: 'parlerei', example: 'Parlerei, ma ho fretta.' },
        'Tu': { word: 'parleresti', example: 'Parleresti per me?' },
        'Lui/Lei': { word: 'parlerebbe', example: 'Parlerebbe ore.' },
        'Noi': { word: 'parleremmo', example: 'Parleremmo volentieri.' },
        'Voi': { word: 'parlereste', example: 'Voi parlereste al suo posto?' },
        'Loro': { word: 'parlerebbero', example: 'Parlerebbero se potessero.' },
      },
      'Futuro Semplice': {
        'Io': { word: 'parlerò', example: 'Parlerò con lui domani.' },
        'Tu': { word: 'parlerai', example: 'Ne parlerai a casa.' },
        'Lui/Lei': { word: 'parlerà', example: 'Il prof parlerà di storia.' },
        'Noi': { word: 'parleremo', example: 'Ne parleremo dopo.' },
        'Voi': { word: 'parlerete', example: 'Parlerete voi due.' },
        'Loro': { word: 'parleranno', example: 'Loro parleranno per primi.' },
      },
      'Futuro Anteriore': {
        'Io': { word: 'avrò parlato', example: 'Domani, avrò parlato con lei.' },
        'Tu': { word: 'avrai parlato', example: 'Avrai già parlato.' },
        'Lui/Lei': { word: 'avrà parlato', example: 'Non avrà parlato di me.' },
        'Noi': { word: 'avremo parlato', example: 'Avremo parlato chiaro.' },
        'Voi': { word: 'avrete parlato', example: 'Avrete parlato troppo.' },
        'Loro': { word: 'avranno parlato', example: 'Avranno sicuramente parlato.' },
      }
    }
  },
  {
    id: 'essere', root: 'Essere', translation: 'To be / Boodan', color: '#3b82f6', type: 'Irregular',
    conjugations: {
        'Passato Prossimo': {
            'Io': { word: 'sono stato/a', example: 'Sono stato a Roma.' },
            'Tu': { word: 'sei stato/a', example: 'Sei stato bravo.' },
            'Lui/Lei': { word: 'è stato/a', example: 'È stata una bella giornata.' },
            'Noi': { word: 'siamo stati/e', example: 'Siamo stati felici.' },
            'Voi': { word: 'siete stati/e', example: 'Siete stati gentili.' },
            'Loro': { word: 'sono stati/e', example: 'Sono stati qui ieri.' },
          },
          'Imperfetto': {
            'Io': { word: 'ero', example: 'Ero bambino.' },
            'Tu': { word: 'eri', example: 'Eri in casa?' },
            'Lui/Lei': { word: 'era', example: 'Era un giorno caldo.' },
            'Noi': { word: 'eravamo', example: 'Eravamo stanchi.' },
            'Voi': { word: 'eravate', example: 'Eravate amici.' },
            'Loro': { word: 'erano', example: 'Erano felici.' },
          },
          'Presente': {
            'Io': { word: 'sono', example: 'Io sono stanco.' },
            'Tu': { word: 'sei', example: 'Tu sei felice.' },
            'Lui/Lei': { word: 'è', example: 'Lei è molto bella.' },
            'Noi': { word: 'siamo', example: 'Siamo pronti.' },
            'Voi': { word: 'siete', example: 'Siete sicuri?' },
            'Loro': { word: 'sono', example: 'Loro sono fratelli.' },
          },
          'Condizionale': {
            'Io': { word: 'sarei', example: 'Sarei felice di aiutarti.' },
            'Tu': { word: 'saresti', example: 'Saresti d\'accordo?' },
            'Lui/Lei': { word: 'sarebbe', example: 'Sarebbe fantastico.' },
            'Noi': { word: 'saremmo', example: 'Saremmo pronti.' },
            'Voi': { word: 'sareste', example: 'Sareste così gentili?' },
            'Loro': { word: 'sarebbero', example: 'Sarebbero felici.' },
          },
          'Futuro Semplice': {
            'Io': { word: 'sarò', example: 'Sarò lì alle 8.' },
            'Tu': { word: 'sarai', example: 'Tu sarai con me.' },
            'Lui/Lei': { word: 'sarà', example: 'Domani sarà bellissimo.' },
            'Noi': { word: 'saremo', example: 'Saremo amici per sempre.' },
            'Voi': { word: 'sarete', example: 'Sarete stanchi dopo il viaggio.' },
            'Loro': { word: 'saranno', example: 'Saranno qui presto.' },
          },
          'Futuro Anteriore': {
            'Io': { word: 'sarò stato/a', example: 'Sarò stato sfortunato.' },
            'Tu': { word: 'sarai stato/a', example: 'Sarai stato occupato.' },
            'Lui/Lei': { word: 'sarà stato/a', example: 'Sarà stato tardi.' },
            'Noi': { word: 'saremo stati/e', example: 'Saremo stati insieme.' },
            'Voi': { word: 'sarete stati/e', example: 'Sarete stati stanchi.' },
            'Loro': { word: 'saranno stati/e', example: 'Saranno stati felici.' },
          }
    }
  },
  {
    id: 'vedere', root: 'Vedere', translation: 'To see / Didan', color: '#f59e0b', type: 'ERE (Reg)',
    conjugations: {
        'Passato Prossimo': {
            'Io': { word: 'ho visto', example: 'Ho visto un bel film.' },
            'Tu': { word: 'hai visto', example: 'Hai visto il mio gatto?' },
            'Lui/Lei': { word: 'ha visto', example: 'Marco ha visto tutto.' },
            'Noi': { word: 'abbiamo visto', example: 'Abbiamo visto Roma.' },
            'Voi': { word: 'avete visto', example: 'Avete visto la partita?' },
            'Loro': { word: 'hanno visto', example: 'Loro hanno visto il mare.' },
        },
        'Imperfetto': {
            'Io': { word: 'vedevo', example: 'Non ci vedevo bene.' },
            'Tu': { word: 'vedevi', example: 'Vedevi le stelle?' },
            'Lui/Lei': { word: 'vedeva', example: 'Lei non vedeva l\'ora.' },
            'Noi': { word: 'vedevamo', example: 'Vedevamo il tramonto.' },
            'Voi': { word: 'vedevate', example: 'Voi vedevate la tv.' },
            'Loro': { word: 'vedevano', example: 'Vedevano tutto dal balcone.' },
        },
        'Presente': {
            'Io': { word: 'vedo', example: 'Vedo una luce.' },
            'Tu': { word: 'vedi', example: 'Non vedi che piove?' },
            'Lui/Lei': { word: 'vede', example: 'Lei vede lontano.' },
            'Noi': { word: 'vediamo', example: 'Ci vediamo domani.' },
            'Voi': { word: 'vedete', example: 'Vedete quel palazzo?' },
            'Loro': { word: 'vedono', example: 'Loro non vedono bene.' },
        },
        'Condizionale': {
            'Io': { word: 'vedrei', example: 'Vedrei quel film.' },
            'Tu': { word: 'vedresti', example: 'Te lo vedresti?' },
            'Lui/Lei': { word: 'vedrebbe', example: 'Lo vedrebbe subito.' },
            'Noi': { word: 'vedremmo', example: 'Ci vedremmo domani, ok?' },
            'Voi': { word: 'vedreste', example: 'Voi cosa vedreste?' },
            'Loro': { word: 'vedrebbero', example: 'Non ci vedrebbero mai.' },
        },
        'Futuro Semplice': {
            'Io': { word: 'vedrò', example: 'Vedrò cosa posso fare.' },
            'Tu': { word: 'vedrai', example: 'Vedrai che andrà bene.' },
            'Lui/Lei': { word: 'vedrà', example: 'Il dottore ti vedrà ora.' },
            'Noi': { word: 'vedremo', example: 'Vedremo chi avrà ragione.' },
            'Voi': { word: 'vedrete', example: 'Vedrete grandi cose.' },
            'Loro': { word: 'vedranno', example: 'I tuoi amici vedranno.' },
        },
        'Futuro Anteriore': {
            'Io': { word: 'avrò visto', example: 'Avrò visto male io.' },
            'Tu': { word: 'avrai visto', example: 'Avrai visto il telegiornale.' },
            'Lui/Lei': { word: 'avrà visto', example: 'Avrà visto un fantasma.' },
            'Noi': { word: 'avremo visto', example: 'Avremo visto tre musei.' },
            'Voi': { word: 'avrete visto', example: 'L\'avrete visto.' },
            'Loro': { word: 'avranno visto', example: 'Non avranno visto il cartello.' },
        }
    }
  }
];

const SUBJECTS: Subject[] = ['Io', 'Tu', 'Lui/Lei', 'Noi', 'Voi', 'Loro'];

const TENSE_CATEGORIES = [
  { id: 'passato', label: 'Passato', subTenses: ['Passato Prossimo', 'Imperfetto'] },
  { id: 'presente', label: 'Presente', subTenses: ['Presente', 'Condizionale'] },
  { id: 'futuro', label: 'Futuro', subTenses: ['Futuro Semplice', 'Futuro Anteriore'] }
];

export const VerbLabView: React.FC<VerbLabViewProps> = ({ onBack, isDarkMode, currentTheme }) => {
  const [activeVerbIndex, setActiveVerbIndex] = useState(0);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  
  // Tense scrubber (0 = passato, 1 = presente, 2 = futuro)
  const [mainTenseIndex, setMainTenseIndex] = useState(1); 
  const [subTenseIndex, setSubTenseIndex] = useState(0); // For the rotary dial

  useEffect(() => {
    // Reset sub-tense when changing main tense
    setSubTenseIndex(0);
  }, [mainTenseIndex]);

  const activeVerb = VERBS[activeVerbIndex];
  const activeSubject = SUBJECTS[activeSubjectIndex];
  
  const currentCategory = TENSE_CATEGORIES[mainTenseIndex];
  const currentSubTenseName = currentCategory.subTenses[subTenseIndex];
  
  // Some verbs might not have a conjugation object mapped if there's a typo, this acts as a fallback.
  const currentConjugation = activeVerb.conjugations[currentSubTenseName]?.[activeSubject] || { word: '---', example: '---' };

  const handleNextVerb = () => {
    setActiveVerbIndex((prev) => (prev + 1) % VERBS.length);
  };

  const handlePrevVerb = () => {
    setActiveVerbIndex((prev) => (prev - 1 + VERBS.length) % VERBS.length);
  };

  const cycleSubject = () => {
    setActiveSubjectIndex((prev) => (prev + 1) % SUBJECTS.length);
  };

  const toggleSubTense = () => {
    setSubTenseIndex((prev) => (prev + 1) % currentCategory.subTenses.length);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${isDarkMode ? 'bg-black/60 backdrop-blur-3xl text-white' : 'bg-white/60 backdrop-blur-3xl text-slate-800'}`}>
      <div className="absolute inset-0 w-full max-w-[26.875rem] mx-auto relative h-full flex flex-col pt-safe">
        
        {/* Dynamic Scientific Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-[120px] opacity-10 transition-colors duration-1000"
             style={{ backgroundColor: activeVerb.color }}
           />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.25] mix-blend-overlay"></div>
        </div>

        {/* Floating Top Elements */}
        <div className="absolute top-0 left-0 right-0 w-full pt-8 px-3 pointer-events-none z-[150] flex justify-center items-start">
          <div className="text-center flex flex-col items-center pointer-events-auto">
            <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${isDarkMode ? 'text-white/80' : 'text-slate-500'}`}>
              <Beaker size={14} className="opacity-70" />
              Verbi Italiani
            </h2>
            <div className="flex gap-1 mt-1">
               {VERBS.map((v, i) => (
                 <div key={v.id} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeVerbIndex ? 'bg-white scale-125' : 'bg-white/20'}`} />
               ))}
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center absolute right-6">
            <Activity size={20} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />
          </div>
        </div>

        {/* Experiment Stage */}
        <div className="relative flex-1 flex flex-col items-center justify-center pl-4 pr-4 pt-24 pb-32 overflow-hidden pointer-events-auto">
          
          {/* Top: Root Selector */}
          <div className="flex items-center justify-between w-full mb-2 mt-2 shrink-0">
            <button onClick={handlePrevVerb} className="p-2 opacity-50 hover:opacity-100 transition-opacity active:scale-90">
              <ChevronLeft size={32} />
            </button>
            
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                {activeVerb.translation} • {activeVerb.type}
              </p>
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={activeVerb.root}
                  initial={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  className="text-3xl md:text-4xl font-black tracking-tight"
                  style={{ color: activeVerb.color }}
                >
                  {activeVerb.root}
                </motion.h1>
              </AnimatePresence>
            </div>

            <button onClick={handleNextVerb} className="p-2 opacity-50 hover:opacity-100 transition-opacity active:scale-90">
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Morphing Chamber */}
          <div className="relative w-full max-w-[200px] aspect-square flex flex-col items-center justify-center shrink-0 my-2">
             
             {/* Chamber Rings */}
             <div className="absolute inset-0 border border-white/10 rounded-full scale-105 pointer-events-none" />
             <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.15] pointer-events-none border-dashed" />
             
             {/* Dynamic Energy rings reacting to Tense */}
             <motion.div 
               className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
               animate={{ 
                 rotate: mainTenseIndex === 0 ? -45 : mainTenseIndex === 2 ? 45 : 0,
                 scale: [1, 1.05, 1]
               }}
               transition={{ rotate: { duration: 0.5, type: 'spring' }, scale: { repeat: Infinity, duration: 4 } }}
               style={{ 
                 background: `radial-gradient(circle, transparent 40%, ${activeVerb.color}15 60%, transparent 70%)` 
               }}
             />

             {/* Subject Button (Catalyst) */}
             <button 
               onClick={cycleSubject}
               className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide glass border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] z-20"
             >
               <span style={{ color: activeVerb.color }}>{activeSubject}</span>
             </button>

             {/* The Morphing Word */}
             <div className="relative z-10 w-full text-center px-3 mt-4">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={`${activeVerb.root}-${currentSubTenseName}-${activeSubject}`}
                   initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                   animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                   exit={{ opacity: 0, scale: 1.2, filter: 'blur(8px)' }}
                   transition={{ duration: 0.3 }}
                 >
                   <h2 className="text-2xl font-serif mb-2 text-white drop-shadow-md">
                     {currentConjugation.word}
                   </h2>
                 </motion.div>
               </AnimatePresence>
             </div>

             {/* Example Display */}
             <div className="absolute -bottom-10 w-[140%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={`ex-${activeVerb.root}-${currentSubTenseName}-${activeSubject}`}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="glass px-3 py-2 rounded-2xl border border-white/10 shadow-xl inline-block"
                   >
                     <p className={`text-[11px] leading-tight italic font-serif ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                       "{currentConjugation.example}"
                     </p>
                   </motion.div>
                 </AnimatePresence>
             </div>
          </div>

          <div className="w-full flex-1 min-h-[5rem] lg:min-h-[8rem]" />

          {/* Controls Deck */}
          <div className="w-full pb-safe shrink-0 mt-16">

            {/* Rotary Carousel for Sub-Tenses (Above Time Scrubber) */}
            <div className="flex flex-col items-center justify-center w-full relative mb-4">
               <div className="relative flex items-center justify-center w-[220px] h-[40px] perspective-[400px]">
                  <button 
                    onClick={() => {
                        setSubTenseIndex((prev) => (prev - 1 + currentCategory.subTenses.length) % currentCategory.subTenses.length);
                    }} 
                    className={`absolute -left-10 p-2 z-10 transition-opacity active:scale-90 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <motion.div 
                    className="relative w-full h-full cursor-grab active:cursor-grabbing rounded-[12px] overflow-hidden flex items-center justify-center"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(180deg, #101016 0%, #1c1c24 50%, #101016 100%)' 
                        : 'linear-gradient(180deg, #cbd1d6 0%, #f1f3f5 50%, #cbd1d6 100%)',
                      boxShadow: isDarkMode
                        ? 'inset 0 8px 10px rgba(0,0,0,0.7), inset 0 -8px 10px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.4)'
                        : 'inset 0 8px 10px rgba(0,0,0,0.15), inset 0 -8px 10px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.1)',
                      borderTop: `1px solid ${isDarkMode ? '#222' : '#fff'}`,
                      borderBottom: `1px solid ${isDarkMode ? '#050505' : '#bbb'}`,
                      transformStyle: 'preserve-3d',
                      transform: 'perspective(400px) rotateX(10deg) scaleX(0.95)',
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, { offset }) => {
                       const swipe = offset.x;
                       if (swipe < -20) toggleSubTense();
                       else if (swipe > 20) {
                         setSubTenseIndex((prev) => (prev - 1 + currentCategory.subTenses.length) % currentCategory.subTenses.length);
                       }
                    }}
                  >
                     {/* Grooves / Grip lines */}
                     <div className="absolute inset-0 opacity-[0.12] pointer-events-none flex justify-center gap-[4px] px-2 mix-blend-overlay">
                        {[...Array(40)].map((_, i) => (
                          <div key={i} className="w-[1px] h-full bg-gradient-to-b from-transparent via-current to-transparent" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                        ))}
                     </div>
                     
                     {/* Active Value Display */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%, black 65%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 35%, black 65%, transparent)' }}>
                       <AnimatePresence initial={false} mode="wait">
                          <motion.div
                             key={subTenseIndex}
                             initial={{ opacity: 0, x: 40, scale: 0.8, rotateY: -30 }}
                             animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                             exit={{ opacity: 0, x: -40, scale: 0.8, rotateY: 30 }}
                             transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                             className="px-3 py-1.5 rounded-md"
                             style={{ 
                               backgroundColor: `${activeVerb.color}20`,
                               border: `1px solid ${activeVerb.color}40`,
                               boxShadow: `inset 0 0 10px ${activeVerb.color}20`,
                               backdropFilter: 'blur(2px)'
                             }}
                          >
                            <span className="font-bold text-[11px] tracking-widest uppercase drop-shadow-md whitespace-nowrap" style={{ color: activeVerb.color }}>
                              {currentCategory.subTenses[subTenseIndex]}
                            </span>
                          </motion.div>
                       </AnimatePresence>
                     </div>

                     {/* Edge shadows for 3D barrel horizontal curve distortion */}
                     <div className="absolute inset-0 pointer-events-none rounded-[12px]" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(3,7,18,0.95) 0%, transparent 15%, transparent 85%, rgba(3,7,18,0.95) 100%)' : 'linear-gradient(to right, rgba(248,249,250,0.9) 0%, transparent 15%, transparent 85%, rgba(248,249,250,0.9) 100%)' }} />
                  </motion.div>
                  
                  <button 
                    onClick={toggleSubTense} 
                    className={`absolute -right-10 p-2 z-10 transition-opacity active:scale-90 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
               </div>
            </div>

            {/* Time Scrubber (Main Tenses) */}
            <div className="w-full relative px-2 mb-4">
              <div className="flex justify-between w-full mb-3 px-1">
                {TENSE_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setMainTenseIndex(idx)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all px-2 py-1 ${
                      mainTenseIndex === idx ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-40 hover:opacity-70'
                    }`}
                    style={{ color: mainTenseIndex === idx ? activeVerb.color : isDarkMode ? '#fff' : '#000' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              
              <div className="relative h-12 flex items-center mx-4">
                {/* Track */}
                <div className={`absolute left-0 right-0 h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'} shadow-inner`} />
                {/* Active Track connection */}
                <div className="absolute h-2 left-0 rounded-full transition-all duration-300" 
                  style={{ 
                    width: mainTenseIndex === 0 ? '0%' : mainTenseIndex === 1 ? '50%' : '100%',
                    backgroundColor: `${activeVerb.color}40` 
                  }} 
                />
                
                {/* Interactive Scrubber Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="1"
                  value={mainTenseIndex}
                  onChange={(e) => setMainTenseIndex(parseInt(e.target.value))}
                  className="absolute w-full opacity-0 cursor-ew-resize h-full z-20 top-0 left-0"
                />

                {/* Fake thumb */}
                <motion.div 
                  className="absolute w-7 h-7 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none flex items-center justify-center top-1/2 -mt-3.5"
                  style={{ 
                    backgroundColor: isDarkMode ? '#1e1e24' : '#fff',
                    border: `2px solid ${activeVerb.color}`
                  }}
                  animate={{
                    left: mainTenseIndex === 0 ? '0%' : mainTenseIndex === 1 ? '50%' : '100%',
                    x: mainTenseIndex === 0 ? '0%' : mainTenseIndex === 1 ? '-50%' : '-100%'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeVerb.color, boxShadow: `0 0 10px ${activeVerb.color}` }} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
