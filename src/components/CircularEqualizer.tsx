import React, { useEffect } from "react";

interface CircularEqualizerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const CircularEqualizer: React.FC<CircularEqualizerProps> = ({
  isPlaying,
  onToggle,
}) => {
  useEffect(() => {
    const styleId = "circular-equalizer-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .equalizer-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }

        /* ساختار پایه امواج */
        .neon-wave {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; /* ایجاد فرم مواج و نامنظم */
          transition: all 0.4s ease;
          opacity: 0.3;
          animation: liquid-rotation 4s linear infinite;
          animation-play-state: paused;
          mix-blend-mode: screen;
        }

        /* فعال شدن امواج هنگام پخش */
        .equalizer-wrapper.is-active .neon-wave {
          animation-play-state: running;
          opacity: 0.8;
        }

        /* موج ۱: فیروزهای */
        .wave-cyan {
          background: linear-gradient(45deg, transparent, #60efff);
          box-shadow: 0 0 15px #60efff;
          animation-duration: 4s;
        }

        /* موج ۲: بنفش نئونی (چرخص برعکس) */
        .wave-purple {
          background: linear-gradient(45deg, transparent, #9c27b0);
          box-shadow: 0 0 15px #9c27b0;
          animation-direction: reverse;
          animation-duration: 5s;
          transform: scale(0.95);
        }

        /* موج ۳: سبز نئونی */
        .wave-green {
          background: linear-gradient(45deg, transparent, #00ff87);
          box-shadow: 0 0 10px #00ff87;
          animation-duration: 3.5s;
          transform: scale(0.9);
        }

        /* دکمه مرکزی (Glassmorphism) */
        .glass-play-btn {
          position: relative;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: white;
          font-size: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-play-btn:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.1);
        }

        /* انیمیشن چرخش و تغییر فرم (مواجی شدن) */
        @keyframes liquid-rotation {
          0% {
            transform: rotate(0deg) scale(1);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          50% {
            transform: rotate(180deg) scale(1.1); /* اکولایزر با صدا بزرگ میشود */
            border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
          }
          100% {
            transform: rotate(360deg) scale(1);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
      <div className={`equalizer-wrapper ${isPlaying ? "is-active" : ""}`}>
        {/* امواج رنگی و سیال */}
        <div className="neon-wave wave-cyan"></div>
        <div className="neon-wave wave-purple"></div>
        <div className="neon-wave wave-green"></div>

        {/* دکمه مرکزی شیشهای */}
        <button
          className="glass-play-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>
  );
};
