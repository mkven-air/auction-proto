export function BarChart({
  data,
}: {
  data: Array<{ range: string; count: number; pct: number; color: string }>;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      {data.map((d) => (
        <div key={d.range} className="flex items-center gap-2.5">
          <div className="w-[68px] shrink-0 text-[11px] text-text-muted">{d.range}</div>
          <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-border-default">
            <div
              className="h-full rounded-[3px]"
              style={{ width: `${d.pct}%`, background: d.color }}
            />
          </div>
          <div className="w-[18px] text-right text-xs font-semibold text-text-primary">
            {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}
