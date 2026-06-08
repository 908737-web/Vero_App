import React, { useState, useMemo, useEffect } from "react";
import { dictionaryData } from "../data/dictionaryData";
import { DictionaryItem } from "../types/dictionary";
import { Search, Heart, FolderPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { ThemeColors } from "../types";

interface DictionaryProps {
  isDarkMode: boolean;
  currentTheme?: ThemeColors;
}

export function Dictionary({ isDarkMode, currentTheme }: DictionaryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) {
      return dictionaryData;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return dictionaryData.filter(
      (item) =>
        item.italian.toLowerCase().includes(lowerSearch) ||
        item.english.toLowerCase().includes(lowerSearch) ||
        item.altMeanings.some((m) => m.toLowerCase().includes(lowerSearch)),
    );
  }, [searchTerm]);

  const textColor = isDarkMode ? "text-white" : "text-slate-900";
  const mutedTextColor = isDarkMode ? "text-white/60" : "text-slate-500";
  const bgGlass = isDarkMode
    ? "bg-white/5 border-white/10"
    : "bg-white border-slate-200 shadow-sm";

  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <div className="pt-0 px-4 mb-2">
        <h2 className={`text-3xl font-black mb-3 ${textColor} tracking-tight`}>
          Dictionary
        </h2>
        <div
          className={`relative flex items-center w-full h-[52px] rounded-2xl border ${isDarkMode ? "bg-white/10 border-white/20" : "bg-white border-slate-200"} px-4 shadow-lg`}
        >
          <Search className={`w-5 h-5 ${mutedTextColor} mr-3`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words..."
            className={`w-full h-full bg-transparent outline-none ${textColor} placeholder:text-opacity-50 text-[17px] font-medium`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide space-y-4 px-4">
        <AnimatePresence>
          {filteredWords.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              key={item.id}
              className={`flex flex-col p-5 rounded-[28px] border ${bgGlass} shadow-lg backdrop-blur-xl relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span
                    className={`text-[28px] leading-none font-black tracking-tight ${textColor} mb-1.5`}
                  >
                    {item.italian}
                  </span>
                  <span className="text-lg font-bold text-indigo-400">
                    {item.english}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                  >
                    <FolderPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {item.altMeanings.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.altMeanings.map((m, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold tracking-wide ${isDarkMode ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600"}`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(item.synonyms.length > 0 || item.antonyms.length > 0) && (
                <div
                  className="mt-4 pt-4 border-t border-current"
                  style={{
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex flex-col gap-2.5">
                    {item.synonyms.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-[10px] uppercase font-black tracking-wider ${mutedTextColor}`}
                        >
                          Synonyms
                        </span>
                        <span className={`text-sm font-medium ${textColor}`}>
                          {item.synonyms.join(", ")}
                        </span>
                      </div>
                    )}
                    {item.antonyms.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-[10px] uppercase font-black tracking-wider ${mutedTextColor}`}
                        >
                          Antonyms
                        </span>
                        <span className={`text-sm font-medium ${textColor}`}>
                          {item.antonyms.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
