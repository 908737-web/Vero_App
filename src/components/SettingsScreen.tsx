
import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Cloud, 
  Database, 
  Eye, 
  Fingerprint, 
  Info, 
  Languages, 
  Layout, 
  Moon, 
  ShieldCheck, 
  Smartphone, 
  Trash2, 
  Volume2, 
  Zap,
  RefreshCcw,
  Type,
  Plus
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SettingsItemProps {
  icon: React.ReactNode;
  title?: string;
  description?: string;
  type: 'toggle' | 'select' | 'button' | 'custom';
  value?: any;
  onChange?: (val: any) => void;
  options?: { label: string, value: any }[];
  accentColor?: string;
  children?: React.ReactNode;
}

const SettingsItem = ({ icon, title, description, type, value, onChange, options, accentColor = 'bg-blue-400', children }: SettingsItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${accentColor}/10 flex items-center justify-center border border-white/5 shadow-inner transition-colors group-hover:bg-white/10 group-active:scale-95`}>
            {icon}
        </div>
        {(title || description) && (
          <div className="flex flex-col">
            {title && <span className="text-sm font-bold text-white tracking-tight">{title}</span>}
            {description && <span className="text-[0.625rem] text-white/30 font-medium uppercase tracking-wider">{description}</span>}
          </div>
        )}
      </div>

      {type === 'toggle' && (
        <button 
          onClick={() => onChange?.(!value)}
          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? accentColor : 'bg-white/10'}`}
        >
          <motion.div 
            animate={{ x: value ? 26 : 4 }}
            className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-md"
          />
        </button>
      )}

      {type === 'select' && (
        <div className="flex bg-white/5 rounded-full p-0.5 border border-white/5 overflow-hidden">
          {options?.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange?.(opt.value)}
              className={`px-3 py-1 rounded-full text-[0.625rem] font-bold transition-all ${
                value === opt.value ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {type === 'custom' && children}

      {type === 'button' && (
        <ChevronRight className="w-4 h-4 text-white/20" />
      )}
    </div>
  );
};

import { DailyGoal } from '../types';

export const SettingsScreen = ({ 
  uiScale, 
  setUiScale, 
  themeMode, 
  setThemeMode,
  dailyGoal,
  setDailyGoal
}: { 
  uiScale: 'small' | 'medium' | 'large', 
  setUiScale: (v: 'small' | 'medium' | 'large') => void,
  themeMode: 'light' | 'dark',
  setThemeMode: (mode: 'light' | 'dark') => void,
  dailyGoal: DailyGoal,
  setDailyGoal: (goal: DailyGoal) => void
}) => {
  const handleCustomLimit = () => {
    const val = prompt('Enter daily card goal:', dailyGoal.cardTarget.toString());
    if (val && !isNaN(parseInt(val))) {
      setDailyGoal({ ...dailyGoal, cardTarget: parseInt(val) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6 pb-32"
    >
      {/* 1. SRS Learning */}
      <section className="space-y-3">
        <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.3em] text-white/30 px-2">SRS</h3>
        <GlassCard className="px-3 py-4 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                   <h3 className="text-sm font-bold text-white">Daily Goal</h3>
                   <p className="text-[0.625rem] text-white/50 uppercase tracking-wider">{dailyGoal.cardsReviewedToday} / {dailyGoal.cardTarget} cards reviewed</p>
                </div>
             </div>
             <button 
                onClick={handleCustomLimit}
                className="px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-white/60 hover:text-white transition-colors text-xs font-medium"
              >
                Set Goal
              </button>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (dailyGoal.cardsReviewedToday / dailyGoal.cardTarget) * 100)}%` }}
             />
          </div>
          <div className="pt-2 border-t border-white/5">
             <SettingsItem 
                icon={<Volume2 className="w-5 h-5 text-blue-400" />}
                title="Audio"
                type="toggle"
                value={true}
              />
          </div>
        </GlassCard>
      </section>

      {/* 2. Appearance */}
      <section className="space-y-3">
        <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.3em] text-white/30 px-2">Appearance</h3>
        <GlassCard className="px-3 py-1 divide-y divide-white/5">
          <SettingsItem 
            icon={<Layout className="w-5 h-5 text-purple-400" />}
            title="Scale"
            type="select"
            value={uiScale}
            onChange={(val) => setUiScale(val)}
            options={[
              { label: 'S', value: 'small' },
              { label: 'M', value: 'medium' },
              { label: 'L', value: 'large' }
            ]}
          />
          <SettingsItem 
            icon={<Type className="w-5 h-5 text-amber-400" />}
            title="Font"
            type="select"
            value="default"
            options={[
              { label: 'Sans', value: 'default' },
              { label: 'Mono', value: 'mono' },
              { label: 'Serif', value: 'serif' }
            ]}
          />
          <SettingsItem 
            icon={<Moon className="w-5 h-5 text-cyan-400" />}
            title="Mode"
            type="select"
            value={themeMode}
            onChange={(val) => setThemeMode(val)}
            options={[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' }
            ]}
          />
          <SettingsItem 
            icon={<Fingerprint className="w-5 h-5 text-emerald-400" />}
            title="Haptic"
            type="toggle"
            value={true}
            accentColor="bg-emerald-500"
          />
        </GlassCard>
      </section>

      {/* 3. Notifications */}
      <section className="space-y-3">
        <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.3em] text-white/30 px-2">Alerts</h3>
        <GlassCard className="px-3 py-1 divide-y divide-white/5">
          <SettingsItem 
            icon={<Bell className="w-5 h-5 text-rose-400" />}
            title="Reminders"
            type="toggle"
            value={true}
            accentColor="bg-rose-500"
          />
          <SettingsItem 
            icon={<Smartphone className="w-5 h-5 text-blue-400" />}
            title="Ranking"
            type="toggle"
            value={true}
          />
        </GlassCard>
      </section>

      {/* 4. Data */}
      <section className="space-y-3">
        <h3 className="text-[0.625rem] font-bold uppercase tracking-[0.3em] text-white/30 px-2">Data</h3>
        <GlassCard className="px-3 py-1 divide-y divide-white/5">
          <SettingsItem 
            icon={<RefreshCcw className="w-5 h-5 text-indigo-400" />}
            title="Sync"
            type="button"
          />
          <SettingsItem 
            icon={<Trash2 className="w-5 h-5 text-red-400" />}
            title="Clear"
            type="button"
          />
        </GlassCard>
      </section>

      <div className="pt-4 text-center">
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.5em] text-white/10">Vero Engine v1.0.4</p>
      </div>
    </motion.div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
)
