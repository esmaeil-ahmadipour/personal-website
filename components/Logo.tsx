"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withBackground?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  withBackground = true,
}) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme || theme) === "dark" : true;

  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const containerClasses = isDark
    ? "bg-amber-400/10 border border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/15 focus-within:shadow-lg focus-within:shadow-amber-500/15"
    : "bg-emerald-500/10 border border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/15 focus-within:shadow-lg focus-within:shadow-emerald-500/15";

  const logoSrc = isDark ? "/images/logo-gold.png" : "/images/logo.png";

  return (
    <div
      className={`
        relative ${sizeMap[size]}
        rounded-xl overflow-hidden
        flex items-center justify-center
        p-1 transition-all duration-300
        ${withBackground ? containerClasses : ""}
        ${className}
      `}
    >
      <Image
        src={logoSrc}
        alt="Tarvix logo"
        fill
        className="object-contain p-0.5"
        sizes="36px"
        priority
      />
    </div>
  );
};

export default Logo;
