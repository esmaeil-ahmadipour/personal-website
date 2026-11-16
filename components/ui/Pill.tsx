import Link from "next/link";
import { cn } from "@/lib/utils";

interface PillProps {
  /** With href the pill is a link; without it, static text. */
  href?: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Pill({ href, active, className, children }: PillProps) {
  const classes = cn("pill", className);
  if (!href) return <span className={classes}>{children}</span>;
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={classes}>
      {children}
    </Link>
  );
}
