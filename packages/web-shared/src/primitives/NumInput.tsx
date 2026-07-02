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
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-[72px] rounded-md border-[0.5px] border-border-subtle bg-surface-elevated px-2 py-[5px] font-mono text-[13px] text-text-primary outline-none"
      />
      {unit && <span className="text-[11px] text-text-muted">{unit}</span>}
    </div>
  );
}
