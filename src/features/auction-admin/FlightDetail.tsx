import { useState } from "react";
import type { Bid, Flight, FlightDetailFilter, FlightDetailSortCol, SortDir } from "./types";
import { F, T } from "./theme";
import {
  CH_ICONS,
  DIST_DATA,
  EXIT_DATA,
  FALLBACK_FLIGHT,
  FLIGHTS_DATA,
  HAUL_LABELS,
  INITIAL_BIDS,
  STATE_META,
  TIER_META,
  weighted,
} from "./data";
import { BarChart, MetricCard, Pill, SeatMap, SectionLabel } from "./primitives";

export function FlightDetail({ flightId, onBack }: { flightId: Flight["id"]; onBack: () => void }) {
  const flight = FLIGHTS_DATA.find((f) => f.id === flightId) ?? FLIGHTS_DATA[0] ?? FALLBACK_FLIGHT;
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [filter, setFilter] = useState<FlightDetailFilter>("all");
  const [autoRan, setAutoRan] = useState(false);
  const [sortCol, setSortCol] = useState<FlightDetailSortCol>("weighted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const detailFilters: Array<[FlightDetailFilter, string]> = [
    ["all", "Все"],
    ["pending", "Ожидают"],
    ["approved", "Принятые"],
    ["rejected", "Отклонённые"],
  ];
  const detailHeaderCols: Array<[FlightDetailSortCol | null, string, string]> = [
    ["name", "Пассажир", "22%"],
    ["tier", "Статус", "11%"],
    ["bid", "Ставка", "10%"],
    ["weighted", "Взвешенная", "11%"],
    ["channel", "Канал", "9%"],
    ["time", "Время", "9%"],
    [null, "Статус", "11%"],
    [null, "Действие", "17%"],
  ];

  const sorted = [...bids]
    .filter((b) => (filter === "all" ? true : b.state === filter))
    .sort((a, b2) => {
      const va =
        sortCol === "name"
          ? a.name
          : sortCol === "bid"
            ? a.bid
            : sortCol === "time"
              ? a.time
              : weighted(a);
      const vb =
        sortCol === "name"
          ? b2.name
          : sortCol === "bid"
            ? b2.bid
            : sortCol === "time"
              ? b2.time
              : weighted(b2);
      return sortDir === "desc" ? (vb > va ? 1 : -1) : va > vb ? 1 : -1;
    });

  const approve = (id: Bid["id"]) =>
    setBids((bs) => bs.map((b) => (b.id === id ? { ...b, state: "approved" } : b)));
  const reject = (id: Bid["id"]) =>
    setBids((bs) => bs.map((b) => (b.id === id ? { ...b, state: "rejected" } : b)));
  const autoSelect = () => {
    const top = [...bids]
      .filter((b) => b.state === "pending")
      .sort((a, b) => weighted(b) - weighted(a))
      .slice(0, flight.bcFree)
      .map((b) => b.id);
    setBids((bs) => bs.map((b) => (top.includes(b.id) ? { ...b, state: "approved" } : b)));
    setAutoRan(true);
  };
  const counts: Record<FlightDetailFilter, number> = {
    all: bids.length,
    pending: bids.filter((b) => b.state === "pending").length,
    approved: bids.filter((b) => b.state === "approved").length,
    rejected: bids.filter((b) => b.state === "rejected").length,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "6px 12px",
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: "transparent",
            border: `0.5px solid ${T.border}`,
            color: T.textMuted,
          }}
        >
          ← Все рейсы
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{flight.id}</span>
          <span style={{ fontSize: 13, color: T.textSub }}>
            {flight.from} → {flight.to}
          </span>
          <Pill color={T.greenText} bg={T.greenDim}>
            Аукцион открыт
          </Pill>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!autoRan ? (
            <button
              type="button"
              onClick={autoSelect}
              style={{
                background: T.accent,
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: T.onAccentSoft,
                cursor: "pointer",
              }}
            >
              ⚡ Авто-отбор
            </button>
          ) : (
            <Pill color={T.greenText} bg={T.greenDim}>
              ✓ Amadeus RES обновлён
            </Pill>
          )}
        </div>
      </div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 18 }}>
        {flight.dep} — {flight.arr} · {flight.aircraft} · {flight.duration} ·{" "}
        {HAUL_LABELS[flight.haul]}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}
      >
        <MetricCard
          label="Мест в BC"
          value={`${flight.bcFree} / ${flight.bcTotal}`}
          accent={flight.bcFree < 4 ? T.redText : T.greenText}
          sub="свободно"
        />
        <MetricCard
          label="Заявок на BC"
          value={String(bids.length)}
          sub={`${counts.pending} ожидают`}
        />
        <MetricCard
          label="Топ ставка"
          value={`$${flight.topBid}`}
          accent={T.accentText}
          sub={`взвеш. $${Math.round(flight.topBid * 1.1)}`}
        />
        <MetricCard
          label="Прогноз выручки"
          value={`$${flight.revenue.toLocaleString()}`}
          accent={T.greenText}
          sub={`${flight.bcFree} победителя`}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>Карта мест — бизнес-класс</SectionLabel>
          <SeatMap />
          <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
            {flight.bcFree} свободных · {bids.length} заявок
          </div>
        </div>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>Распределение ставок</SectionLabel>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Бизнес-класс
          </div>
          <BarChart data={DIST_DATA} />
          <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Ряды у выхода
          </div>
          <BarChart data={EXIT_DATA} />
        </div>
      </div>
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <SectionLabel>Заявки на бизнес-класс</SectionLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {detailFilters.map(([k, lbl]) => (
              <button
                type="button"
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `0.5px solid ${filter === k ? T.accent : T.border}`,
                  background: filter === k ? T.accentDim : "transparent",
                  color: filter === k ? T.accentText : T.textMuted,
                }}
              >
                {lbl} ({counts[k]})
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                {detailHeaderCols.map(([col, lbl, w]) => (
                  <th
                    key={lbl}
                    onClick={
                      col
                        ? () => {
                            if (sortCol === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                            else {
                              setSortCol(col);
                              setSortDir("desc");
                            }
                          }
                        : undefined
                    }
                    style={{
                      width: w,
                      textAlign: "left",
                      padding: "9px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: col && sortCol === col ? T.accentText : T.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      borderBottom: `0.5px solid ${T.border}`,
                      cursor: col ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    {lbl}
                    {col && sortCol === col ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((b, i) => {
                const w = weighted(b);
                const isTop = b.state === "pending" && i < flight.bcFree && filter === "all";
                const tm = TIER_META[b.tier];
                const sm = STATE_META[b.state] ?? STATE_META.pending;
                return (
                  <tr key={b.id} style={{ background: isTop ? T.overlayAccent : "transparent" }}>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {isTop && (
                          <div
                            style={{
                              width: 3,
                              height: 28,
                              background: T.accent,
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: T.text }}>{b.name}</div>
                          {isTop && (
                            <div style={{ fontSize: 10, color: T.accentText }}>→ кандидат</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <Pill color={tm.color} bg={tm.bg} size={10}>
                        {tm.label}
                      </Pill>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                        {tm.mult}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        fontWeight: 700,
                        fontFamily: F.mono,
                      }}
                    >
                      ${b.bid}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        fontWeight: 700,
                        color: T.accentText,
                        fontFamily: F.mono,
                      }}
                    >
                      ${w}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        color: T.textMuted,
                        fontSize: 12,
                      }}
                    >
                      {CH_ICONS[b.channel]} {b.channel}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        color: T.textMuted,
                        fontFamily: F.mono,
                        fontSize: 12,
                      }}
                    >
                      {b.time}
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <Pill color={sm.color} bg={sm.bg} size={10}>
                        {sm.label}
                      </Pill>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      {b.state === "pending" && (
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            type="button"
                            onClick={() => approve(b.id)}
                            style={{
                              padding: "4px 9px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
                              cursor: "pointer",
                              background: T.greenDim,
                              border: `0.5px solid ${T.green}`,
                              color: T.greenText,
                            }}
                          >
                            ✓ Принять
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(b.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
                              cursor: "pointer",
                              background: T.redDim,
                              border: `0.5px solid ${T.red}`,
                              color: T.redText,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
          Взвешенная = базовая × множитель статуса. Кликните заголовок для сортировки.
        </div>
      </div>
    </div>
  );
}
