import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Zap, Target, Dog, Fish, Eye, TreePine, Sparkles, Anchor, Heart, Waves } from 'lucide-react';
import { ThemeColors } from '../types';

export type StudyState =
  | 'CONSISTENCY'
  | 'HIGH_ENERGY'
  | 'DEEP_FOCUS'
  | 'RAPID'
  | 'LEVEL_UP'
  | 'DROPPING'
  | 'HIGH_ERROR'
  | 'INACTIVE'
  | 'COMPLETED'
  | 'IDLE';

interface BioPortalProps {
  studyState?: StudyState;
  currentTheme: ThemeColors;
}

// Mapping of the 10 specific subconscious study states
export const BIO_PORTAL_STATES: Record<string, any> = {
  CONSISTENCY: {
    halo: 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-500',
    anim: { rotate: 360, scale: [1, 1.1, 1] },
    trans: { rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } },
    icon: <Zap className="w-5 h-5 text-amber-300 drop-shadow-[0_0_0.5rem_rgba(252,211,77,0.8)]" />,
    emerge: { x: [0, 50, 70], y: [0, -10, 20], opacity: [0, 1, 0], rotate: [0, 45, 90], scale: [0.5, 1.2, 0.8] },
    transEmerge: { duration: 2.5, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.5 }
  },
  HIGH_ENERGY: {
    halo: 'bg-gradient-to-br from-red-500 to-rose-400',
    anim: { scale: [1, 1.2, 1, 1.1, 1] },
    trans: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    icon: <Heart className="w-5 h-5 text-rose-200 drop-shadow-[0_0_0.5rem_rgba(254,205,211,0.8)]" />,
    emerge: { x: [0, 40, 60], y: [0, -30, -50], opacity: [0, 1, 0], scale: [0.5, 1, 1.2] },
    transEmerge: { duration: 2, repeat: Infinity, ease: 'easeOut', repeatDelay: 2 }
  },
  DEEP_FOCUS: {
    halo: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    anim: { rotate: [0, 15, -15, 0], scale: [1, 1.05, 1] },
    trans: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    icon: <Waves className="w-6 h-6 text-cyan-200 drop-shadow-[0_0_0.5rem_rgba(165,243,252,0.8)]" />,
    emerge: { x: [0, 60, 90], y: [0, 5, 10], opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1] },
    transEmerge: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }
  },
  RAPID: {
    halo: 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500',
    anim: { rotate: -360, scale: [1, 1.1, 1] },
    trans: { rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.75, repeat: Infinity } },
    icon: <Target className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_0.5rem_rgba(103,232,249,0.8)]" />,
    emerge: { x: [0, 100], y: [0, -20], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] },
    transEmerge: { duration: 1.5, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.5 }
  },
  LEVEL_UP: {
    halo: 'bg-gradient-to-t from-amber-400 to-yellow-200',
    anim: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] },
    trans: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    icon: <Anchor className="w-5 h-5 text-yellow-300 mx-auto drop-shadow-[0_0_0.5rem_rgba(253,224,71,0.8)]" />,
    emerge: { x: [0, 40, 50], y: [0, -50, -80], opacity: [0, 1, 0], rotate: [0, 15, -15] },
    transEmerge: { duration: 3, repeat: Infinity, ease: 'easeOut', repeatDelay: 2 }
  },
  DROPPING: {
    halo: 'bg-gradient-to-b from-stone-600 to-stone-400',
    anim: { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] },
    trans: { duration: 0.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 },
    icon: <Dog className="w-5 h-5 text-stone-300 drop-shadow-[0_0_0.5rem_rgba(214,211,209,0.8)]" />,
    emerge: { x: [0, 30, 40], y: [0, 10, 20], opacity: [0, 1, 0], scale: [0.5, 1.1, 1] },
    transEmerge: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }
  },
  HIGH_ERROR: {
    halo: 'bg-gradient-to-br from-red-600 via-rose-500 to-orange-500',
    anim: { opacity: [1, 0.3, 1, 0.1, 1], scale: [1, 0.95, 1.05, 1] },
    trans: { duration: 1.5, repeat: Infinity, ease: 'linear' },
    icon: <Fish className="w-5 h-5 text-rose-300 drop-shadow-[0_0_0.5rem_rgba(253,164,175,0.8)]" />,
    emerge: { x: [0, -40, -80], y: [0, 20, 40], opacity: [0, 1, 0], rotate: [0, -45, -90] },
    transEmerge: { duration: 2, repeat: Infinity, ease: 'easeIn', repeatDelay: 1 }
  },
  INACTIVE: {
    halo: 'bg-stone-800',
    anim: { scale: 1, opacity: 0.3 },
    trans: { duration: 1 },
    icon: <Eye className="w-5 h-5 text-stone-400" />,
    emerge: { x: [0, 30, 0, -30, 0], y: [0, 0, -20, 0, 0], opacity: [0, 0.3, 0.6, 0.3, 0] },
    transEmerge: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
  },
  COMPLETED: {
    halo: 'bg-gradient-to-tr from-emerald-400 to-cyan-400',
    anim: { rotate: 180, scale: [1, 1.1, 1] },
    trans: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    icon: <TreePine className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_0.5rem_rgba(110,231,183,0.8)]" />,
    emerge: { x: [0, 0], y: [0, -40, -60], opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] },
    transEmerge: { duration: 3, repeat: Infinity, ease: 'easeOut', repeatDelay: 2 }
  },
};

