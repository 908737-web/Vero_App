import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SettingsScreen } from './SettingsScreen';
import { DailyGoal, ThemeColors } from '../types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  uiScale: 'small' | 'medium' | 'large';
  setUiScale: (v: 'small' | 'medium' | 'large') => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  dailyGoal: DailyGoal;
  setDailyGoal: (goal: DailyGoal) => void;
}

export const SettingsDrawer = ({ 
  isOpen, 
  onClose,
  isDarkMode,
  uiScale,
  setUiScale,
  themeMode,
  setThemeMode,
  dailyGoal,
  setDailyGoal
}: SettingsDrawerProps) => {

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md h-[85vh] rounded-[3rem] border border-white/20 overflow-hidden flex flex-col"
            style={{
              background: isDarkMode ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex-1 overflow-hidden px-3 pt-6 relative border-t-0 border-r-0 border-l-0">
               <div className="flex flex-col h-full w-full relative z-20">
                 <div className="flex items-center mb-6 pt-2 shrink-0">
                   <h2 className={`text-2xl font-bold ${textColor}`}>Settings & Preferences</h2>
                 </div>
                 <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
                   <SettingsScreen 
                     uiScale={uiScale} 
                     setUiScale={setUiScale} 
                     themeMode={themeMode}
                     setThemeMode={setThemeMode}
                     dailyGoal={dailyGoal}
                     setDailyGoal={setDailyGoal}
                   />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
