import { T } from "../theme";
import { useLocale } from "../locale";
import { cn } from "../lib/utils";
import type { SeatCell, SeatMapLayout } from "@auction/core";

export function SeatMap({ seatMap }: { seatMap: SeatMapLayout }) {
  const { txt } = useLocale();

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap gap-3">
        {[
          { c: T.seatTakenBg, l: txt.seatMap.taken },
          { c: T.brandPrimary, l: txt.seatMap.bid },
          { c: T.surfaceElevated, l: txt.seatMap.free, b: T.borderDefault },
        ].map((s) => (
          <div key={s.l} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-[2px] border-[0.5px]"
              style={{ background: s.c, borderColor: s.b || s.c }}
            />
            <span className="text-[11px] text-text-muted">{s.l}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, 28px)" }}>
        {seatMap.flatMap((row) => {
          const rowKey = row
            .filter((seat): seat is SeatCell => seat !== null)
            .map((seat) => seat.id)
            .join("-");
          return row.map((seat) =>
            seat === null ? (
              <div key={`${rowKey}-aisle`} className="w-1" />
            ) : (
              <div
                key={seat.id}
                className={cn(
                  "flex h-[22px] w-7 items-center justify-center rounded-[3px] border-[0.5px] text-[9px] font-semibold",
                  seat.bid
                    ? "border-brand-primary bg-brand-primary text-on-brand-primary"
                    : seat.taken
                      ? "border-seat-taken-border bg-seat-taken-bg text-seat-taken-fg"
                      : "border-border-default bg-surface-elevated text-border-default",
                )}
              >
                {seat.id}
              </div>
            ),
          );
        })}
      </div>
    </div>
  );
}
