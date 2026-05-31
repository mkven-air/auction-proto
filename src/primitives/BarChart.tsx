import { T } from "../theme";

export function BarChart({
  data,
}: {
  data: Array<{ range: string; count: number; pct: number; color: string }>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.map((d) => (
        <div key={d.range} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 68, fontSize: 11, color: T.textMuted, flexShrink: 0 }}>
            {d.range}
          </div>
          <div
            style={{
              flex: 1,
              height: 6,
              background: T.borderDefault,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{ width: `${d.pct}%`, height: "100%", background: d.color, borderRadius: 3 }}
            />
          </div>
          <div
            style={{
              width: 18,
              fontSize: 12,
              fontWeight: 600,
              color: T.textPrimary,
              textAlign: "right",
            }}
          >
            {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}
