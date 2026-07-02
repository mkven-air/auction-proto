import type { ReactNode } from "react";

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
    <div className="rounded-[10px] border-[0.5px] border-border-default bg-surface-elevated px-[18px] py-4">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.9px] text-text-muted uppercase">
        {label}
      </div>
      <div
        className="font-mono text-[22px] leading-[1.1] font-bold"
        style={{ color: accent ?? "var(--text-primary)" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1.5 text-xs text-text-muted">{sub}</div>}
    </div>
  );
}
