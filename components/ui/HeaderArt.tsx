// components/ui/HeaderArt.tsx
/* Decorative animated page-header illustrations, taken from the design.
   Colors follow the theme tokens; animations live in globals.css (.hx). */

const ART = {
  home: (
    <>
      <g style={{ opacity: 0.5 }}>
        <g className="cg" style={{ animationDelay: "0s" }}>
          <path className="g" strokeWidth="1.5" d="M20.5 113.9V130.8" />
          <rect x="17" y="116.7" width="7" height="11.3" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "0.3s" }}>
          <path className="g" strokeWidth="1.5" d="M32.5 102.6V119.5" />
          <rect x="29" y="105.4" width="7" height="11.3" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "0.6s" }}>
          <path className="b" strokeWidth="1.5" d="M44.5 101.1V115.3" />
          <rect x="41" y="105.4" width="7" height="7.1" rx="1.5" fill="hsl(var(--accent-blue))" stroke="hsl(var(--accent-blue))" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "0.9s" }}>
          <path className="g" strokeWidth="1.5" d="M56.5 89.8V113.9" />
          <rect x="53" y="92.7" width="7" height="19.8" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "1.2s" }}>
          <path className="g" strokeWidth="1.5" d="M68.5 77.1V95.5" />
          <rect x="65" y="79.9" width="7" height="12.8" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "1.5s" }}>
          <path className="b" strokeWidth="1.5" d="M80.5 74.3V89.8" />
          <rect x="77" y="79.9" width="7" height="7.1" rx="1.5" fill="hsl(var(--accent-blue))" stroke="hsl(var(--accent-blue))" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "1.8s" }}>
          <path className="g" strokeWidth="1.5" d="M92.5 58.7V88.4" />
          <rect x="89" y="63.0" width="7" height="24.0" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "2.1s" }}>
          <path className="g" strokeWidth="1.5" d="M104.5 41.8V65.8" />
          <rect x="101" y="46.0" width="7" height="17.0" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "2.4s" }}>
          <path className="b" strokeWidth="1.5" d="M116.5 40.4V55.9" />
          <rect x="113" y="46.0" width="7" height="7.1" rx="1.5" fill="hsl(var(--accent-blue))" stroke="hsl(var(--accent-blue))" strokeWidth="2" />
        </g>
        <g className="cg" style={{ animationDelay: "2.7s" }}>
          <path className="g" strokeWidth="1.5" d="M128.5 22.0V54.5" />
          <rect x="125" y="24.8" width="7" height="28.3" rx="1.5" fill="#34d399" stroke="#34d399" strokeWidth="2" />
        </g>
      </g>
      <path className="g ua" d="M26 42V20M17 29L26 20L35 29" />
      <g style={{ opacity: 0.7 }}>
        <rect className="vb" x="98" y="122" width="5" height="10" rx="1.5" fill="hsl(var(--accent-blue))" stroke="none" />
        <rect className="vb" x="106" y="114" width="5" height="18" rx="1.5" fill="hsl(var(--accent-blue))" stroke="none" style={{ animationDelay: "0.3s" }} />
        <rect className="vb" x="114" y="118" width="5" height="14" rx="1.5" fill="hsl(var(--accent-blue))" stroke="none" style={{ animationDelay: "0.6s" }} />
        <rect className="vb" x="122" y="106" width="5" height="26" rx="1.5" fill="hsl(var(--accent-blue))" stroke="none" style={{ animationDelay: "0.9s" }} />
        <rect className="vb" x="130" y="112" width="5" height="20" rx="1.5" fill="hsl(var(--accent-blue))" stroke="none" style={{ animationDelay: "1.2s" }} />
      </g>
    </>
  ),
  projects: (
    <>
      <g className="c1" style={{ transformOrigin: "75px 124px" }}>
        <rect x="40" y="34" width="70" height="84" rx="10" fill="hsl(var(--bg-elevated))" stroke="hsl(var(--border-strong))" />
      </g>
      <g className="c3" style={{ transformOrigin: "75px 124px" }}>
        <rect x="40" y="34" width="70" height="84" rx="10" fill="hsl(var(--bg-elevated))" stroke="hsl(var(--border-strong))" />
      </g>
      <g className="fl">
        <rect className="b" x="40" y="34" width="70" height="84" rx="10" fill="hsl(var(--bg-surface))" />
        <rect x="50" y="44" width="30" height="6" rx="3" fill="hsl(var(--accent-blue))" stroke="none" />
        <path className="dr g" d="M50 100L64 86L76 92L98 66" />
      </g>
    </>
  ),
  project: (
    <>
      <circle className="n" cx="75" cy="75" r="18" />
      <circle className="n" cx="75" cy="75" r="36" />
      <circle className="n" cx="75" cy="75" r="54" />
      <path className="n" d="M75 21V129M21 75H129" />
      <g className="vc sw">
        <path d="M75 75H129A54 54 0 0 0 75 21Z" fill="hsl(var(--accent-blue))" fillOpacity=".25" stroke="none" />
        <path className="b" d="M75 75H129" />
      </g>
      <circle className="o g pu" cx="100" cy="50" r="5" fill="currentColor" />
      <circle className="o g pu" cx="52" cy="96" r="5" fill="currentColor" style={{ animationDelay: ".7s" }} />
      <circle className="o y pu" cx="104" cy="100" r="4" fill="currentColor" style={{ animationDelay: "1.4s" }} />
    </>
  ),
  blog: (
    <>
      <rect className="n" x="38" y="26" width="74" height="98" rx="10" />
      <rect className="lt sx" x="50" y="42" width="44" height="6" rx="3" fill="hsl(var(--accent-blue))" stroke="none" />
      <rect className="lt sx" x="50" y="62" width="50" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" />
      <rect className="lt sx" x="50" y="74" width="44" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" style={{ animationDelay: "0.3s" }} />
      <rect className="lt sx" x="50" y="86" width="50" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" style={{ animationDelay: "0.6s" }} />
      <rect className="lt sx" x="50" y="98" width="30" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" style={{ animationDelay: "0.9s" }} />
      <rect className="pu" x="84" y="95" width="3" height="12" fill="hsl(var(--accent-blue))" stroke="none" />
    </>
  ),
  article: (
    <>
      <rect className="n" x="30" y="26" width="84" height="98" rx="10" />
      <rect className="hl" x="40" y="58" width="64" height="14" rx="4" fill="hsl(var(--accent-blue))" fillOpacity=".25" stroke="none" />
      <rect className="lt sx" x="42" y="38" width="40" height="6" rx="3" fill="hsl(var(--accent-blue))" stroke="none" />
      <rect className="lt sx" x="42" y="62" width="60" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" />
      <rect className="lt sx" x="42" y="78" width="52" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" />
      <rect className="lt sx" x="42" y="94" width="60" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" />
      <rect className="lt sx" x="42" y="108" width="36" height="6" rx="3" fill="hsl(var(--border-strong))" stroke="none" />
      <path className="n" d="M130 36V108" />
      <circle className="dt b" cx="130" cy="36" r="5" fill="currentColor" />
    </>
  ),
};

