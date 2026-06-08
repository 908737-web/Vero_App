import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Globe, Zap, X } from 'lucide-react';
import { MODULE_PACKAGES } from '../constants/packages';

interface PackageSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string | null;
  selectedPackageId: string;
  onSelect: (packageId: string) => void;
}

export const PackageSelectorDrawer = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  selectedPackageId,
  onSelect 
}: PackageSelectorDrawerProps) => {
  if (!moduleId) return null;

  const packages = MODULE_PACKAGES[moduleId] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop with heavy blur as requested */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[80px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md h-[70vh] rounded-[3rem] border border-white/20 overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between">
              <div>
                <h2 className="text-[clamp(1.25rem,6vw,1.75rem)] font-extrabold text-white tracking-tight leading-none">
                  Package Library
                </h2>
                <p className="text-white/50 text-[clamp(0.6rem,2vw,0.7rem)] font-bold uppercase tracking-widest mt-1.5 line-clamp-1">
                  Select Data Source
                </p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-3 pb-8 space-y-3 custom-scrollbar">
              <div className="text-[clamp(0.55rem,2vw,0.65rem)] font-bold text-white/40 uppercase tracking-widest pl-1 mb-2">
                Available Packages
              </div>
              
              {packages.map((pkg, idx) => (
                <motion.button
                  key={pkg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    onSelect(pkg.id);
                    // Close happens after small delay for animation if needed
                    onClose();
                  }}
                  className={`group relative w-full p-3 sm:p-4 rounded-2xl flex items-center gap-3 sm:gap-4 transition-all active:scale-[0.98] ${
                    selectedPackageId === pkg.id 
                      ? 'bg-white/10 border-white/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } border`}
                  style={{
                    boxShadow: selectedPackageId === pkg.id 
                      ? 'inset 0 1px 4px rgba(255, 255, 255, 0.2), 0 10px 20px rgba(0, 0, 0, 0.2)' 
                      : 'none'
                  }}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                    selectedPackageId === pkg.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/20 group-hover:text-white/40'
                  }`}>
                    {idx % 2 === 0 ? <ShieldCheck size={20} /> : <Globe size={20} />}
                  </div>
                  
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-[clamp(0.9rem,4vw,1.1rem)] font-extrabold text-white tracking-tight leading-tight line-clamp-1">
                      {pkg.name}
                    </div>
                    <div className="text-[clamp(0.55rem,2vw,0.65rem)] font-bold text-white/40 uppercase tracking-widest mt-0.5 line-clamp-1">
                      {idx % 2 === 0 ? 'Official Collection' : 'Community Add-on'}
                    </div>
                  </div>

                  {selectedPackageId === pkg.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="ml-auto w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                  )}
                  
                  {/* Prismatic edge reflection */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/20 pointer-events-none transition-colors" />
                </motion.button>
              ))}

              {/* Mock Community Packages */}
              <div className="pt-4 text-[clamp(0.55rem,2vw,0.65rem)] font-bold text-white/40 uppercase tracking-widest pl-1 mb-2">
                Discover More
              </div>
              {[1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-full p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 sm:gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                    {i === 1 ? <Sparkles size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-[clamp(0.9rem,4vw,1.1rem)] font-extrabold text-white tracking-tight leading-tight line-clamp-1">
                      {i === 1 ? 'Street Slang Pro' : 'Napoli Dialect Pack'}
                    </div>
                    <div className="text-[clamp(0.55rem,2vw,0.65rem)] font-bold text-white/40 uppercase tracking-widest mt-0.5 line-clamp-1">
                      External Package
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom Glass Glow */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
