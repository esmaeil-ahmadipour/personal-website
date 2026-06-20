interface SecurityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function SecurityScore({
  score,
  size = "md",
  showLabel = true,
}: SecurityScoreProps) {
  const sizeMap = {
    sm: { ring: 48, text: "text-xl", label: "text-[10px]" },
    md: { ring: 64, text: "text-2xl", label: "text-[11px]" },
    lg: { ring: 80, text: "text-3xl", label: "text-xs" },
  };

  const sizeClass = sizeMap[size];
  const circumference = sizeClass.ring * Math.PI;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 60) return "text-amber-400";
    if (s >= 40) return "text-orange-400";
    return "text-rose-400";
  };

  const ringColor = getColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative"
        style={{ width: sizeClass.ring, height: sizeClass.ring }}
      >
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${sizeClass.ring} ${sizeClass.ring}`}
        >
          {/* Background ring */}
          <circle
            cx={sizeClass.ring / 2}
            cy={sizeClass.ring / 2}
            r={sizeClass.ring / 2 - 4}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3"
          />
          {/* Progress ring */}
          <circle
            cx={sizeClass.ring / 2}
            cy={sizeClass.ring / 2}
            r={sizeClass.ring / 2 - 4}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold tracking-tight ${sizeClass.text} text-white`}
          >
            {score}
            <span className="text-white/30 text-sm">%</span>
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={`${sizeClass.label} font-medium tracking-widest uppercase text-white/30`}
        >
          Security
        </span>
      )}
    </div>
  );
}
