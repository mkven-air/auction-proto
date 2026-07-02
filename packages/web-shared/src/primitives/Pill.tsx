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
      className="inline-flex items-center rounded-full px-2 py-[3px] font-semibold tracking-wide whitespace-nowrap"
      style={{ color, background: bg, fontSize: size }}
    >
      {children}
    </span>
  );
}