type HeaderArtProps =
  | { variant: keyof typeof ART }
  | { variant: "newsletter"; number?: number }
  | { variant: "issue"; number: number };

/** Opening envelope; the badge shows the latest issue number when there is one. */
function NewsletterArt({ number }: { number?: number }) {
  return (
    <>
      <rect className="lu n" x="44" y="40" width="62" height="50" rx="6" fill="hsl(var(--bg-elevated))" />
      <g className="lu">
        <path className="b" d="M54 54H96M54 66H84" />
      </g>
      <rect className="b" x="30" y="62" width="90" height="62" rx="10" fill="hsl(var(--bg-surface))" />
      <path className="b" d="M30 68L75 100L120 68" />
      {number !== undefined && (
        <>
          <circle className="o g pu" cx="118" cy="52" r="11" fill="currentColor" stroke="none" />
          <text x="118" y="56" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0B0C0E" stroke="none">
            #{number}
          </text>
        </>
      )}
    </>
  );
}

/** Progress ring around the issue number. */
function IssueArt({ number }: { number: number }) {
  return (
    <>
      <circle className="n" cx="75" cy="75" r="44" strokeWidth="6" />
      <g transform="rotate(-90 75 75)">
        <circle className="rg b" cx="75" cy="75" r="44" strokeWidth="6" />
      </g>
      <text x="75" y="86" textAnchor="middle" fontSize="34" fontWeight="800" fill="hsl(var(--text-primary))" stroke="none">
        #{String(number).padStart(2, "0")}
      </text>
      <circle className="o g pu" cx="75" cy="120" r="3" fill="currentColor" />
    </>
  );
}

/** Place inside an element with the "hx-header" class. Hidden on small screens. */
export function HeaderArt(props: HeaderArtProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="hx"
      viewBox="0 0 150 150"
      width="150"
      height="150"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="1"
        y="1"
        width="148"
        height="148"
        rx="28"
        fill="hsl(var(--bg-surface))"
        stroke="hsl(var(--border-subtle))"
      />
      {props.variant === "newsletter" ? (
        <NewsletterArt number={props.number} />
      ) : props.variant === "issue" ? (
        <IssueArt number={props.number} />
      ) : (
        ART[props.variant]
      )}
    </svg>
  );
}
