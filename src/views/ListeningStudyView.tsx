/* cspell:ignore d'Ascolto */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Headphones, Clock, Lock, Check,
  Volume2, HelpCircle, Award, BookOpen, Music, CheckCircle2, RotateCcw,
  ChevronLeft, Settings2, Eye, EyeOff
} from 'lucide-react';
import { CircularEqualizer } from '../components/CircularEqualizer';
import { ThemeColors } from '../types';

interface ListeningStudyViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  currentTheme?: ThemeColors;
}

interface TranscriptLine {
  textIt: string; // Italian sentence
  textEn: string; // English translation
  timeStart: number; // percentage start (0-100)
  timeEnd: number; // percentage end (0-100)
}

interface Track {
  id: string;
  title: string;
  subtitle?: string;
  duration: string;
  status: 'completed' | 'available' | 'locked';
  color: string;
  audioUrl: string;
  level: string;
  category: string;
  transcript: TranscriptLine[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  keywords: { word: string; translation: string; pronunciation: string }[];
}

const TRACKS_DATA: Track[] = [
  { 
    id: 'track_001', 
    title: 'Caffè a Venezia', 
    level: 'Principiante', 
    duration: '02:45',
    category: 'Vita Quotidiana',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#60efff',
    status: 'completed',
    transcript: [
      { textIt: "Buongiorno! Desidero un caffè espresso, per favore.", textEn: "Good morning! I would like an espresso coffee, please.", timeStart: 0, timeEnd: 25 },
      { textIt: "Certo! Lo vuole macchiato o semplice?", textEn: "Sure! Would you like it with milk or plain?", timeStart: 25, timeEnd: 50 },
      { textIt: "Semplice, e con un cornetto caldo alla crema.", textEn: "Plain, and with a warm custard croissant.", timeStart: 50, timeEnd: 75 },
      { textIt: "Molto bene. Sono quattro euro in totale.", textEn: "Very well. That is four euros in total.", timeStart: 75, timeEnd: 100 }
    ],
    quiz: {
      question: "What pastry does the customer order along with the espresso?",
      options: ["Un panino", "Un tiramisù", "Un cornetto alla crema", "Una frittella"],
      answer: "Un cornetto alla crema",
      explanation: "The customer specifies 'un cornetto caldo alla crema'."
    },
    keywords: [
      { word: "Buongiorno", translation: "Good morning", pronunciation: "bwon-djorn-oh" },
      { word: "Desidero", translation: "I desire / want", pronunciation: "deh-zee-deh-roh" }
    ]
  },
  { 
    id: 'track_002', 
    title: 'L\'Arte del Gelato', 
    level: 'Intermedio', 
    duration: '03:12',
    category: 'Cultura',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#a855f7',
    status: 'available',
    transcript: [],
    quiz: { question: "", options: [], answer: "", explanation: "" },
    keywords: []
  },
  { 
    id: 'track_003', 
    title: 'In Treno per Roma', 
    level: 'Avanzato', 
    duration: '04:05',
    category: 'Viaggi',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#fbbf24',
    status: 'available',
    transcript: [],
    quiz: { question: "", options: [], answer: "", explanation: "" },
    keywords: []
  },
  { 
    id: 'track_004', 
    title: 'Mistero al Colosseo', 
    level: 'Avanzato', 
    duration: '05:22',
    category: 'Narrativa',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    color: '#ef4444',
    status: 'locked',
    transcript: [],
    quiz: { question: "", options: [], answer: "", explanation: "" },
    keywords: []
  }
];

// Injected styles for animations and layout utilities
const SHARED_STYLES = `
  @keyframes eq-bar-anim {
    0% { transform: rotate(var(--angle)) translateY(-49px) scaleY(0.3); opacity: 0.4; }
    100% { transform: rotate(var(--angle)) translateY(-49px) scaleY(1.3); opacity: 1; }
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

export const ListeningStudyView: React.FC<ListeningStudyViewProps> = ({ onBack, isDarkMode, currentTheme }) => {
  const [tracks, setTracks] = useState<Track[]>(TRACKS_DATA);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const progressOrbitRef = useRef<HTMLDivElement | null>(null);
  
  // Skeuomorphic Vertical Thumbwheel State and Reference controls
  const [volume, setVolume] = useState<number>(0.8);
  const [isDraggingVolWheel, setIsDraggingVolWheel] = useState(false);
  const [isDraggingSpeedWheel, setIsDraggingSpeedWheel] = useState(false);
  const wheelVolStartYRef = useRef<number>(0);
  const wheelVolStartValRef = useRef<number>(0);
  const wheelSpeedStartYRef = useRef<number>(0);
  const wheelSpeedStartValRef = useRef<number>(0);

  // Inject shared styles once
  useEffect(() => {
    const styleId = 'listening-study-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = SHARED_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  const [activePanel, setActivePanel] = useState<'transcript' | 'vocabulary' | 'challenge'>('transcript');

  // Subtitle overlay visibility toggles
  const [showItalianSub, setShowItalianSub] = useState(true);
  const [showEnglishSub, setShowEnglishSub] = useState(true);
  const [showSubControls, setShowSubControls] = useState(false);
  
  // Custom decryption vocabulary signals state
  const [decryptedWords, setDecryptedWords] = useState<Record<string, boolean>>({});

  // Quiz state markers
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // HTML5 audio reference for audio files
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Navigate back
  const handleInternalBack = () => {
    if (activeTrack) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setActiveTrack(null);
    } else {
      onBack();
    }
  };

  // Initial synchronization for audio element
  useEffect(() => {
    if (activeTrack && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = activeTrack.audioUrl;
      audioRef.current.load();
      setProgress(0);
      setIsPlaying(false);
      setQuizAnswer(null);
      setIsAnswerCorrect(null);
      setSubmittedQuiz(false);
      setDecryptedWords({});
    }
  }, [activeTrack]);

  // Handle Play/Pause operations
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Audio play prevented or interrupted.", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync playback speed rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeTrack]);

  // Sync playback volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, activeTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(100);
    // Switch automatic view helper to the comprehension challenge
    setActivePanel('challenge');
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return "00:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Web Speech API synthesis for native Italian pronunciations
  const handleTTS = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.90; // Speech slightly slowed for learning
      
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v => v.lang.startsWith('it') || v.lang.includes('it-IT'));
      if (italianVoice) {
        utterance.voice = italianVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS not supported in this browser.");
    }
  };

  // Scrubbing controller
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newPercentage = Math.min(Math.max(clickX / width, 0), 1);
      const targetTime = newPercentage * audioRef.current.duration;
      audioRef.current.currentTime = targetTime;
      setProgress(newPercentage * 100);
    }
  };

  // Vintage radial tuner dial controller mapping rotational angle to track duration
  const handleVintageTuningClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clickX = e.clientX - centerX;
    const clickY = e.clientY - centerY;
    
    const angleRad = Math.atan2(clickY, clickX);
    let angleDeg = angleRad * (180 / Math.PI);
    let normalizedAngle = angleDeg + 90;
    if (normalizedAngle < 0) {
      normalizedAngle += 360;
    }
    
    const pct = normalizedAngle / 360;
    const targetTime = pct * audioRef.current.duration;
    if (!isNaN(targetTime)) {
      audioRef.current.currentTime = targetTime;
      setProgress(pct * 100);
    }
  };

  // Submit Answer to unlock completion status
  const submitAnswer = (option: string) => {
    if (!activeTrack) return;
    setQuizAnswer(option);
    const correct = option === activeTrack.quiz.answer;
    setIsAnswerCorrect(correct);
    setSubmittedQuiz(true);

    if (correct) {
      // Mark lesson as completed inside state
      setTracks(prev => prev.map(t => {
        if (t.id === activeTrack.id) {
          return { ...t, status: 'completed' };
        }
        // Unlock next lock of sequence automatically
        const currentIdx = prev.findIndex(item => item.id === activeTrack.id);
        const targetNextIdx = prev.findIndex(item => item.id === t.id);
        if (targetNextIdx === currentIdx + 1 && t.status === 'locked') {
          return { ...t, status: 'available' };
        }
        return t;
      }));
    }
  };

  // Find the exact active transcription line depending on percentage progress
  const getActiveTranscriptLine = () => {
    if (!activeTrack || !activeTrack.transcript || activeTrack.transcript.length === 0) return null;
    const found = activeTrack.transcript.find(line => progress >= line.timeStart && progress <= line.timeEnd);
    return found || activeTrack.transcript[0];
  };



  // Convert coordinate drag back to timeline progress percentage
  const handleOrbitProgressDrag = (clientX: number, clientY: number, containerElement: HTMLDivElement) => {
    if (!audioRef.current || isNaN(audioRef.current.duration) || audioRef.current.duration === 0) return;
    const rect = containerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Angle in degrees where top (12 o'clock) is 0
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI) + 90;
    if (angleDeg < 0) {
      angleDeg += 360;
    }
    
    // Map angle [0, 360] to progress percentage [0, 100]
    const pct = Math.max(0, Math.min(1, angleDeg / 360));
    const targetTime = pct * audioRef.current.duration;
    if (!isNaN(targetTime)) {
      audioRef.current.currentTime = targetTime;
      setProgress(pct * 100);
    }
  };

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProgress(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (progressOrbitRef.current) {
      handleOrbitProgressDrag(e.clientX, e.clientY, progressOrbitRef.current);
    }
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingProgress && progressOrbitRef.current) {
      handleOrbitProgressDrag(e.clientX, e.clientY, progressOrbitRef.current);
    }
  };

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingProgress(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Left Wheel (Volume) Drag Event Handlers
  const handleVolWheelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVolWheel(true);
    wheelVolStartYRef.current = e.clientY;
    wheelVolStartValRef.current = volume;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleVolWheelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVolWheel) {
      const deltaY = e.clientY - wheelVolStartYRef.current;
      const updatedVolume = Math.max(0, Math.min(1, wheelVolStartValRef.current - deltaY / 140));
      setVolume(updatedVolume);
    }
  };

  const handleVolWheelPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingVolWheel(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Right Wheel (Speed) Drag Event Handlers
  const handleSpeedWheelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingSpeedWheel(true);
    wheelSpeedStartYRef.current = e.clientY;
    wheelSpeedStartValRef.current = playbackSpeed;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSpeedWheelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSpeedWheel) {
      const deltaY = e.clientY - wheelSpeedStartYRef.current;
      const updatedSpeed = Math.max(0.5, Math.min(1.5, wheelSpeedStartValRef.current - deltaY / 140));
      const roundedSpeed = Math.round(updatedSpeed * 20) / 20;
      setPlaybackSpeed(roundedSpeed);
    }
  };

  const handleSpeedWheelPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSpeedWheel(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${isDarkMode ? 'bg-black/60 backdrop-blur-3xl text-white' : 'bg-white/60 backdrop-blur-3xl text-slate-800'}`}
    >
      {/* Native HTML audio node hidden in background */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Main viewport limit wrapper */}
      <div 
        id="listening-main-viewport"
        className="absolute inset-0 w-full max-w-[26.875rem] mx-auto relative h-full flex flex-col"
      >
        
        {/* Cinematic Backdrop with rotating colorful fluid glow filter */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div 
             id="listening-dynamic-glow"
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vw] max-w-[600px] max-h-[600px] rounded-full blur-[110px] opacity-25 transition-all duration-1000"
             style={{ backgroundColor: activeTrack ? activeTrack.color : '#a855f7' }}
           />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        </div>

        {/* Global floating application Header space */}
        <div 
          id="listening-header"
          className="absolute top-0 left-0 right-0 w-full pt-8 px-6 pointer-events-none z-[150] flex justify-between items-center"
        >
          <div className="w-11 h-11" />

          <div className="text-center pointer-events-auto flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!activeTrack ? (
                <motion.h2 
                  key="list-title"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className={`text-[11px] font-black tracking-widest uppercase font-mono ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                >
                  Studio d'Ascolto
                </motion.h2>
              ) : (
                <motion.div
                  key="player-title"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="flex flex-col items-center"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="w-11 h-11 flex items-center justify-center bg-transparent">
            {!activeTrack ? (
              <Headphones size={20} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />
            ) : (
              <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${isPlaying ? 'text-emerald-500 bg-emerald-500' : 'text-stone-500 bg-stone-500'}`} />
            )}
          </div>
        </div>

        {/* Primary Interactive Module Stage */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {!activeTrack ? (
              /* --- TRACK SELECTION VIEW --- */
              <motion.div 
                key="track-list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 overflow-y-auto px-5 pt-28 pb-10 space-y-5 scrollbar-hide"
              >


                {/* Subtitle label section */}
                <p className={`text-[10px] font-extrabold tracking-widest uppercase font-mono ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
                  Lezioni Audio Disponibili
                </p>

                {/* Vertical Lessons Trail */}
                <div 
                  id="listening-lesson-trail"
                  className="space-y-4"
                >
                  {tracks?.map((track, i) => {
                    const isLocked = track.status === 'locked';
                    const isCompleted = track.status === 'completed';
                    
                    return (
                      <motion.div
                        key={track.id}
                        id={`listening-lesson-card-${track.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => !isLocked && setActiveTrack(track)}
                        className={`group relative p-5 rounded-[28px] overflow-hidden transition-all duration-300 border ${
                          isLocked 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer active:scale-[0.98]'
                        } ${
                          isDarkMode 
                            ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10' 
                            : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                        }`}
                      >
                        {/* Selected accent glow */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
                          style={{ backgroundColor: isLocked ? '#64748b' : track.color }}
                        />

                        <div className="flex items-center gap-4 relative z-10">
                          {/* Play/Check Indicators */}
                          <div 
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 ${
                              isDarkMode ? 'bg-white/5' : 'bg-slate-100'
                            }`}
                          >
                            {isLocked ? (
                              <Lock size={18} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />
                            ) : isCompleted ? (
                              <CheckCircle2 size={20} className="text-emerald-400 animate-pulse" />
                            ) : (
                              <Play size={18} style={{ color: track.color }} className="ml-0.5" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Class/Level Tag */}
                            <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                              style={{ 
                                backgroundColor: isLocked ? 'rgba(100, 116, 139, 0.1)' : `${track.color}15`, 
                                color: isLocked ? '#94a3b8' : track.color 
                              }}
                            >
                              {track.level}
                            </span>
                            <h3 className={`font-black text-[15px] leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              {track.title}
                            </h3>
                            <p className={`text-xs truncate mt-0.5 ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
                              {track.subtitle}
                            </p>
                          </div>

                          <div className={`text-[10px] font-mono shrink-0 flex items-center gap-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                            <Clock size={11} /> {track.duration}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* --- DOCK-IN INTERACTIVE PLAYER VIEW --- */
              <motion.div 
                key="player"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col h-full pt-12 px-4 min-h-0"
              >
                {/* H2 Title precisely above the player */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 text-center select-none"
                >
                  <h2 className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeTrack.title}
                  </h2>
                </motion.div>

                {/* FLATTENED FLOATING PLAYER CONTROLS */}
                <div className="flex items-center justify-between w-full max-w-[340px] mx-auto px-4 relative mb-3 select-none no-drag">
                    
                    {/* LEFT WHEEL: Volume Tube */}
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="flex items-center gap-1 bg-black/40 border border-white/5 py-0.5 px-1.5 rounded-md backdrop-blur-sm">
                        <Volume2 size={9} className="text-[#60efff] opacity-80" />
                        <span className="text-[9px] font-mono font-bold text-white/70">
                          {Math.round(volume * 100)}%
                        </span>
                      </div>

                      <div 
                        onPointerDown={handleVolWheelPointerDown}
                        onPointerMove={handleVolWheelPointerMove}
                        onPointerUp={handleVolWheelPointerUp}
                        className="relative w-7 h-24 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col items-center overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20 active:scale-95"
                        style={{ touchAction: 'none' }}
                      >
                        {/* Fluid Track Background */}
                        <div 
                          className="absolute bottom-0 w-full transition-all duration-300 ease-out opacity-20"
                          style={{
                            height: `${volume * 100}%`,
                            background: `linear-gradient(to top, ${activeTrack.color || '#a855f7'}, transparent)`,
                            filter: 'blur(8px)'
                          }}
                        />

                        {/* Scrolling Grooves */}
                        <div 
                          className="absolute inset-0 flex flex-col justify-around py-4 opacity-10 pointer-events-none"
                          style={{ transform: `translateY(${((volume * 100) % 10)}px)` }}
                        >
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-white" />
                          ))}
                        </div>

                        {/* Glowing Glass Indicator */}
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 w-5 h-2 rounded-full z-20 transition-all duration-150"
                          style={{
                            bottom: `calc(${volume * 100}% - 4px)`,
                            background: isPlaying ? (activeTrack.color || '#a855f7') : '#fff',
                            boxShadow: isPlaying ? `0 0 15px ${activeTrack.color || '#a855f7'}` : '0 0 5px rgba(255,255,255,0.5)',
                            opacity: 0.9
                          }}
                        />
                      </div>
                      
                      <span className="text-[7.5px] font-black font-mono tracking-widest text-[#60efff]/60 uppercase">VOL</span>
                    </div>

                    {/* CENTER PLAYER */}
                    <CircularEqualizer 
                      isPlaying={isPlaying} 
                      onToggle={() => setIsPlaying(!isPlaying)} 
                    />

                    {/* RIGHT WHEEL: Speed Tube */}
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="flex items-center gap-1 bg-black/40 border border-white/5 py-0.5 px-1.5 rounded-md backdrop-blur-sm">
                        <span className="text-[9px] font-mono font-bold text-white/70">
                          {playbackSpeed.toFixed(1)}x
                        </span>
                      </div>

                      <div 
                        onPointerDown={handleSpeedWheelPointerDown}
                        onPointerMove={handleSpeedWheelPointerMove}
                        onPointerUp={handleSpeedWheelPointerUp}
                        className="relative w-7 h-24 cursor-pointer rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] backdrop-blur-xl flex flex-col items-center overflow-hidden shadow-2xl transition-all duration-300 hover:border-blue-400/20 active:scale-95"
                        style={{ touchAction: 'none' }}
                      >
                        {/* Fluid Track Background */}
                        <div 
                          className="absolute bottom-0 w-full transition-all duration-300 ease-out opacity-20"
                          style={{
                            height: `${(playbackSpeed - 0.5) * 100}%`,
                            background: `linear-gradient(to top, #60efff, transparent)`,
                            filter: 'blur(8px)'
                          }}
                        />

                        {/* Scrolling Grooves */}
                        <div 
                          className="absolute inset-0 flex flex-col justify-around py-4 opacity-10 pointer-events-none"
                          style={{ transform: `translateY(${((playbackSpeed * 100) % 10)}px)` }}
                        >
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-white" />
                          ))}
                        </div>

                        {/* Glowing Glass Indicator */}
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 w-5 h-2 rounded-full z-20 transition-all duration-150"
                          style={{
                            bottom: `calc(${(playbackSpeed - 0.5) * 100}% - 4px)`,
                            background: isPlaying ? '#60efff' : '#fff',
                            boxShadow: isPlaying ? '0 0 15px #60efff' : '0 0 5px rgba(255,255,255,0.5)',
                            opacity: 0.9
                          }}
                        />
                      </div>

                      <span className="text-[7.5px] font-black font-mono tracking-widest text-[#60efff]/60 uppercase">SPD</span>
                    </div>

                  </div>



                  {/* Subtitle / HUD reading frame with visibility toggles */}
                  <div className="relative w-full mt-2">
                    {/* Subtitle Settings Toggle */}
                    <button 
                      onClick={() => setShowSubControls(!showSubControls)}
                      className="absolute -top-9 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 z-20 hover:scale-110 active:scale-95"
                      style={{
                        background: showSubControls ? `${activeTrack.color}30` : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${showSubControls ? `${activeTrack.color}50` : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: showSubControls ? `0 0 12px ${activeTrack.color}25` : 'none'
                      }}
                      title="Impostazioni sottotitoli"
                    >
                      <Settings2 size={14} className="transition-colors duration-200" style={{ color: showSubControls ? activeTrack.color : 'rgba(255,255,255,0.5)' }} />
                    </button>

                    {/* Subtitle Visibility Controls Popover */}
                    <AnimatePresence>
                      {showSubControls && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -top-[5.5rem] right-2 flex flex-col gap-1 p-2 rounded-xl z-30 border"
                          style={{
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderColor: `${activeTrack.color}25`
                          }}
                        >
                          <button 
                            onClick={() => setShowItalianSub(!showItalianSub)} 
                            className="flex items-center gap-2 text-xs text-white p-1.5 rounded-lg transition-all hover:bg-white/10"
                            style={{ color: showItalianSub ? activeTrack.color : 'rgba(255,255,255,0.4)' }}
                          >
                            {showItalianSub ? <Eye size={13} /> : <EyeOff size={13} />}
                            <span className="font-semibold text-[11px]">Italiano</span>
                          </button>
                          <button 
                            onClick={() => setShowEnglishSub(!showEnglishSub)} 
                            className="flex items-center gap-2 text-xs text-white p-1.5 rounded-lg transition-all hover:bg-white/10"
                            style={{ color: showEnglishSub ? activeTrack.color : 'rgba(255,255,255,0.4)' }}
                          >
                            {showEnglishSub ? <Eye size={13} /> : <EyeOff size={13} />}
                            <span className="font-semibold text-[11px]">English</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Main Subtitle Display with Fade Mask */}
                    <div 
                      className="relative overflow-hidden px-4 py-3 min-h-[55px] flex flex-col justify-center rounded-2xl border relative z-10"
                      style={{
                        background: 'rgba(0,0,0,0.25)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderColor: `${activeTrack.color}10`,
                        maskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 100%)',
                        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 100%)'
                      }}
                    >
                      {/* TTS Button */}
                      <button
                        onClick={(e) => {
                          const currentLine = getActiveTranscriptLine();
                          if (currentLine) handleTTS(currentLine.textIt, e);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-xl active:scale-95 transition-transform"
                        style={{ color: activeTrack.color }}
                        title="Pronuncia frase completa"
                      >
                        <Volume2 size={15} />
                      </button>
                      
                      <div className="pr-8 pl-2 flex flex-col gap-1 transition-all duration-500">
                        {showItalianSub && (
                          <motion.p 
                            key={`it-${getActiveTranscriptLine()?.textIt}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[13.5px] font-bold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                          >
                            {getActiveTranscriptLine()?.textIt || "Sintonizzazione..."}
                          </motion.p>
                        )}
                        {showEnglishSub && (
                          <motion.p 
                            key={`en-${getActiveTranscriptLine()?.textEn}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[11px] italic mt-0.5 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                            style={{ color: `${activeTrack.color}99` }}
                          >
                            {getActiveTranscriptLine()?.textEn}
                          </motion.p>
                        )}
                        {!showItalianSub && !showEnglishSub && (
                          <p className="text-[11px] text-white/20 italic">Sottotitoli nascosti</p>
                        )}
                      </div>
                    </div>
                  </div>

                {/* Lower Segment Tabs (Trascrzione | Vocabolario | Sfida) */}
                <div className="flex-1 flex flex-col min-h-0 mt-3 bg-[#020617]/40 border-t border-white/5 rounded-t-[36px] overflow-hidden">
                  
                  {/* Tab list selectors */}
                  <div className="flex items-center justify-around border-b border-white/5 py-3 shrink-0">
                    <button
                      onClick={() => setActivePanel('transcript')}
                      className={`text-xs font-mono font-black uppercase tracking-widest pb-1 transition-all ${
                        activePanel === 'transcript' ? 'border-b-2 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={{ borderBottomColor: activePanel === 'transcript' ? activeTrack.color : 'transparent' }}
                    >
                      Trascrizione
                    </button>
                    <button
                      onClick={() => setActivePanel('vocabulary')}
                      className={`text-xs font-mono font-black uppercase tracking-widest pb-1 transition-all ${
                        activePanel === 'vocabulary' ? 'border-b-2 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={{ borderBottomColor: activePanel === 'vocabulary' ? activeTrack.color : 'transparent' }}
                    >
                      Vocabolario
                    </button>
                    <button
                      onClick={() => setActivePanel('challenge')}
                      className={`text-xs font-mono font-black uppercase tracking-widest pb-1 transition-all ${
                        activePanel === 'challenge' ? 'border-b-2 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={{ borderBottomColor: activePanel === 'challenge' ? activeTrack.color : 'transparent' }}
                    >
                      Sfida
                    </button>
                  </div>

                  {/* Scrollable tab panes */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                    <AnimatePresence mode="wait">
                      
                      {/* PANORAMA A: LIVE TRANSCRIPT */}
                      {activePanel === 'transcript' && (
                        <motion.div
                          key="pane-transcript"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3.5"
                        >
                          {activeTrack?.transcript?.map((line, idx) => {
                            const isCurrent = progress >= line.timeStart && progress <= line.timeEnd;
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  // Seek to the starting percentage of this line on click
                                  if (audioRef.current) {
                                    audioRef.current.currentTime = (line.timeStart / 100) * audioRef.current.duration;
                                    setProgress(line.timeStart);
                                    setIsPlaying(true);
                                  }
                                }}
                                className={`p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                  isCurrent
                                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_4px_25px_rgba(16,185,129,0.15)] scale-[1.01]'
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`text-[15px] font-bold leading-relaxed block ${
                                    isCurrent ? 'text-white font-black' : (isDarkMode ? 'text-stone-300' : 'text-slate-700')
                                  }`}>
                                    {line.textIt}
                                  </span>
                                  <button
                                    onClick={(e) => handleTTS(line.textIt, e)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg shrink-0"
                                    title="Listen line"
                                  >
                                    <Volume2 size={14} className={isCurrent ? 'text-emerald-400' : 'text-stone-400'} />
                                  </button>
                                </div>
                                <span className="text-xs block text-stone-500 mt-1">
                                  {line.textEn}
                                </span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* PANORAMA B: KEY VOCABULARIES */}
                      {activePanel === 'vocabulary' && (
                        <motion.div
                          key="pane-vocabulary"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          {activeTrack?.keywords?.map((kw, idx) => (
                            <div 
                              key={idx}
                              onClick={() => handleTTS(kw.word)}
                              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left transition-all"
                            >
                              <div>
                                <span className="font-bold text-base text-emerald-400 font-mono block">
                                  {kw.word}
                                </span>
                                <span className="text-xs text-stone-500 block">
                                  Pronuncia: {kw.pronunciation}
                                </span>
                                <p className="text-xs text-stone-300 mt-1">
                                  Traduzione: {kw.translation}
                                </p>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-400">
                                <Volume2 size={16} />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* PANORAMA C: COMPREHENSION CHALLENGE */}
                      {activePanel === 'challenge' && (
                        <motion.div
                          key="pane-challenge"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4 text-left"
                        >
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3">
                            <HelpCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
                                Traguardo di Comprensione Orale
                              </h4>
                              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                                Metti alla prova la tua comprensione. Completa questo breve test per contrassegnare questa lezione audio come sincronizzata.
                              </p>
                            </div>
                          </div>

                          {/* The Challenge Question */}
                          <div className="p-1">
                            <h3 className="font-bold text-sm text-stone-200 leading-snug">
                              {activeTrack?.quiz?.question}
                            </h3>
                          </div>

                          {/* Options Trail */}
                          <div className="space-y-2.5">
                            {activeTrack?.quiz?.options?.map((opt, oIdx) => {
                              const isSelected = quizAnswer === opt;
                              const isRight = opt === activeTrack?.quiz?.answer;
                              
                              let optionStyle = "border-white/5 hover:border-white/10 bg-white/[0.01]";
                              if (submittedQuiz) {
                                if (isRight) {
                                  optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                                } else if (isSelected && !isRight) {
                                  optionStyle = "bg-rose-500/10 border-rose-500 text-rose-400";
                                } else {
                                  optionStyle = "opacity-40 border-white/5 bg-white/[0.01]";
                                }
                              } else if (isSelected) {
                                optionStyle = "border-emerald-400 bg-emerald-500/5";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={submittedQuiz}
                                  onClick={() => submitAnswer(opt)}
                                  className={`w-full p-4 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${optionStyle}`}
                                >
                                  <span>{opt}</span>
                                  {submittedQuiz && isRight && <Check className="text-emerald-400 shrink-0" size={16} />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation summary if submitted */}
                          {submittedQuiz && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className={`p-4 rounded-xl border ${
                                isAnswerCorrect 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-stone-200' 
                                  : 'bg-stone-500/5 border-white/5 text-stone-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Award size={16} className={isAnswerCorrect ? 'text-emerald-400' : 'text-stone-400'} />
                                <span className="font-mono font-black text-[10px] uppercase tracking-wider">
                                  {isAnswerCorrect ? "Fluidità Stabilizzata!" : "Spiegazione"}
                                </span>
                              </div>
                              <p className="text-xs mt-1.5 leading-relaxed font-semibold">
                                {activeTrack?.quiz?.explanation}
                              </p>

                              {!isAnswerCorrect && (
                                <button
                                  onClick={() => {
                                    setQuizAnswer(null);
                                    setIsAnswerCorrect(null);
                                    setSubmittedQuiz(false);
                                  }}
                                  className="mt-3 text-[10px] font-mono font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <RotateCcw size={10} /> Riprova
                                </button>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
