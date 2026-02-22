import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export function Logo({ variant = "light", size = "md", iconOnly = false }: LogoProps) {
  const textColor = variant === "light" ? "#FFFFFF" : "#0F1114";
  const accentColor = "#D9532B";

  const sizes = {
    sm: { iconW: 22, iconH: 22, fontSize: 13, letterSpacing: "0.22em", gap: 9 },
    md: { iconW: 28, iconH: 28, fontSize: 16, letterSpacing: "0.22em", gap: 11 },
    lg: { iconW: 40, iconH: 40, fontSize: 22, letterSpacing: "0.22em", gap: 14 },
  };

  const s = sizes[size];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: s.gap }}>
      {/* Icon: Two-layer enforcement gate — a precise geometric "P" cut */}
      <svg
        width={s.iconW}
        height={s.iconH}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top enforcement bar - full width, accent */}
        <rect x="5" y="4" width="18" height="3" rx="1" fill={accentColor} />

        {/* Vertical stem */}
        <rect x="5" y="4" width="3" height="20" rx="1" fill={textColor} fillOpacity="0.9" />

        {/* Upper bowl of P — rounded right side */}
        <path
          d="M8 4.5 L18 4.5 Q23 4.5 23 10.5 Q23 16.5 18 16.5 L8 16.5"
          stroke={textColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.85"
        />

        {/* Middle enforcement bar - second layer, partial */}
        <rect x="5" y="15" width="13" height="2.5" rx="1" fill={textColor} fillOpacity="0.45" />

        {/* Bottom bar - lightest, widest */}
        <rect x="5" y="21" width="18" height="2.5" rx="1" fill={textColor} fillOpacity="0.18" />

        {/* Accent dot: enforcement point on bowl tip */}
        <circle cx="23" cy="10.5" r="2.2" fill={accentColor} fillOpacity="0.9" />
      </svg>

      {!iconOnly && (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: s.fontSize,
            fontWeight: 700,
            letterSpacing: s.letterSpacing,
            color: textColor,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          PRAXIS
        </span>
      )}
    </div>
  );
}
