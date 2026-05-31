import type { ReactNode } from "react";

export function Pill({
  children,
  color,
  bg,
  size = 11,
}: {
  children: ReactNode;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 20,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: 0.2,
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
