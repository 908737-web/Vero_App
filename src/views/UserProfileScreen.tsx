import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Brain, 
  BookOpen, 
  Award,
  Users,
  Download,
  Heart,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useUserProfile } from '../hooks/useUserProfile';
import { DailyGoal } from '../types';

interface UserProfileScreenProps {
  isDarkMode: boolean;
  uiScale: 'small' | 'medium' | 'large';
  setUiScale: (v: 'small' | 'medium' | 'large') => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  dailyGoal: DailyGoal;
  setDailyGoal: (goal: DailyGoal) => void;
  onClose?: () => void;
}

export function UserProfileScreen({ 
  isDarkMode,
  uiScale,
  setUiScale,
  themeMode,
  setThemeMode,
  dailyGoal,
  setDailyGoal,
  onClose
}: UserProfileScreenProps) {
  
  const {
    favorites,
    realms,
    analytics,
    milestones,
    communityStats
  } = useUserProfile();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDarkMode ? 'text-white/60' : 'text-slate-500';
  const bgGlass = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10';

  return (
    <div className="flex flex-col h-full w-full relative z-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2 shrink-0">
        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white/10 shadow-lg shrink-0">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" alt="Luca Romano" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${textColor}`}>Luca Romano</h2>
          <p className={`${mutedTextColor} text-sm flex items-center gap-1.5 mt-0.5`}><Award className="w-3.5 h-3.5" /> Polyglot Scholar</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 space-y-6">
        
        {/* Bento Grid: Analytics & SM-2 Stats */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            {/* Streak Tile */}
            <GlassCard className="p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <span className={`text-[0.625rem] font-bold uppercase tracking-wider ${mutedTextColor}`}>Streak</span>
              </div>
              <div className="relative z-10">
                <span className={`text-3xl font-bold tracking-tighter ${textColor}`}>{analytics.currentStreak}</span>
                <span className={`text-xs ml-1 ${mutedTextColor}`}>days</span>
              </div>
            </GlassCard>

            {/* Retention Tile */}
            <GlassCard className="p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Brain className="w-4 h-4 text-emerald-500" />
                </div>
                <span className={`text-[0.625rem] font-bold uppercase tracking-wider ${mutedTextColor}`}>Retention</span>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <span className={`text-3xl font-bold tracking-tighter ${textColor}`}>{analytics.retentionRate}</span>
                  <span className={`text-xs ml-1 ${mutedTextColor}`}>%</span>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
              </div>
            </GlassCard>

            {/* Total Cards Reviewed - Full Width */}
            <GlassCard className="p-4 col-span-2 flex items-center justify-between relative overflow-hidden">
               <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-blue-500/20 rounded-[1.25rem]">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${textColor}`}>Total Reviews</h3>
                  <p className={`text-xs ${mutedTextColor}`}>SM-2 Spaced Repetition</p>
                </div>
               </div>
               <div className="relative z-10 text-right">
                  <span className={`text-2xl font-bold tracking-tighter ${textColor}`}>{analytics.totalCardsReviewed}</span>
               </div>
            </GlassCard>
          </div>
        </section>

        {/* Milestones (Traguardi) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] ${mutedTextColor}`}>Milestones</h3>
            <span className={`text-xs font-bold ${textColor}`}>{milestones.filter(m => m.unlocked).length}/{milestones.length}</span>
          </div>
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <GlassCard key={milestone.id} className={`p-4 flex items-center gap-4 transition-all ${!milestone.unlocked ? 'opacity-50' : ''}`}>
                <div className={`p-3 rounded-full ${milestone.unlocked ? 'bg-yellow-400/20' : bgGlass}`}>
                  <Award className={`w-5 h-5 ${milestone.unlocked ? 'text-yellow-400' : mutedTextColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${textColor} ${!milestone.unlocked ? 'line-through decoration-white/20' : ''}`}>{milestone.title}</h4>
                  <p className={`text-[0.625rem] ${mutedTextColor} uppercase tracking-wider mt-0.5`}>
                    {milestone.unlocked ? 'Unlocked' : `Requires ${milestone.requirement} Reviews`}
                  </p>
                </div>
                {!milestone.unlocked && (
                   <div className="w-16 h-1.5 bg-black/20 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-yellow-400/30 rounded-full" 
                       style={{ width: `${Math.min(100, (analytics.totalCardsReviewed / milestone.requirement) * 100)}%` }}
                     />
                   </div>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* My Realms */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] ${mutedTextColor}`}>My Realms</h3>
            <button className={`p-1.5 rounded-full ${bgGlass} active:scale-95`}>
               <Plus className={`w-3 h-3 ${textColor}`} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-3">
            {realms.map((realm) => (
              <GlassCard key={realm.id} className="p-4 w-[160px] shrink-0 flex flex-col justify-between min-h-[140px]">
                <div className="flex flex-col gap-1">
                  <BookOpen className={`w-5 h-5 ${textColor} mb-2 opacity-80`} />
                  <h4 className={`text-sm font-bold ${textColor} leading-tight`}>{realm.title}</h4>
                  <p className={`text-[0.625rem] ${mutedTextColor} line-clamp-2 mt-1 leading-snug`}>{realm.description}</p>
                </div>
                <div className={`text-xs font-semibold ${textColor} opacity-60 mt-4 flex items-center gap-1.5`}>
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                   {realm.cardCount} cards
                </div>
              </GlassCard>
            ))}
            {realms.length === 0 && (
               <div className={`w-[160px] shrink-0 h-[140px] rounded-3xl border border-dashed ${isDarkMode ? 'border-white/20' : 'border-slate-900/20'} flex flex-col items-center justify-center opacity-50`}>
                 <Plus className={`w-6 h-6 mb-2 ${textColor}`} />
                 <span className={`text-xs font-medium ${textColor}`}>Create Realm</span>
               </div>
            )}
          </div>
        </section>

        {/* Community Impact */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] ${mutedTextColor}`}>Community Impact</h3>
            <Users className={`w-4 h-4 ${mutedTextColor}`} />
          </div>
          <div className="space-y-3">
             {communityStats.map((stat) => (
                <GlassCard key={stat.realmId} className="p-4">
                  <h4 className={`text-sm font-bold ${textColor} mb-3`}>{stat.title}</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Download className={`w-4 h-4 ${mutedTextColor}`} />
                      <span className={`text-xs font-bold ${textColor}`}>{stat.downloads}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span className={`text-xs font-bold ${textColor}`}>{stat.upvotes}</span>
                    </div>
                  </div>
                </GlassCard>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
