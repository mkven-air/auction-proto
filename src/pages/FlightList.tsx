import { useSearchParams } from "react-router-dom";
import { colorToken } from "../domain/color";
import { useFlightsQuery } from "../queries/useFlightsQuery";
import { useAirportsWithLocationByIds } from "../queries/useAirportsWithLocationByIds";
import { MetricCard, Pill } from "../primitives";
import { T } from "../theme";
import { CURRENT_LOCALE, TXT } from "../i18n";
import { useFlightStatusesById } from "../queries/useFlightStatuses";
import { formatFlightDep, formatFlightDuration } from "../format/flightTime";
import type { Flight, FlightListFilter, FlightListSortCol, SortDir } from "../types";

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
    rawSortCol === "depAt" ||
    rawSortCol === "bids" ||
    rawSortCol === "revenue" ||
    rawSortCol === "topBid"
      ? rawSortCol
      : "depAt";
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
  const { byId: flightStatusesById } = useFlightStatusesById();
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const flightAirportIds = Array.from(
    new Set(flights.flatMap((f) => [f.fromAirportId, f.toAirportId])),
  );
  const { data: flightAirports = [] } = useAirportsWithLocationByIds(flightAirportIds);
  const airportTzById = new Map(flightAirports.map((a) => [a.id, a.city.timezone]));

  const statusFilters: Array<[FlightListFilter, string]> = [
    ["all", TXT.flightList.statusFilters.all],
    ["active", TXT.flightList.statusFilters.active],
    ["upcoming", TXT.flightList.statusFilters.upcoming],
    ["sold", TXT.flightList.statusFilters.sold],
  ];
  const headerCols: Array<[FlightListSortCol | null, string, string]> = [
    ["depAt", TXT.flightList.headers.depRoute, "24%"],
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
    return <div className="text-[13px] text-text-muted">{TXT.flightList.states.loading}</div>;
  }

  if (isError) {
    return (
      <div className="text-[13px] text-status-danger-fg">{TXT.flightList.states.loadError}</div>
    );
  }

  return (
    <div>
      <div className="mb-5 grid grid-cols-4 gap-3">
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
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
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
          className="w-[200px] rounded-lg border-[0.5px] border-border-default bg-surface-elevated px-3 py-[7px] text-[13px] text-text-primary outline-none"
        />
        <div className="flex gap-[5px]">
          {statusFilters.map(([k, l]) => {
            const isActive = statusF === k;
            const sm = k === "all" ? undefined : flightStatusesById[k];
            const accent = sm ? colorToken(sm.colorId) : T.brandPrimary;
            const accentBg = sm ? colorToken(sm.bgId) : T.brandPrimaryBg;
            return (
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
                className="rounded-[20px] px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap"
                style={{
                  cursor: "pointer",
                  border: `0.5px solid ${isActive ? accent : T.borderDefault}`,
                  background: isActive ? accentBg : "transparent",
                  color: isActive ? accent : T.textMuted,
                }}
              >
                {l}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-xs text-text-muted">
          {total} {TXT.flightList.flightsSuffix}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border-[0.5px] border-border-default bg-surface-card">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead>
              <tr className="border-b-[0.5px] border-border-default">
                {headerCols.map(([col, lbl, w]) => (
                  <th
                    key={lbl}
                    onClick={col ? () => handleSort(col) : undefined}
                    className="bg-surface-elevated px-[14px] py-[11px] text-left text-[11px] font-semibold tracking-[0.7px] uppercase select-none"
                    style={{
                      width: w,
                      color: col && sortCol === col ? T.brandPrimaryFg : T.textMuted,
                      cursor: col ? "pointer" : "default",
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
                const sm = flightStatusesById[f.status] ?? flightStatusesById.upcoming;
                const fc =
                  f.bcFree === 0
                    ? T.statusDanger
                    : f.bcFree < 4
                      ? T.statusWarning
                      : T.statusSuccess;
                return (
                  <tr
                    key={f.id}
                    className="cursor-pointer border-b-[0.5px] border-border-default"
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-[14px] py-[11px]">
                      <div className="text-[14px] font-bold tracking-[0.2px] text-text-primary">
                        {f.id}
                      </div>
                      <div className="mt-0.5 text-xs text-text-muted">
                        <span className="font-semibold text-text-secondary">{f.fromAirportId}</span>
                        <span className="mx-1">→</span>
                        <span className="font-semibold text-text-secondary">{f.toAirportId}</span>
                        <span className="ml-1.5">{formatFlightDuration(f.depAt, f.arrAt)}</span>
                      </div>
                    </td>
                    <td className="px-[14px] py-[11px] font-mono text-xs text-text-secondary">
                      {formatFlightDep(f.depAt, airportTzById.get(f.fromAirportId) ?? "UTC")}
                    </td>
                    <td className="px-[14px] py-[11px]">
                      <span className="rounded-[4px] border-[0.5px] border-border-default bg-surface-elevated px-1.5 py-0.5 text-[11px] text-text-muted">
                        {f.aircraft}
                      </span>
                    </td>
                    <td
                      className="px-[14px] py-[11px] font-mono font-bold"
                      style={{
                        color: f.bids > 20 ? T.brandPrimaryFg : T.textPrimary,
                      }}
                    >
                      {f.bids}
                    </td>
                    <td className="px-[14px] py-[11px]">
                      <span className="font-mono font-bold" style={{ color: fc }}>
                        {f.bcFree}
                      </span>
                      <span className="text-[11px] text-text-muted"> / {f.bcTotal}</span>
                    </td>
                    <td className="px-[14px] py-[11px] font-mono font-bold">${f.topBid}</td>
                    <td
                      className="px-[14px] py-[11px] font-mono font-bold"
                      style={{
                        color: T.statusSuccessFg,
                      }}
                    >
                      {f.revenue > 0 ? `$${f.revenue.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-[14px] py-[11px]">
                      <Pill
                        color={colorToken(sm?.colorId ?? "textMuted")}
                        bg={colorToken(sm?.bgId ?? "neutralBgSoft")}
                      >
                        {flightStatusesById[f.status]?.name[CURRENT_LOCALE] ?? f.status}
                      </Pill>
                    </td>
                    <td className="px-[14px] py-[11px] pr-8">
                      <button
                        type="button"
                        onClick={() => onSelect(f.id)}
                        className="rounded-md border-[0.5px] px-[11px] py-1.5 text-[11px] font-semibold whitespace-nowrap"
                        style={{
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
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="text-[11px] text-text-muted">
          {TXT.flightList.pagination.pageOf
            .replace("{page}", String(page))
            .replace("{totalPages}", String(totalPages))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(Math.max(1, page - 1)));
              setSearchParams(next, { replace: true });
            }}
            className="rounded-md border-[0.5px] border-border-default bg-transparent px-2.5 py-[5px] text-text-primary"
            style={{
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
            className="rounded-md border-[0.5px] border-border-default bg-transparent px-2.5 py-[5px] text-text-primary"
            style={{
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              opacity: page >= totalPages ? 0.6 : 1,
            }}
          >
            {TXT.flightList.pagination.next}
          </button>
        </div>
      </div>
      <div className="mt-2.5 text-[11px] text-text-muted">{TXT.flightList.footerHint}</div>
    </div>
  );
}
