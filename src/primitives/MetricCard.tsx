import type { ReactNode } from "react";
import { F, T } from "../theme";

export function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: T.surfaceElevated,
        border: `0.5px solid ${T.borderDefault}`,
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: T.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.9,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accent || T.textPrimary,
          fontFamily: F.mono,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
