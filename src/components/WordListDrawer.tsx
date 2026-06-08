import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { MOCK_FLASHCARDS } from '../constants/mockData';

interface WordListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const WordListDrawer = ({ 
  isOpen, 
  onClose,
  isDarkMode,
}: WordListDrawerProps) => {

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) {
      return MOCK_FLASHCARDS;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return MOCK_FLASHCARDS.filter(card => {
      const matchIt = card.word_it.toLowerCase().includes(lowerSearch);
      const matchFa = card.translation_fa?.toLowerCase().includes(lowerSearch) ?? false;
      return matchIt || matchFa;
    });
  }, [searchTerm]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDarkMode ? 'text-white/60' : 'text-slate-500';
  const bgGlass = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10';

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
            className="absolute inset-0 bg-black/90"
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
                 <div className="flex items-center mb-4 pt-2 shrink-0">
                   <h2 className={`text-2xl font-bold ${textColor}`}>Vocabulary List</h2>
                 </div>
                 
                 <div className={`relative flex items-center w-full h-12 rounded-2xl border ${bgGlass} px-3 pointer-events-auto shadow-lg shrink-0 mb-4`}>
                    <Search className={`w-5 h-5 ${mutedTextColor} mr-3`} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Italian or Persian..."
                        className={`w-full h-full bg-transparent outline-none ${textColor} placeholder:text-opacity-50 text-base`}
                    />
                 </div>

                 <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 space-y-3">
                    <AnimatePresence mode="popLayout">
                    {filteredCards.length === 0 ? (
                        <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-10 text-center w-full"
                        >
                        <p className={mutedTextColor}>No words found for "{searchTerm}"</p>
                        </motion.div>
                    ) : (
                        filteredCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-center justify-between p-4 rounded-[20px] border ${bgGlass}`}
                        >
                            <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isDarkMode ? 'bg-white/10 text-white/50' : 'bg-slate-900/10 text-slate-500'}`}>
                                {index + 1}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className={`text-lg font-bold ${textColor}`}>{card.word_it}</span>
                                <span className={`text-sm ${mutedTextColor} font-medium`}>{card.translation_fa}</span>
                            </div>
                            </div>
                        </motion.div>
                        ))
                    )}
                    </AnimatePresence>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
