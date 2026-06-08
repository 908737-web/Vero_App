import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, ArrowLeft, Search, MessageCircle, Star, Tv, Youtube, Film, Compass } from 'lucide-react';

import { ThemeColors } from '../types';

interface CinemaViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  currentTheme?: ThemeColors;
}

interface VideoNode {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  icon: React.ElementType;
}

const mockCategories: VideoNode[] = [
  {
    id: '1',
    title: 'Italian Vlogs & Daily Life',
    category: 'YouTube Channels',
    duration: '150+ Videos',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80',
    icon: Youtube,
  },
  {
    id: '2',
    title: 'Classic Italian Cinema',
    category: 'Film Masterpieces',
    duration: '40+ Movies',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    icon: Film,
  },
  {
    id: '3',
    title: 'Documentaries & History',
    category: 'Deep Dives',
    duration: '85+ Features',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
    icon: Compass,
  },
  {
    id: '4',
    title: 'News & Current Events',
    category: 'Live Broadcasts',
    duration: 'Live',
    thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80',
    icon: Tv,
  },
  {
    id: '5',
    title: 'Grammar & Lessons (YT)',
    category: 'Learning Paths',
    duration: '200+ Videos',
    thumbnail: 'https://images.unsplash.com/photo-1588694851213-911e38dd4955?auto=format&fit=crop&q=80',
    icon: Youtube,
  },
];

export const CinemaView: React.FC<CinemaViewProps> = ({ onBack, isDarkMode, currentTheme }) => {
  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${isDarkMode ? 'bg-black/60 backdrop-blur-3xl text-white' : 'bg-white/60 backdrop-blur-3xl text-slate-800'}`}>
      <div className="absolute inset-0 w-full max-w-[26.875rem] mx-auto relative h-full flex flex-col">
        {/* Floating Top Elements */}
        <div className="absolute top-0 left-0 right-0 w-full pt-8 px-3 pointer-events-none z-[150] flex items-start justify-between">
          <div className="text-left pointer-events-auto">
            <h1 className="text-xl font-bold font-serif tracking-tight">Mosaico Editoriale</h1>
            <p className={`text-xs font-medium uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
              Cinema & Media Discovery
            </p>
          </div>
        </div>

        {/* 3D Carousel Content */}
        <div className="flex-1 px-3 pt-24 pb-32 relative z-10 w-full h-full flex justify-center items-center">
            
            <div className="scene w-full h-[400px]">
                <div className="a3d" style={{ '--n': mockCategories.length } as React.CSSProperties}>
                    {mockCategories.map((cat, idx) => (
                        <div 
                           key={cat.id} 
                           className="scene-card relative overflow-hidden group cursor-pointer border border-white/10" 
                           style={{ '--i': idx } as React.CSSProperties}
                        >
                            {/* Background Image */}
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{ backgroundImage: `url(${cat.thumbnail})` }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                            {/* Content */}
                            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                                    <cat.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#f472b6] mb-2 block drop-shadow-sm">
                                    {cat.category}
                                  </span>
                                  <h3 className="font-serif text-xl font-bold leading-tight drop-shadow-md mb-2">
                                    {cat.title}
                                  </h3>
                                  <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-[-18px]">
                                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                                    <span>{cat.duration}</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
