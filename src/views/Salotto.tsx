import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Users, Coffee, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
}

interface Forum {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  messages: Message[];
}

const MOCK_FORUMS: Forum[] = [
  {
    id: '1',
    title: 'Language Lounge',
    icon: Coffee,
    description: 'Casual talk about Italian grammar & slang.',
    messages: [
      { id: '1', sender: 'Giulia', avatar: 'https://i.pravatar.cc/150?u=giulia', text: 'Hey, everyone! Tipsy me just realized: "Congiuntivo" is a rollercoaster!' },
      { id: '2', sender: 'Marco', avatar: 'https://i.pravatar.cc/150?u=marco', text: 'Haha, tell me about it! I spent 2 hours on it last night.' },
      { id: '3', sender: 'Luca', avatar: 'https://i.pravatar.cc/150?u=luca', text: '*hic* It definitely feels like driving a gondola in the dark!' }
    ]
  },
  {
    id: '2',
    title: 'Venice Chronicles',
    icon: Users,
    description: 'Stories and secrets of the city.',
    messages: [
      { id: '4', sender: 'Sofia', avatar: 'https://i.pravatar.cc/150?u=sofia', text: 'Did you know the masks were used for more than just parties?' },
      { id: '5', sender: 'Alessandro', avatar: 'https://i.pravatar.cc/150?u=alessandro', text: 'Exactly! They were also for anonymity in political deals... and definitely some secrets.' },
      { id: '6', sender: 'Giulia', avatar: 'https://i.pravatar.cc/150?u=giulia', text: 'Ooooh, I love a good political drama over spritz!' }
    ]
  },
  {
    id: '3',
    title: 'Culture & Carnival',
    icon: Sparkles,
    description: 'Preparing for the next celebration.',
    messages: [
      { id: '7', sender: 'Marco', avatar: 'https://i.pravatar.cc/150?u=marco', text: 'Who has their mask ready for the carnival?' },
      { id: '8', sender: 'Luca', avatar: 'https://i.pravatar.cc/150?u=luca', text: 'Wait, Carnival? Is it that time again? Already? *grabs more wine*' },
      { id: '9', sender: 'Sofia', avatar: 'https://i.pravatar.cc/150?u=sofia', text: 'Yes, Luca, and you need to look fabulous!' }
    ]
  }
];

import { ThemeColors } from '../types';

export const SalottoView: React.FC<{ isDarkMode: boolean; currentTheme?: ThemeColors }> = ({ isDarkMode, currentTheme }) => {
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full w-full p-4 overflow-y-auto ${isDarkMode ? 'bg-black/40 backdrop-blur-3xl' : 'bg-white/40 backdrop-blur-3xl'}`}
    >
      <h2 className={`text-3xl font-serif font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Il Salotto</h2>
      
      <div className="grid gap-4">
        {MOCK_FORUMS.map((forum, idx) => (
          <motion.div
            key={forum.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-3xl cursor-pointer ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'} shadow-lg`}
            onClick={() => setSelectedForum(forum)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-[#fff3ed]'}`}>
                <forum.icon className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{forum.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{forum.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedForum && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed inset-0 z-50 p-4 pt-12 ${isDarkMode ? 'bg-black/60 backdrop-blur-3xl' : 'bg-white/60 backdrop-blur-3xl'}`}
          >
            <button 
              onClick={() => setSelectedForum(null)}
              className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500"
            >
              ← Back
            </button>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedForum.title}</h2>
            <div className="space-y-4">
              {selectedForum.messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <img src={msg.avatar} className="w-10 h-10 rounded-full" alt={msg.sender} />
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
                    <p className="font-bold text-xs">{msg.sender}</p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
