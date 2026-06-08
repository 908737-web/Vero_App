import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Compass, User, BookA, Plus, Users } from 'lucide-react';
import { StudyState, BIO_PORTAL_STATES } from './BioPortal';
import { ThemeColors } from '../types';

interface BottomNavProps {
  view: 'dashboard' | 'study' | 'salotto' | 'discover' | 'dictionary';
  setView: (view: 'dashboard' | 'study' | 'salotto' | 'discover' | 'dictionary') => void;
  portalState: StudyState;
  currentTheme?: ThemeColors;
  discoveryThemeColor?: string;
  isDarkMode?: boolean;
  onOpenLab?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  view, 
  setView, 
  portalState,
  currentTheme,
  discoveryThemeColor,
  isDarkMode = true,
  onOpenLab
}) => {
  const leftTabs = [
    { id: 'dashboard', icon: BookOpen, label: 'Revise' },
    { id: 'discover', icon: Compass, label: 'Discover' },
  ] as const;

  const rightTabs = [
    { id: 'dictionary', icon: BookA, label: 'Dictionary' },
    { id: 'salotto', icon: Users, label: 'Il Salotto' },
  ] as const;

  // Get color for status dot based on portal state
  const getPortalColor = () => {
    if (portalState === 'IDLE') return 'bg-white';
    const config = BIO_PORTAL_STATES[portalState];
    if (!config || !config.halo) return 'bg-white';
    
    // Extract first color from gradient class "from-xyz-500"
    const matches = config.halo.match(/from-([a-z-]+-[0-9]+)/);
    return matches ? `bg-${matches[1]}` : 'bg-white';
  };

  const stateColor = getPortalColor();

  const renderTab = (tab: any) => {
    const isActive = view === tab.id;
    const Icon = tab.icon;

    return (
      <button
        key={tab.id}
        onClick={() => setView(tab.id as any)}
        className="relative flex-1 h-full flex items-center justify-center transition-all duration-300 z-10"
        aria-label={tab.label}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative flex items-center justify-center transition-colors duration-300 ${isActive ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600')}`}
          style={{ color: isActive && discoveryThemeColor ? discoveryThemeColor : undefined }}
        >
          <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
          
          {/* Status Dot / Pulse */}
          {isActive && (
            <div className="absolute -top-[0.25rem] -right-[0.25rem] flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute w-3 h-3 rounded-full blur-[0.25rem] ${discoveryThemeColor ? '' : 'bg-blue-400'}`}
                style={{ backgroundColor: discoveryThemeColor ? `${discoveryThemeColor}80` : undefined }}
              />
              <div 
                className={`w-1.5 h-1.5 rounded-full shadow-[0_0_0.625rem_rgba(255,255,255,0.5)] border border-white/20 ${discoveryThemeColor ? '' : 'bg-blue-500'}`} 
                style={{ backgroundColor: discoveryThemeColor }}
              />
            </div>
          )}
        </motion.div>
      </button>
    );
  };

  return (
    <nav 
      className="relative flex items-center justify-between p-[0.35rem] h-[48px] w-[260px] rounded-full border transition-all mx-auto pointer-events-auto"
      style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
        boxShadow: isDarkMode 
          ? (discoveryThemeColor 
            ? `0 20px 40px ${discoveryThemeColor}20, inset 0 1px 1px rgba(255,255,255,0.15)` 
            : '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)')
          : '0 10px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.6)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        borderColor: isDarkMode 
          ? (discoveryThemeColor ? `${discoveryThemeColor}40` : 'rgba(255,255,255,0.1)')
          : 'rgba(255,255,255,0.8)'
      }}
    >
      <div className="flex-1 flex justify-around h-full">
        {leftTabs.map(renderTab)}
      </div>

      {/* Central Genesis Button */}
      <button
        onClick={onOpenLab}
        className="relative flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full z-10 mx-1 active:scale-95 transition-transform"
        style={{
          background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${discoveryThemeColor ? `${discoveryThemeColor}60` : (isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)')}`,
          boxShadow: discoveryThemeColor 
            ? `0 0 15px ${discoveryThemeColor}40` 
            : (isDarkMode ? '0 0 15px rgba(255,255,255,0.2)' : '0 0 10px rgba(0,0,0,0.1)'),
          backdropFilter: 'blur(10px)'
        }}
      >
        <Plus className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ color: discoveryThemeColor }} />
      </button>

      <div className="flex-1 flex justify-around h-full">
        {rightTabs.map(renderTab)}
      </div>
    </nav>
  );
};
