import { T } from "../theme";

export function NumInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  unit = "",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 72,
          padding: "5px 8px",
          borderRadius: 6,
          border: `0.5px solid ${T.borderSubtle}`,
          background: T.surfaceElevated,
          color: T.textPrimary,
          fontSize: 13,
          fontFamily: "monospace",
          outline: "none",
        }}
      />
      {unit && <span style={{ fontSize: 11, color: T.textMuted }}>{unit}</span>}
    </div>
  );
}
