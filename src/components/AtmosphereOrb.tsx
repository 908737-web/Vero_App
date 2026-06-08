import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeColors } from '../types';

interface AtmosphereOrbProps {
  currentTheme: ThemeColors;
  onClick: () => void;
}

export const AtmosphereOrb: React.FC<AtmosphereOrbProps> = ({ currentTheme, onClick }) => {

  return (
    <button 
      onClick={onClick}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_1.25rem_rgba(255,255,255,0.1)] group overflow-hidden"
      style={{ background: currentTheme.gradient }}
    >
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none shadow-[inset_0_0_0.625rem_rgba(255,255,255,0.4)] mix-blend-overlay" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[0.125rem] rounded-full border-t border-white/40 border-r border-transparent border-b border-transparent border-l border-transparent pointer-events-none opacity-50"
      />
      {/* Core highlight */}
      <div className="absolute -top-[0.25rem] -right-[0.25rem] w-4 h-4 bg-white/40 blur-[0.125rem] rounded-full" />
    </button>
  );
};
