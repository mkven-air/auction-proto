import { useSearchParams } from "react-router-dom";
import { STATUS_META, colorToken } from "./data";
import { useFlightsQuery } from "./queries/useFlightsQuery";
import { MetricCard, Pill } from "./primitives";
import { F, T } from "./theme";
import { TXT } from "./i18n";
import type { Flight, FlightListFilter, FlightListSortCol, SortDir } from "./types";

type FlightListProps = {
  onSelect: (flightId: Flight["id"]) => void;
};

export function FlightList({ onSelect }: FlightListProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const rawStatus = searchParams.get("status");
  const rawSortCol = searchParams.get("sort");
  const rawSortDir = searchParams.get("dir");
  const rawPage = searchParams.get("page");

  const statusF: FlightListFilter =
    rawStatus === "all" ||
    rawStatus === "active" ||
    rawStatus === "upcoming" ||
    rawStatus === "sold"
      ? rawStatus
      : "all";
  const sortCol: FlightListSortCol =
    rawSortCol === "dep" ||
    rawSortCol === "bids" ||
    rawSortCol === "revenue" ||
    rawSortCol === "topBid"
      ? rawSortCol
      : "dep";
  const sortDir: SortDir = rawSortDir === "desc" ? "desc" : "asc";
  const page = Math.max(1, Number(rawPage ?? "1") || 1);
  const pageSize = 6;
  const filters =
    statusF === "all"
      ? []
      : [
          {
            field: "status" as const,
            op: "eq" as const,
            value: statusF,
          },
        ];

  const { data, isLoading, isError } = useFlightsQuery({
    search,
    filters,
    sortBy: sortCol,
    sortDir,
    page,
    pageSize,
  });

  const flights = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const statusFilters: Array<[FlightListFilter, string]> = [
    ["all", TXT.flightList.statusFilters.all],
    ["active", TXT.flightList.statusFilters.active],
    ["upcoming", TXT.flightList.statusFilters.upcoming],
    ["sold", TXT.flightList.statusFilters.sold],
  ];
  const headerCols: Array<[FlightListSortCol | null, string, string]> = [
    ["dep", TXT.flightList.headers.depRoute, "24%"],
    [null, TXT.flightList.headers.dep, "13%"],
    [null, TXT.flightList.headers.aircraft, "8%"],
    ["bids", TXT.flightList.headers.bids, "9%"],
    [null, TXT.flightList.headers.seatsBc, "9%"],
    ["topBid", TXT.flightList.headers.topBid, "10%"],
    ["revenue", TXT.flightList.headers.forecast, "10%"],
    [null, TXT.flightList.headers.status, "9%"],
    [null, "", "8%"],
  ];

  const handleSort = (col: FlightListSortCol) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    if (sortCol === col) {
      next.set("dir", sortDir === "asc" ? "desc" : "asc");
    } else {
      next.set("sort", col);
      next.set("dir", "asc");
    }
    setSearchParams(next, { replace: true });
  };

  const totalActive = data?.summary.active ?? 0;
  const totalBids = data?.summary.bids ?? 0;
  const totalRevenue = data?.summary.revenue ?? 0;
  const totalFree = data?.summary.freeSeats ?? 0;

  if (isLoading) {
    return <div style={{ fontSize: 13, color: T.textMuted }}>{TXT.flightList.states.loading}</div>;
  }

  if (isError) {
    return (
      <div style={{ fontSize: 13, color: T.statusDangerFg }}>{TXT.flightList.states.loadError}</div>
    );
  }

  return (
    <div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}
      >
        <MetricCard
          label={TXT.flightList.metrics.activeAuctions.label}
          value={String(totalActive)}
          sub={TXT.flightList.metrics.activeAuctions.sub}
        />
        <MetricCard
          label={TXT.flightList.metrics.totalBids.label}
          value={String(totalBids)}
          sub={TXT.flightList.metrics.totalBids.sub}
        />
        <MetricCard
          label={TXT.flightList.metrics.freeBcSeats.label}
          value={String(totalFree)}
          accent={totalFree < 10 ? T.statusDangerFg : T.statusSuccessFg}
          sub={TXT.flightList.metrics.freeBcSeats.sub}
        />
        <MetricCard
          label={TXT.flightList.metrics.revenueForecast.label}
          value={`$${Math.round(totalRevenue / 1000)}K`}
          accent={T.statusSuccessFg}
          sub={TXT.flightList.metrics.revenueForecast.sub}
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
          placeholder={TXT.flightList.searchPlaceholder}
          value={search}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value) next.set("q", e.target.value);
            else next.delete("q");
            next.set("page", "1");
            setSearchParams(next, { replace: true });
          }}
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
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                if (k === "all") next.delete("status");
                else next.set("status", k);
                next.set("page", "1");
                setSearchParams(next, { replace: true });
              }}
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
          {total} {TXT.flightList.flightsSuffix}
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
              {flights.map((f) => {
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
                        {TXT.flightList.openButton}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 11, color: T.textMuted }}>
          {TXT.flightList.pagination.pageOf
            .replace("{page}", String(page))
            .replace("{totalPages}", String(totalPages))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(Math.max(1, page - 1)));
              setSearchParams(next, { replace: true });
            }}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: `0.5px solid ${T.borderDefault}`,
              background: "transparent",
              color: T.textPrimary,
              cursor: page <= 1 ? "not-allowed" : "pointer",
              opacity: page <= 1 ? 0.6 : 1,
            }}
          >
            {TXT.flightList.pagination.prev}
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(Math.min(totalPages, page + 1)));
              setSearchParams(next, { replace: true });
            }}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: `0.5px solid ${T.borderDefault}`,
              background: "transparent",
              color: T.textPrimary,
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              opacity: page >= totalPages ? 0.6 : 1,
            }}
          >
            {TXT.flightList.pagination.next}
          </button>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
        {TXT.flightList.footerHint}
      </div>
    </div>
  );
}
