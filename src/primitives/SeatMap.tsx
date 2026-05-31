import { SEAT_MAP_BC } from "../domain/seatMap";
import { T } from "../theme";
import { TXT } from "../i18n";
import type { SeatCell } from "../types";

export function SeatMap() {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        {[
          { c: T.seatTakenBg, l: TXT.seatMap.taken },
          { c: T.brandPrimary, l: TXT.seatMap.bid },
          { c: T.surfaceElevated, l: TXT.seatMap.free, b: T.borderDefault },
        ].map((s) => (
          <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: s.c,
                border: `0.5px solid ${s.b || s.c}`,
              }}
            />
            <span style={{ fontSize: 11, color: T.textMuted }}>{s.l}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 28px)", gap: 4 }}>
        {SEAT_MAP_BC.flatMap((row) => {
          const rowKey = row
            .filter((seat): seat is SeatCell => seat !== null)
            .map((seat) => seat.id)
            .join("-");
          return row.map((seat) =>
            seat === null ? (
              <div key={`${rowKey}-aisle`} style={{ width: 4 }} />
            ) : (
              <div
                key={seat.id}
                style={{
                  width: 28,
                  height: 22,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 600,
                  background: seat.bid
                    ? T.brandPrimary
                    : seat.taken
                      ? T.seatTakenBg
                      : T.surfaceElevated,
                  color: seat.bid ? T.onBrandPrimary : seat.taken ? T.seatTakenFg : T.borderDefault,
                  border: `0.5px solid ${seat.bid ? T.brandPrimary : seat.taken ? T.seatTakenBorder : T.borderDefault}`,
                }}
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
