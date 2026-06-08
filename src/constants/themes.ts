import { ThemeColors } from '../types';

export const THEMES: ThemeColors[] = [
  {
    name: 'Rose Quartz Glass',
    gradient: 'radial-gradient(circle at top right, rgba(251,207,232,0.15) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(216,180,254,0.15) 0%, transparent 50%), linear-gradient(135deg, #18111a 0%, #0d0710 100%)',
    accent: '#f472b6',
    glow: 'rgba(244,114,182,0.2)',
    ambientSoundUrl: '/sounds/rose.mp3',
    haloEffect: 'pulse',
    mode: 'dark',
    cardGlassClass: '!border-rose-300/30 shadow-[inset_0_0_15px_rgba(251,146,60,0.1)] !bg-pink-100/[0.02]',
    navGlassClass: '!border-rose-300/30 shadow-[inset_0_1px_2px_rgba(251,146,60,0.2),0_10px_40px_rgba(244,114,182,0.1)] bg-pink-100/[0.02]'
  },
  {
    name: 'Midnight Obsidian',
    gradient: 'radial-gradient(circle at top left, rgba(14,165,233,0.15) 0%, transparent 30%), radial-gradient(circle at bottom right, rgba(34,197,94,0.15) 0%, transparent 30%), linear-gradient(135deg, #09090b 0%, #000000 100%)',
    accent: '#38bdf8',
    glow: 'rgba(14,165,233,0.1)',
    ambientSoundUrl: '/sounds/midnight.mp3',
    haloEffect: 'sparks',
    mode: 'dark',
    cardGlassClass: '!border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.2),inset_0_0_15px_rgba(56,189,248,0.05)] !bg-black/50',
    navGlassClass: '!border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.2),inset_0_1px_2px_rgba(56,189,248,0.2)] !bg-black/50'
  },
  {
    name: 'Crystalline Light',
    gradient: 'radial-gradient(circle at top left, rgba(59,130,246,0.08) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(236,72,153,0.08) 0%, transparent 40%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.1)',
    ambientSoundUrl: '/sounds/light.mp3',
    haloEffect: 'pulse',
    mode: 'light',
    cardGlassClass: '!border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)] !bg-white/40',
    navGlassClass: '!border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] !bg-white/60',
    textClass: 'theme-light'
  },
  {
    name: 'Amalfi Breeze',
    gradient: 'radial-gradient(circle at top right, rgba(45,212,191,0.3) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(16,185,129,0.2) 0%, transparent 50%), linear-gradient(135deg, #083344 0%, #022c22 100%)',
    accent: '#2dd4bf',
    glow: 'rgba(20,184,166,0.15)',
    ambientSoundUrl: '/sounds/amalfi.mp3',
    haloEffect: 'pulse',
    mode: 'dark',
    cardGlassClass: '!border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] !bg-cyan-900/10 backdrop-blur-3xl',
    navGlassClass: 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_10px_40px_rgba(20,184,166,0.2)] backdrop-blur-3xl !bg-teal-400/[0.05]'
  },
  {
    name: 'Renaissance Marble',
    gradient: 'radial-gradient(circle at top right, #fffbeb 0%, transparent 40%), radial-gradient(circle at bottom left, #f3f4f6 0%, transparent 40%), linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    accent: '#eab308',
    glow: 'rgba(202,138,4,0.1)',
    ambientSoundUrl: '/sounds/marble.mp3',
    haloEffect: 'mercury',
    mode: 'light',
    cardGlassClass: '!border-amber-900/20 shadow-[inset_0_0_30px_rgba(217,119,6,0.05),0_10px_40px_rgba(0,0,0,0.05)] !bg-white/40',
    navGlassClass: '!border-amber-900/20 !bg-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.1)]',
    textClass: 'theme-light'
  },
  {
    name: 'Deep Espresso',
    gradient: 'radial-gradient(circle at top, rgba(234,88,12,0.1) 0%, transparent 50%), linear-gradient(135deg, #1a0a05 0%, #0a0402 100%)',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.1)',
    ambientSoundUrl: '/sounds/tuscan.mp3',
    haloEffect: 'mercury',
    mode: 'dark',
    cardGlassClass: '!border-orange-400/10 shadow-[inset_0_0_20px_rgba(234,88,12,0.05)] !bg-orange-950/20',
    navGlassClass: '!border-orange-400/10 shadow-[inset_0_1px_2px_rgba(254,240,138,0.1),0_10px_40px_rgba(234,88,12,0.1)] !bg-orange-950/20',
  }
];
