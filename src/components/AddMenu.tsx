import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Headphones, ListVideo, Brain, X, MessageSquare, FlaskConical, PenTool, Check } from 'lucide-react';

export const AVAILABLE_ITEMS = [
  { id: 'vocab', name: 'Vocabulary', icon: BookOpen },
  { id: 'grammar', name: 'Grammar', icon: MessageSquare },
  { id: 'listening', name: 'Listening', icon: Headphones },
  { id: 'verblab', name: 'Verb Lab', icon: FlaskConical },
  { id: 'stories', name: 'Stories', icon: PenTool },
  { id: 'youtube', name: 'Youtube', icon: ListVideo },
  { id: 'smartlib', name: 'Smartlib', icon: Brain },
];

interface AddMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeIds: string[];
  onToggle: (id: string) => void;
}

export const AddMenu: React.FC<AddMenuProps> = ({ isOpen, onClose, activeIds, onToggle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
            className="fixed top-24 right-6 z-[1000] w-64 glass rounded-[32px] p-4 border border-white/20 shadow-2xl flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="font-bold text-white text-base tracking-tight">Ecosystem</span>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              {AVAILABLE_ITEMS.map((item) => {
                const isActive = activeIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group ${
                      isActive ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xl border border-white/10 ${isActive ? 'bg-white/10' : 'bg-transparent'}`}>
                        <item.icon size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-white text-sm">{item.name}</span>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-blue-500 border-blue-500 scale-105' 
                        : 'border-white/20 scale-90'
                    }`}>
                      {isActive && <Check size={12} className="text-white stroke-[3px]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
