import React, { memo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface DiscoveryTileProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  size: 'large' | 'medium' | 'vertical' | 'small';
  onClick: () => void;
  color: string;
}

export const DiscoveryTile = memo<DiscoveryTileProps>(({
  title,
  subtitle,
  icon: Icon,
  image,
  size,
  onClick,
  color
}) => {
  const [isCleared, setIsCleared] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const sizeClasses = {
    large: 'col-span-2 row-span-2',
    medium: 'col-span-1 row-span-1',
    vertical: 'col-span-1 row-span-2',
    small: 'col-span-1 row-span-1'
  };

  const handleTileClick = () => {
    setIsCleared(true);
    setTimeout(() => {
      setIsCleared(false);
      onClick();
    }, 1000);
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion || isCleared ? {} : { 
        scale: 1.04, 
        rotate: 0.5,
        boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 15px ${color}40`,
      }}
      whileTap={shouldReduceMotion || isCleared ? {} : { scale: 0.98 }}
      onClick={handleTileClick}
      className={`${sizeClasses[size]} relative rounded-[32px] overflow-hidden cursor-pointer group border border-white/10 transition-all duration-500 ${
        isCleared ? 'scale-105 shadow-[0_25px_50px_rgba(0,0,0,0.6)] border-white/30' : ''
      }`}
      style={{
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`
      }}
    >
      {/* Background Image with Lighter crystalline Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isCleared ? 'scale-115 filter-none' : 'group-hover:scale-110'
          }`}
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-slate-950/25 transition-all duration-500 ${
          isCleared ? 'backdrop-blur-none bg-transparent opacity-0' : 'backdrop-blur-[4px] group-hover:backdrop-blur-[1px] group-hover:bg-slate-950/10'
        }`} />
        
        {/* Dynamic Inner Fluid Color Blobs (Visual background animation) */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full mix-blend-screen filter blur-xl transition-opacity duration-500 animate-blob-1 ${
            isCleared ? 'opacity-0' : 'opacity-40 group-hover:opacity-75'
          }`}
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
          }}
        />

        <div
          className={`absolute -bottom-12 -left-12 w-36 h-36 rounded-full mix-blend-screen filter blur-xl transition-opacity duration-500 animate-blob-2 ${
            isCleared ? 'opacity-0' : 'opacity-30 group-hover:opacity-60'
          }`}
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
          }}
        />

        {/* Lighter Modern Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-white/15 transition-all duration-500 ${
          isCleared ? 'opacity-0' : 'group-hover:from-black/70 group-hover:via-black/10'
        }`} />
      </div>

      {/* Glossy Reflection Sweep Effect */}
      <div className={`absolute inset-0 z-10 opacity-0 transition-opacity duration-700 pointer-events-none overflow-hidden ${
        isCleared ? 'hidden' : 'group-hover:opacity-100'
      }`}>
        <div 
          className="w-[150%] h-[150%] absolute animate-sweep"
          style={{
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
            top: '-50%',
            left: '-50%'
          }}
        />
      </div>

      {/* Pulsing Crystalline Atmosphere Glow */}
      {!isCleared && (
        <div
          className="absolute -inset-20 z-0 bg-radial from-white/20 to-transparent blur-3xl pointer-events-none animate-pulse-glow"
          style={{ color }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 w-full h-full p-4 flex flex-col justify-between transition-all duration-500 ${
        isCleared ? 'opacity-0 scale-90 blur-[4px]' : 'opacity-100 scale-100'
      }`}>
        <div className={`p-2.5 rounded-2xl w-fit bg-slate-900/50 border border-white/10`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>

        <div>
          <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1.5 drop-shadow-md">{title}</h3>
          <div className="inline-block px-1.5 py-0.5 rounded-lg bg-white/20 border border-white/20">
            <p className="text-[8px] font-black text-white tracking-[0.2em] uppercase">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Glass Inner Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
});
