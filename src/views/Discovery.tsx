import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { BookOpen, Map, Headphones, Sparkles, Plus, Check, ChevronUp, Filter, Search, ArrowLeft, Film, Compass, Tv, Youtube, Play } from 'lucide-react';
import { DiscoveryTile } from '../components/DiscoveryTile';

interface Package {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  thumbnail?: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  image: string;
  color: string;
  size: 'large' | 'medium' | 'vertical' | 'small';
  packages: Package[];
}

const CATEGORIES: Category[] = [
  {
    id: 'vocab',
    title: 'Vocabulary Realm',
    subtitle: 'PALAZZO DUCALE',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000',
    color: '#3b82f6',
    size: 'large',
    packages: [
      { id: 'top100', title: 'Essential 100 Words', description: 'Master the foundations of Venetian survival.', icon: BookOpen, color: '#3b82f6' },
      { id: 'kitchen', title: 'Maritime Slang', description: 'Speak like the ancient Lagoon explorers.', icon: BookOpen, color: '#3b82f6' },
      { id: 'poetry', title: 'Lyric Expressions', description: 'The romantic tongue of the canals.', icon: BookOpen, color: '#3b82f6' },
    ]
  },
  {
    id: 'grammar',
    title: 'Grammar Quest',
    subtitle: 'PONTE DI RIALTO',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?auto=format&fit=crop&q=80&w=1000',
    color: '#10b981',
    size: 'medium',
    packages: [
      { id: 'congiuntivo', title: 'The Subjunctive Seal', description: 'Express desires in the city of masks.', icon: Map, color: '#10b981' },
      { id: 'passato', title: 'Past Tense Relics', description: 'Unlock the history of the old canal routes.', icon: Map, color: '#10b981' },
      { id: 'prepositions', title: 'Bridge Prepositions', description: 'Navigate through the tight alleys and channels.', icon: Map, color: '#10b981' }
    ]
  },
  {
    id: 'media',
    title: 'Media Archive',
    subtitle: 'PIAZZA SAN MARCO',
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1512100356136-7729860ef796?auto=format&fit=crop&q=80&w=1000',
    color: '#8b5cf6',
    size: 'vertical',
    packages: [
      { id: 'podcast', title: 'Echoes of Venice', description: 'Tales from the Rialto Bridge.', icon: Headphones, color: '#8b5cf6', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80' },
      { id: 'cinema', title: 'Classic Cinema', description: 'Timeless Italian masterpieces.', icon: Film, color: '#8b5cf6', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80' },
      { id: 'docs', title: 'Documentaries', description: 'Deep dives into history.', icon: Compass, color: '#8b5cf6', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80' },
      { id: 'news', title: 'News & Live', description: 'Current events from Italy.', icon: Tv, color: '#8b5cf6', thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80' },
      { id: 'vlogs', title: 'Daily Vlogs', description: 'Everyday life in the streets.', icon: Youtube, color: '#8b5cf6', thumbnail: 'https://images.unsplash.com/photo-1588694851213-911e38dd4955?auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'culture',
    title: 'Heritage Nuggets',
    subtitle: 'PONTE DEI SOSPIRI',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1517941823-815bea90d291?auto=format&fit=crop&q=80&w=1000',
    color: '#f59e0b',
    size: 'small',
    packages: [
      { id: 'gestures', title: 'Mask Etiquette', description: 'Unspoken rules of the Carnival.', icon: Sparkles, color: '#f59e0b' },
      { id: 'gondola', title: 'Gondola Code', description: 'Traditional calls and row patterns.', icon: Sparkles, color: '#10b981' }
    ]
  }
];

interface DiscoveryProps {
  onAddPackage: (pkg: Package, coords?: { x: number, y: number }) => void;
  activePackageIds: string[];
  themeColor: string;
  setThemeColor: (color: string) => void;
  isDarkMode?: boolean;
  onDeepViewChange?: (isDeep: boolean) => void;
  isDeepView?: boolean;
}

const PackageCardButton: React.FC<{ isActive: boolean, onAddPackage: (pkg: Package, coords?: { x: number, y: number }) => void, pkg: Package, isDarkMode: boolean }> = ({ isActive, onAddPackage, pkg, isDarkMode }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) return;
    setIsAnimating(true);
    setTimeout(() => {
      onAddPackage(pkg, { x: e.clientX, y: e.clientY });
      setIsAnimating(false);
    }, 400); // match animation duration
  };

  return (
    <button
      onClick={handleClick}
      disabled={isActive || isAnimating}
      className={`w-[65px] h-[20px] rounded-xl font-bold text-[10px] tracking-wider transition-all border flex items-center justify-center gap-1 overflow-hidden relative ${
        isActive 
          ? isDarkMode ? 'bg-white/5 border-white/5 text-white/20' : 'bg-black/5 border-black/5 text-black/20'
          : isDarkMode 
            ? 'bg-blue-500/20 border-blue-500/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
            : 'bg-white/40 border-white/50 text-blue-600 shadow-sm hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      <AnimatePresence mode="wait">
        {isAnimating && (
          <motion.div 
            className="absolute inset-0 bg-white/40 z-0"
            initial={{ x: '-100%', skewX: -20 }}
            animate={{ x: '100%', skewX: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      <span className="relative flex items-center justify-center gap-1 z-10 w-full h-full pointer-events-none">
      {isActive ? (
        <>
          <Check size={10} strokeWidth={2.5} />
          <span>ADDED</span>
        </>
      ) : (
        <>
          <Plus size={10} strokeWidth={2.5} />
          <span>GET</span>
        </>
      )}
      </span>
    </button>
  );
};

const PackageCard: React.FC<{ pkg: Package, isActive: boolean, onAddPackage: (pkg: Package, coords?: { x: number, y: number }) => void, isDarkMode: boolean }> = ({ pkg, isActive, onAddPackage, isDarkMode }) => {
  return (
    <div className="discovery-pack-card">
      <div className="flex items-center gap-1.5 mb-2 pointer-events-none">
         <div style={{ color: pkg.color || '#fff' }}>
           <pkg.icon size={20} strokeWidth={1.5} />
         </div>
         <h2 className="!my-0 leading-tight">{pkg.title}</h2>
      </div>
      <p className="flex-1 pointer-events-none !text-[0.75rem] font-normal leading-tight opacity-70">
        {pkg.description}
      </p>
      
      <div className="flex justify-start relative z-10 w-fit pointer-events-auto mt-2">
         <PackageCardButton isActive={isActive} onAddPackage={onAddPackage} pkg={pkg} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

const PackageStack3D: React.FC<{ title: string, data: Package[], onAddPackage: (pkg: Package, coords?: { x: number, y: number }) => void, activePackageIds: string[], themeColor: string, isDarkMode: boolean }> = ({ title, data, onAddPackage, activePackageIds, themeColor, isDarkMode }) => {
  const [packages, setPackages] = useState(data);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 50 || Math.abs(info.offset.y) > 50) {
      setPackages((prev) => {
        const next = [...prev];
        const top = next.shift();
        if (top) next.push(top);
        return next;
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center relative py-6 mt-4">
      <div className="w-full px-3 flex flex-col items-start gap-3">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>{title}</h3>
      </div>
      
      <div className="relative w-[280px] h-[190px] flex justify-center items-center mt-6">
        <div className="discovery-pack-accents">
            <div className="acc-card"></div>
            <div className="acc-card"></div>
            <div className="acc-card"></div>
            <div className="light"></div><div className="light sm"></div>
            <div className="top-light-neon"></div>
        </div>

        {packages.map((pkg, i) => {
          const isTop = i === 0;
          return (
            <motion.div
              key={pkg.id}
              initial={false}
              animate={{ 
                scale: 1 - (i * 0.05), 
                y: 0,
                x: 0,
                zIndex: data.length - i 
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="absolute shrink-0 flex justify-center items-center origin-center"
              drag={isTop ? true : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={isTop ? handleDragEnd : undefined}
              whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              style={{ cursor: isTop ? 'grab' : 'auto' }}
            >
              <PackageCard 
                pkg={pkg} 
                isActive={activePackageIds.includes(pkg.id)}
                onAddPackage={onAddPackage}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryDetailView: React.FC<{ category: Category, onBack: () => void, onAddPackage: (pkg: Package, coords?: { x: number, y: number }) => void, activePackageIds: string[], themeColor: string, isDarkMode: boolean }> = ({ category, onBack, onAddPackage, activePackageIds, themeColor, isDarkMode }) => {
  const allPackages = category.packages;
  const usefulPhrases = allPackages.length > 1 ? [...allPackages].reverse() : allPackages;
  const communityFavs = allPackages.length > 0 ? [...allPackages, ...allPackages].slice(0, 3) : allPackages;
  
  return (
    <motion.div
      key="category-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col bg-transparent"
    >


      <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide relative pt-24">
        {category.id === 'media' ? (
          <div className="flex-1 w-full h-[600px] flex justify-center items-center relative z-10 pb-32">
            <div className="scene w-full h-[400px]">
                <div className="a3d" style={{ '--n': allPackages.length } as React.CSSProperties}>
                    {allPackages.map((pkg, idx) => {
                      const isActive = activePackageIds.includes(pkg.id);
                      return (
                        <div 
                           key={pkg.id} 
                           onClick={() => !isActive && onAddPackage(pkg)}
                           className={`scene-card relative overflow-hidden group cursor-pointer border ${isActive ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-[#030712]' : 'border-white/10'}`} 
                           style={{ '--i': idx } as React.CSSProperties}
                        >
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{ backgroundImage: `url(${pkg.thumbnail || ''})` }}
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white text-left">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                                    <pkg.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#a78bfa] mb-2 block drop-shadow-sm">
                                    {isActive ? 'ADDED' : pkg.description}
                                  </span>
                                  <h3 className="font-serif text-xl font-bold leading-tight drop-shadow-md mb-2">
                                    {pkg.title}
                                  </h3>
                                  {!isActive && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-[-18px]">
                                      <Plus className="w-3.5 h-3.5" fill="currentColor" />
                                      <span>Add to learning path</span>
                                    </div>
                                  )}
                                  {isActive && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 absolute bottom-[-18px]">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>In your library</span>
                                    </div>
                                  )}
                                </div>
                            </div>
                        </div>
                      )
                    })}
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0 pb-32">
            <PackageStack3D 
              title="Top Picks" 
              data={allPackages} 
              onAddPackage={onAddPackage}
              activePackageIds={activePackageIds}
              themeColor={themeColor}
              isDarkMode={isDarkMode}
            />
            <PackageStack3D 
              title="Community Favorites" 
              data={communityFavs} 
              onAddPackage={onAddPackage}
              activePackageIds={activePackageIds}
              themeColor={themeColor}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Discovery: React.FC<DiscoveryProps> = ({ onAddPackage, activePackageIds, themeColor, setThemeColor, isDarkMode = true, onDeepViewChange, isDeepView }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (isDeepView === false && selectedCategory !== null) {
      setSelectedCategory(null);
      setThemeColor('');
    }
  }, [isDeepView, selectedCategory, setThemeColor]);

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    setThemeColor(cat.color);
    onDeepViewChange?.(true);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setThemeColor('');
    onDeepViewChange?.(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 z-0 transition-colors duration-1000"
        style={{
          background: themeColor 
            ? `radial-gradient(circle at 50% 50%, ${themeColor}${isDarkMode ? '20' : '30'} 0%, transparent 100%)`
            : 'transparent'
        }}
      />

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full grid grid-cols-2 auto-rows-[134px] gap-[10px] pt-24 pb-32 overflow-y-auto scrollbar-hide px-3"
          >
            {CATEGORIES.map((cat) => (
              <DiscoveryTile
                key={cat.id}
                {...cat}
                onClick={() => handleCategorySelect(cat)}
              />
            ))}
          </motion.div>
        ) : (
          <CategoryDetailView
            category={selectedCategory}
            onBack={handleBack}
            onAddPackage={onAddPackage}
            activePackageIds={activePackageIds}
            themeColor={themeColor}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
