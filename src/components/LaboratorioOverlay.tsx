import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutTemplate, Mic, Link2, X } from 'lucide-react';

interface LaboratorioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function LaboratorioOverlay({ isOpen, onClose, isDarkMode }: LaboratorioOverlayProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const bgGlassPrimary = isDarkMode ? 'bg-white/10 border-white/20' : 'bg-slate-900/10 border-slate-900/20';
  const bgGlassSecondary = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/20';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 as const }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
    exit: { y: 20, opacity: 0, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40"
          style={{ backdropFilter: 'blur(100px) saturate(150%)', WebkitBackdropFilter: 'blur(100px) saturate(150%)' }}
          onClick={onClose}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className={`absolute top-8 right-8 p-3 rounded-full ${bgGlassSecondary} backdrop-blur-md active:scale-90 transition-transform`}
          >
            <X className={`w-6 h-6 ${textColor}`} />
          </button>

          <motion.div 
            onClick={(e) => e.stopPropagation()}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 gap-4 w-full max-w-sm"
          >
            {/* Create New Realm Pill */}
            <motion.button 
              variants={itemVariants}
              className={`col-span-2 p-5 rounded-[2rem] ${bgGlassPrimary} backdrop-blur-xl flex items-center justify-between shadow-2xl active:scale-[0.98] transition-transform`}
            >
              <span className={`text-lg font-bold tracking-tight ${textColor}`}>Create New Realm</span> 
              <div className={`p-2 rounded-full ${bgGlassSecondary}`}>
                <Plus className={`w-5 h-5 ${textColor}`} />
              </div>
            </motion.button>
            
            {/* Text & Flashcard Large Tile */}
            <motion.button 
              variants={itemVariants}
              className={`col-span-2 h-36 rounded-[2.5rem] ${bgGlassPrimary} backdrop-blur-xl flex flex-col items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-transform`}
            >
              <div className={`p-4 rounded-3xl ${bgGlassSecondary}`}>
                <LayoutTemplate className={`w-8 h-8 ${textColor}`} />
              </div>
              <span className={`font-bold tracking-tight ${textColor}`}>Text & Flashcard</span>
            </motion.button>
            
            {/* Audio Tile */}
            <motion.button 
              variants={itemVariants}
              className={`h-28 rounded-[2rem] ${bgGlassSecondary} backdrop-blur-xl flex flex-col items-center justify-center gap-2 shadow-xl active:scale-[0.96] transition-transform`}
            >
              <Mic className={`w-6 h-6 ${textColor}`} />
              <span className={`font-semibold tracking-tight text-sm ${textColor}`}>Audio Studio</span>
            </motion.button>

            {/* Media Tile */}
            <motion.button 
              variants={itemVariants}
              className={`h-28 rounded-[2rem] ${bgGlassSecondary} backdrop-blur-xl flex flex-col items-center justify-center gap-2 shadow-xl active:scale-[0.96] transition-transform`}
            >
              <Link2 className={`w-6 h-6 ${textColor}`} />
              <span className={`font-semibold tracking-tight text-sm ${textColor}`}>Media Extract</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
