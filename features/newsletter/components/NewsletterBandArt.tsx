// features/newsletter/components/NewsletterBandArt.tsx
/* Decorative envelope from the design, shown at the end of the home newsletter band.
   Not a HeaderArt variant: it sits in the band's layout, not absolutely in a page header.
   The pulse animation (.band-art .pl) lives in globals.css. */

export function NewsletterBandArt() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="band-art"
      viewBox="0 0 150 150"
      width="150"
      height="150"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="75" cy="75" r="62" stroke="hsl(var(--accent-blue) / 0.3)" strokeWidth="12" />
      <circle
        cx="75"
        cy="75"
        r="48"
        fill="hsl(var(--bg-surface))"
        stroke="hsl(var(--border-strong))"
      />
      <rect x="48" y="58" width="54" height="38" rx="7" stroke="hsl(var(--accent-blue))" />
      <path d="M48 62L75 82L102 62" stroke="hsl(var(--accent-blue))" />
      <circle className="pl" cx="104" cy="52" r="9" fill="#34d399" stroke="none" />
    </svg>
  );
}
