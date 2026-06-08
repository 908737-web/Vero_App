interface LiquidCapsuleButtonProps {
  onClick: () => void;
  label?: string;
}

export const LiquidCapsuleButton = ({ onClick, label = 'PACKAGES' }: LiquidCapsuleButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative flex items-center justify-center px-3 py-2.5 @max-xs:px-2 @max-xs:py-1.5 rounded-full overflow-hidden transition-all max-w-full w-fit @max-xs:w-full bg-black/20 hover:bg-black/30 border border-white/10 active:scale-95"
    >
      <span className="relative z-10 text-white/90 font-medium text-[clamp(0.5rem,5cqw,0.65rem)] uppercase tracking-wider truncate w-full text-center">
        {label}
      </span>
    </button>
  );
};

