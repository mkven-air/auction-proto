import type { ReactNode } from "react";
import { T } from "../theme";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        color: T.textMuted,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}