export const BioPortal: React.FC<BioPortalProps> = ({
  studyState = 'IDLE',
  currentTheme,
}) => {
  // Determine animation style based on haloEffect
  const isPulse = currentTheme.haloEffect === 'pulse';
  const isMercury = currentTheme.haloEffect === 'mercury';
  const isSparks = currentTheme.haloEffect === 'sparks';
  const isNone = currentTheme.haloEffect === 'none';

  const idleAnim = isPulse ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } 
                 : isMercury ? { rotate: 360, borderRadius: ['50%', '40%', '50%'] } 
                 : isNone ? { rotate: 0, scale: 1 }
                 : { rotate: [0, 360], scale: [1, 1.05, 1] }; // sparks

  const idleTrans: any = isPulse ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } 
                  : isMercury ? { duration: 4, repeat: Infinity, ease: 'linear' } 
                  : isNone ? { duration: 0 }
                  : { rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } };

  // Mapping of the 10 specific subconscious study states
  const config = studyState === 'IDLE' ? {
      halo: 'var(--theme-accent)',
      anim: idleAnim,
      trans: idleTrans,
      icon: <Sparkles className="w-4 h-4 text-white/60 drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.5)]" />,
      emerge: { x: [0, 30, 40], y: [0, -30, -50], opacity: [0, 1, 0], rotate: [0, 90, 180], scale: [0.5, 1.2, 0.5] },
      transEmerge: { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }
  } : BIO_PORTAL_STATES[studyState];

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {/* Bioluminescent Halo (Subconscious Feedback) */}
      <motion.div
        className={`absolute inset-[-0.375rem] rounded-full opacity-70 blur-[0.5rem] z-0 ${studyState !== 'IDLE' ? config.halo : ''}`}
        animate={config.anim}
        transition={config.trans}
        style={studyState === 'IDLE' ? { background: config.halo } : {}}
      />

      {/* Emergence System (Doorway Interaction) */}
      {/* Renders behind the core button due to z-[5] vs button's z-10 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
         <motion.div
           initial={{ x: 0, y: 0, scale: 0.5, opacity: 0 }}
           animate={config.emerge}
           transition={config.transEmerge}
           className="drop-shadow-xl saturate-150"
         >
           {config.icon}
         </motion.div>
      </div>

      {/* Core Interactive Portal Button (iOS 26 Glassmorphism) */}
      <button
        className={`w-full h-full rounded-full flex items-center justify-center relative z-10 
          border border-white/10 active:scale-95 transition-all shadow-[0_0.5rem_2rem_rgba(0,0,0,0.3)]
          backdrop-blur-xl bg-white/[0.05] overflow-hidden group`}
      >
        {/* Inner dynamic fill based on theme to maintain connection to IDLE/Customization */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay"
          style={{ background: 'var(--theme-accent)' }} 
        />
        
        {/* High-end Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-40 pointer-events-none rounded-full" />
        
        <div className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-[0_0_0.75rem_rgba(255,255,255,1)] z-20 group-hover:scale-110 transition-transform" />
      </button>

      {/* Subtle pulsing inner glow to simulate depth */}
      <div className="absolute inset-[0.5rem] rounded-full border border-white/30 pointer-events-none z-20 mix-blend-overlay opacity-50" />
    </div>
  );
};
