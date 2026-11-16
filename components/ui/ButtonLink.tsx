import Link from "next/link";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button-styles";

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** A real link that looks like the primary (gradient) or ghost button. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "default",
  external = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
