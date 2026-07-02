import { cn } from "../lib/utils";

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors",
        checked ? "bg-brand-primary" : "bg-border-default",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-3.5 w-3.5 rounded-full transition-[left]",
          checked ? "left-[17px] bg-text-primary" : "left-[3px] bg-neutral-text",
        )}
      />
    </button>
  );
}
