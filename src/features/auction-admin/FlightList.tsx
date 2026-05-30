import { useState } from "react";
import { FLIGHTS_DATA, STATUS_META, colorToken } from "./data";
import { MetricCard, Pill } from "./primitives";
import { F, T } from "./theme";
import type { Flight, FlightListFilter, FlightListSortCol, SortDir } from "./types";

type FlightListProps = {
  onSelect: (flightId: Flight["id"]) => void;
};

export function FlightList({ onSelect }: FlightListProps) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<FlightListFilter>("all");
  const [sortCol, setSortCol] = useState<FlightListSortCol>("dep");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const statusFilters: Array<[FlightListFilter, string]> = [
    ["all", "Все"],
    ["active", "Активные"],
    ["upcoming", "Скоро"],
    ["sold", "Нет мест"],
  ];
  const headerCols: Array<[FlightListSortCol | null, string, string]> = [
    ["dep", "Рейс / маршрут", "24%"],
    [null, "Вылет", "13%"],
    [null, "Борт", "8%"],
    ["bids", "Заявок", "9%"],
    [null, "Мест BC", "9%"],
    ["topBid", "Топ ставка", "10%"],
    ["revenue", "Прогноз", "10%"],
    [null, "Статус", "9%"],
    [null, "", "8%"],
  ];

  const handleSort = (col: FlightListSortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtered = FLIGHTS_DATA.filter((f) => statusF === "all" || f.status === statusF)
    .filter(
      (f) =>
        f.id.toLowerCase().includes(search.toLowerCase()) ||
        f.from.includes(search.toUpperCase()) ||
        f.to.includes(search.toUpperCase()),
    )
    .sort((a, b) => {
      const vals: Record<FlightListSortCol, [string | number, string | number]> = {
        dep: [a.dep, b.dep],
        bids: [a.bids, b.bids],
        revenue: [a.revenue, b.revenue],
        topBid: [a.topBid, b.topBid],
      };
      const [va, vb] = vals[sortCol];
      return sortDir === "asc" ? (va > vb ? 1 : -1) : vb > va ? 1 : -1;
    });

  const totalActive = FLIGHTS_DATA.filter((f) => f.status === "active").length;
  const totalBids = FLIGHTS_DATA.reduce((s, f) => s + f.bids, 0);
  const totalRevenue = FLIGHTS_DATA.reduce((s, f) => s + f.revenue, 0);
  const totalFree = FLIGHTS_DATA.reduce((s, f) => s + f.bcFree, 0);

  return (
    <div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}
      >
        <MetricCard label="Активных аукционов" value={String(totalActive)} sub="сегодня" />
        <MetricCard label="Всего заявок" value={String(totalBids)} sub="по всем рейсам" />
        <MetricCard
          label="Свободных мест BC"
          value={String(totalFree)}
          accent={totalFree < 10 ? T.statusDangerFg : T.statusSuccessFg}
          sub="для апгрейда"
        />
        <MetricCard
          label="Прогноз выручки"
          value={`$${Math.round(totalRevenue / 1000)}K`}
          accent={T.statusSuccessFg}
          sub="все рейсы"
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Поиск: рейс, IATA…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: 8,
            border: `0.5px solid ${T.borderDefault}`,
            background: T.surfaceElevated,
            color: T.textPrimary,
            fontSize: 13,
            outline: "none",
            width: 200,
          }}
        />
        <div style={{ display: "flex", gap: 5 }}>
          {statusFilters.map(([k, l]) => (
            <button
              type="button"
              key={k}
              onClick={() => setStatusF(k)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: `0.5px solid ${statusF === k ? T.brandPrimary : T.borderDefault}`,
                background: statusF === k ? T.brandPrimaryBg : "transparent",
                color: statusF === k ? T.brandPrimaryFg : T.textMuted,
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: T.textMuted }}>
          {filtered.length} рейсов
        </div>
      </div>
      <div
        style={{
          background: T.surfaceCard,
          border: `0.5px solid ${T.borderDefault}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
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
              <tr style={{ borderBottom: `0.5px solid ${T.borderDefault}` }}>
                {headerCols.map(([col, lbl, w]) => (
                  <th
                    key={lbl}
                    onClick={col ? () => handleSort(col) : undefined}
                    style={{
                      width: w,
                      textAlign: "left",
                      padding: "11px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: col && sortCol === col ? T.brandPrimaryFg : T.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      cursor: col ? "pointer" : "default",
                      userSelect: "none",
                      background: T.surfaceElevated,
                    }}
                  >
                    {lbl}
                    {col && sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const sm = STATUS_META[f.status] ?? STATUS_META.upcoming;
                const fc =
                  f.bcFree === 0
                    ? T.statusDanger
                    : f.bcFree < 4
                      ? T.statusWarning
                      : T.statusSuccess;
                return (
                  <tr
                    key={f.id}
                    style={{ borderBottom: `0.5px solid ${T.borderDefault}`, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "11px 14px" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: T.textPrimary,
                          letterSpacing: 0.2,
                        }}
                      >
                        {f.id}
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                        <span style={{ color: T.textSecondary, fontWeight: 600 }}>{f.from}</span>
                        <span style={{ margin: "0 4px" }}>→</span>
                        <span style={{ color: T.textSecondary, fontWeight: 600 }}>{f.to}</span>
                        <span style={{ marginLeft: 6 }}>{f.duration}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        color: T.textSecondary,
                        fontSize: 12,
                        fontFamily: F.mono,
                      }}
                    >
                      {f.dep}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: T.textMuted,
                          background: T.surfaceElevated,
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: `0.5px solid ${T.borderDefault}`,
                        }}
                      >
                        {f.aircraft}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontWeight: 700,
                        fontFamily: F.mono,
                        color: f.bids > 20 ? T.brandPrimaryFg : T.textPrimary,
                      }}
                    >
                      {f.bids}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ fontWeight: 700, fontFamily: F.mono, color: fc }}>
                        {f.bcFree}
                      </span>
                      <span style={{ color: T.textMuted, fontSize: 11 }}> / {f.bcTotal}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontWeight: 700, fontFamily: F.mono }}>
                      ${f.topBid}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontWeight: 700,
                        fontFamily: F.mono,
                        color: T.statusSuccessFg,
                      }}
                    >
                      {f.revenue > 0 ? `$${f.revenue.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <Pill color={colorToken(sm.colorId)} bg={colorToken(sm.bgId)}>
                        {sm.label}
                      </Pill>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <button
                        type="button"
                        onClick={() => onSelect(f.id)}
                        style={{
                          padding: "6px 11px",
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 6,
                          cursor: "pointer",
                          background: T.brandPrimaryBg,
                          border: `0.5px solid ${T.brandPrimary}`,
                          color: T.brandPrimaryFg,
                        }}
                      >
                        Открыть →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
        Кликните «Открыть» для деталей аукциона. Клик по заголовку — сортировка.
      </div>
    </div>
  );
}
