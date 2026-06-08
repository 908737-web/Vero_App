import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Search, BookOpen, PenTool, Mic, Languages } from 'lucide-react';
import { WordEntry } from '../types/dictionary';

interface DictionaryEntryProps {
  data: WordEntry;
}

export const DictionaryEntry: React.FC<DictionaryEntryProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans"
    >
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-950/80 p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            defaultValue={data.word}
            className="w-full bg-slate-900 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-800"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        
        {/* Word Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white">{data.word}</h1>
            <p className="text-indigo-400 font-mono mt-1 text-sm">{data.ipa}</p>
          </div>
          <button className="p-3 bg-indigo-500/10 rounded-full text-indigo-400 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Parts of Speech */}
        {data.parts.map((part, pIdx) => (
          <div key={pIdx} className="mb-8">
            <h2 className="text-sm font-bold text-indigo-300 mb-4 flex items-center gap-2 uppercase tracking-widest bg-indigo-900/10 p-2 rounded-lg">
                <Languages size={16}/> {part.type}
            </h2>

            {part.definitions.map((def, dIdx) => (
              <div key={dIdx} className="mb-6 bg-slate-900/20 p-5 rounded-3xl border border-slate-800/50 shadow-lg">
                <div className="flex gap-3 mb-4">
                  <span className="text-indigo-500 font-bold text-lg">{dIdx + 1}.</span>
                  <p className="text-slate-100 text-lg leading-relaxed">{def.text}</p>
                </div>

                {/* Synonyms/Antonyms */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {def.synonyms.map(syn => (
                    <span key={syn} className="text-xs bg-emerald-900/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-900/30">Synonym: {syn}</span>
                  ))}
                  {def.antonyms.map(ant => (
                    <span key={ant} className="text-xs bg-rose-900/20 text-rose-400 px-3 py-1.5 rounded-full border border-rose-900/30">Antonym: {ant}</span>
                  ))}
                </div>

                {/* Examples */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  {def.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="text-sm flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{ex.italian}</p>
                        <p className="text-slate-400">{ex.persian}</p>
                      </div>
                      <button className="text-slate-600 hover:text-indigo-400">
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Grammar Note */}
        {data.grammarNote && (
          <div className="mb-8 p-5 bg-blue-900/10 border border-blue-900/30 rounded-3xl flex gap-3">
            <PenTool className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-100 text-sm leading-relaxed">
              <span className="font-bold text-blue-300 block mb-1">Grammar Note:</span>
              {data.grammarNote}
            </p>
          </div>
        )}

        {/* Phrases */}
        <div className="mb-8">
          <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={18} className="text-indigo-400"/> Idioms & Phrases</h3>
          <div className="space-y-3">
            {data.phrases.map((ph, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/20 p-4 rounded-2xl border border-slate-800/50">
                <span className="text-sm font-medium text-indigo-300">{ph.italian}</span>
                <span className="text-sm text-slate-400">{ph.persian}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Words */}
        <div className="pb-10">
          <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Related Words</h3>
          <div className="flex flex-wrap gap-2">
            {data.nearbyWords.map(word => (
              <span key={word} className="text-sm text-slate-300 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors cursor-pointer">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
