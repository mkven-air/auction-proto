import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 text-[11px] font-bold tracking-[1.2px] text-text-muted uppercase">
      {children}
    </div>
  );
}
