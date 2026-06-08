import React, { useRef, useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'motion/react';

interface DynamicHomeBarProps {
  onTap: () => void;
  onSwipeUp: () => void;
  onLongPress: () => void;
  isDarkMode?: boolean;
}

export const DynamicHomeBar: React.FC<DynamicHomeBarProps> = ({ onTap, onSwipeUp, onLongPress, isDarkMode = true }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();
  const hasSwiped = useRef(false);

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPressed(true);
    hasSwiped.current = false;
    controls.start({ scale: 0.95, opacity: 0.8 }).catch(() => {});
    
    pressTimer.current = setTimeout(() => {
      setIsPressed(false);
      controls.start({ scale: 1, opacity: 1 }).catch(() => {});
      if (!hasSwiped.current) {
        onLongPress();
      }
    }, 1500); // 1.5 seconds for long press
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    if (isPressed && !hasSwiped.current) {
      setIsPressed(false);
      controls.start({ scale: 1, opacity: 1 }).catch(() => {});
      onTap();
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    // If swipe up exceeds a threshold
    if (info.offset.y < -20) {
      hasSwiped.current = true;
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }
      setIsPressed(false);
      controls.start({ y: 0, scale: 1, opacity: 1 }).catch(() => {}); // reset position softly
      onSwipeUp();
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handlePan}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      animate={controls}
      className="w-[140px] h-[18px] rounded-full flex items-center justify-center cursor-pointer overflow-hidden backdrop-blur-md transition-all touch-none mb-2 relative z-[100]"
      style={{
        background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
        boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)' : '0 10px 30px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)',
        WebkitBackdropFilter: 'blur(30px)'
      }}
    >
      <div className="w-12 h-[2px] rounded-full bg-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
    </motion.div>
  );
};
