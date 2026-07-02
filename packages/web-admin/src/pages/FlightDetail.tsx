import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bid, Flight, FlightDetailFilter, FlightDetailSortCol, SortDir } from "@auction/core";
import { F, T } from "@auction/web-shared";
import { CH_ICONS } from "@auction/web-shared";
import { colorToken } from "@auction/web-shared";
import { weighted } from "@auction/core";
import { computeBidDistribution, BC_DIST_COLORS, EXIT_DIST_COLORS } from "@auction/web-shared";
import { BarChart, MetricCard, Pill, SeatMap, SectionLabel } from "@auction/web-shared";
import { useLocale } from "../locale";
import { useTiersById } from "../queries/useTiers";
import { useBidStatesById } from "../queries/useBidStates";
import { useFlightHaulsById } from "../queries/useFlightHauls";
import { useFlightDetail } from "../queries/useFlightDetail";
import { useFlightBids } from "../queries/useFlightBids";
import { useSeatMap } from "../queries/useSeatMap";
import { queryKeys } from "../queries/keys";
import { adminBackend } from "../api/backend";
import { formatFlightArr, formatFlightDep, formatFlightDuration } from "@auction/web-shared";

function BackButton({ onBack }: { onBack: () => void }) {
  const { txt } = useLocale();
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-3 cursor-pointer rounded-[7px] border-[0.5px] border-border-default bg-transparent px-3 py-1.5 text-xs font-semibold text-text-muted"
    >
      {txt.flightDetail.backButton}
    </button>
  );
}

export function FlightDetail({ flightId, onBack }: { flightId: Flight["id"]; onBack: () => void }) {
  const { txt, locale } = useLocale();
  const queryClient = useQueryClient();
  const { data: flight, isLoading, isError } = useFlightDetail(flightId);
  const {
    data: bids = [],
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useFlightBids(flightId, "businessClass");
  const { data: exitBids = [] } = useFlightBids(flightId, "exitRows");
  const { data: seatMap = [] } = useSeatMap(flightId);
  const { byId: tiersById } = useTiersById();
  const { byId: bidStatesById } = useBidStatesById();
  const { byId: haulsById } = useFlightHaulsById();
  const fromAirport = flight?.fromAirport;
  const toAirport = flight?.toAirport;
  const fromTz = fromAirport?.city.timezone ?? "UTC";
  const toTz = toAirport?.city.timezone ?? "UTC";
  const [filter, setFilter] = useState<FlightDetailFilter>("all");
  const [autoRan, setAutoRan] = useState(false);
  const [sortCol, setSortCol] = useState<FlightDetailSortCol>("weighted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const refreshBids = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.flightBids(flightId, "businessClass"),
    });
  const approveMutation = useMutation({
    mutationFn: (bidId: Bid["id"]) => adminBackend.bids.approve(flightId, bidId),
    onSuccess: refreshBids,
  });
  const rejectMutation = useMutation({
    mutationFn: (bidId: Bid["id"]) => adminBackend.bids.reject(flightId, bidId),
    onSuccess: refreshBids,
  });
  const autoSelectMutation = useMutation({
    mutationFn: () => adminBackend.bids.autoSelect(flightId),
    onSuccess: async () => {
      await refreshBids();
      setAutoRan(true);
    },
  });
  const detailFilters: Array<[FlightDetailFilter, string]> = [
    ["all", txt.flightDetail.filters.all],
    ["pending", txt.flightDetail.filters.pending],
    ["approved", txt.flightDetail.filters.approved],
    ["rejected", txt.flightDetail.filters.rejected],
  ];
  const detailHeaderCols: Array<[FlightDetailSortCol | null, string, string]> = [
    ["name", txt.flightDetail.headers.passenger, "22%"],
    ["tier", txt.flightDetail.headers.tier, "11%"],
    ["bid", txt.flightDetail.headers.bid, "10%"],
    ["weighted", txt.flightDetail.headers.weighted, "11%"],
    ["channel", txt.flightDetail.headers.channel, "9%"],
    ["time", txt.flightDetail.headers.time, "9%"],
    [null, txt.flightDetail.headers.status, "11%"],
    [null, txt.flightDetail.headers.action, "17%"],
  ];

  const sorted = [...bids]
    .filter((b) => (filter === "all" ? true : b.state === filter))
    .sort((a, b2) => {
      const va =
        sortCol === "name"
          ? a.passenger.name
          : sortCol === "bid"
            ? a.bid
            : sortCol === "time"
              ? a.time
              : weighted(a);
      const vb =
        sortCol === "name"
          ? b2.passenger.name
          : sortCol === "bid"
            ? b2.bid
            : sortCol === "time"
              ? b2.time
              : weighted(b2);
      return sortDir === "desc" ? (vb > va ? 1 : -1) : va > vb ? 1 : -1;
    });

  const approve = (id: Bid["id"]) => approveMutation.mutate(id);
  const reject = (id: Bid["id"]) => rejectMutation.mutate(id);
  const autoSelect = () => autoSelectMutation.mutate();
  const counts: Record<FlightDetailFilter, number> = {
    all: bids.length,
    pending: bids.filter((b) => b.state === "pending").length,
    approved: bids.filter((b) => b.state === "approved").length,
    rejected: bids.filter((b) => b.state === "rejected").length,
  };

  if (isLoading) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-text-muted">{txt.flightDetail.states.loading}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-status-danger-fg">{txt.flightDetail.states.loadError}</div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-text-muted">{txt.flightDetail.states.notFound}</div>
      </div>
    );
  }

  if (isBidsLoading) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-text-muted">{txt.flightDetail.states.bidsLoading}</div>
      </div>
    );
  }

  if (isBidsError) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-status-danger-fg">
          {txt.flightDetail.states.bidsLoadError}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-[7px] border-[0.5px] border-border-default bg-transparent px-3 py-1.5 text-xs font-semibold text-text-muted"
          style={{
            cursor: "pointer",
          }}
        >
          {txt.flightDetail.backButton}
        </button>
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-extrabold">{flight.id}</span>
          <span className="text-[13px] text-text-secondary">
            {flight.fromAirportId} → {flight.toAirportId}
          </span>
          <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
            {txt.flightDetail.auctionOpen}
          </Pill>
        </div>
        <div className="ml-auto flex gap-2">
          {!autoRan ? (
            <button
              type="button"
              onClick={autoSelect}
              disabled={autoSelectMutation.isPending}
              className="rounded-lg border-none px-4 py-[9px] text-[13px] font-semibold"
              style={{
                background: T.brandPrimary,
                color: T.onBrandPrimarySoft,
                cursor: autoSelectMutation.isPending ? "not-allowed" : "pointer",
                opacity: autoSelectMutation.isPending ? 0.7 : 1,
              }}
            >
              {txt.flightDetail.autoSelect}
            </button>
          ) : (
            <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
              {txt.flightDetail.amadeusUpdated}
            </Pill>
          )}
        </div>
      </div>
      <div className="mb-[18px] text-xs text-text-muted">
        {formatFlightDep(flight.depAt, fromTz, locale)} — {formatFlightArr(flight.arrAt, toTz)} ·{" "}
        {flight.aircraft} · {formatFlightDuration(flight.depAt, flight.arrAt, locale)} ·{" "}
        {haulsById[flight.haul]?.name[locale] ?? flight.haul}
      </div>
      <div className="mb-[18px] grid grid-cols-4 gap-3">
        <MetricCard
          label={txt.flightDetail.metrics.bcSeats.label}
          value={`${flight.bcFree} / ${flight.bcTotal}`}
          accent={flight.bcFree < 4 ? T.statusDangerFg : T.statusSuccessFg}
          sub={txt.flightDetail.metrics.bcSeats.sub}
        />
        <MetricCard
          label={txt.flightDetail.metrics.bcBidsLabel}
          value={String(bids.length)}
          sub={`${counts.pending} ${txt.flightDetail.metrics.pendingSuffix}`}
        />
        <MetricCard
          label={txt.flightDetail.metrics.topBidLabel}
          value={`$${flight.topBid}`}
          accent={T.brandPrimaryFg}
          sub={`${txt.flightDetail.metrics.weightedPrefix}${Math.round(flight.topBid * 1.1)}`}
        />
        <MetricCard
          label={txt.flightDetail.metrics.revenueLabel}
          value={`$${flight.revenue.toLocaleString()}`}
          accent={T.statusSuccessFg}
          sub={`${flight.bcFree} ${txt.flightDetail.metrics.winnersSuffix}`}
        />
      </div>
      <div className="mb-[18px] grid grid-cols-2 gap-4">
        <div className="rounded-xl border-[0.5px] border-border-default bg-surface-card px-[18px] py-4">
          <SectionLabel>{txt.flightDetail.section.seatMap}</SectionLabel>
          <SeatMap seatMap={seatMap} />
          <div className="mt-2.5 text-[11px] text-text-muted">
            {flight.bcFree} свободных · {bids.length} заявок
          </div>
        </div>
        <div className="rounded-xl border-[0.5px] border-border-default bg-surface-card px-[18px] py-4">
          <SectionLabel>{txt.flightDetail.section.bidDistribution}</SectionLabel>
          <div className="mb-2 text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">
            {txt.flightDetail.section.businessClass}
          </div>
          <BarChart
            data={computeBidDistribution(bids, BC_DIST_COLORS).map((row) => ({
              ...row,
              color: colorToken(row.colorId),
            }))}
          />
          <div className="my-3 h-px bg-border-default" />
          <div className="mb-2 text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">
            {txt.flightDetail.section.exitRows}
          </div>
          <BarChart
            data={computeBidDistribution(exitBids, EXIT_DIST_COLORS).map((row) => ({
              ...row,
              color: colorToken(row.colorId),
            }))}
          />
        </div>
      </div>
      <div className="rounded-xl border-[0.5px] border-border-default bg-surface-card px-[18px] py-4">
        <div className="mb-[14px] flex flex-wrap items-center justify-between gap-2">
          <SectionLabel>{txt.flightDetail.section.bidsTable}</SectionLabel>
          <div className="flex flex-wrap gap-[5px]">
            {detailFilters.map(([k, lbl]) => (
              <button
                type="button"
                key={k}
                onClick={() => setFilter(k)}
                className="rounded-[20px] px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  cursor: "pointer",
                  border: `0.5px solid ${filter === k ? T.brandPrimary : T.borderDefault}`,
                  background: filter === k ? T.brandPrimaryBg : "transparent",
                  color: filter === k ? T.brandPrimaryFg : T.textMuted,
                }}
              >
                {lbl} ({counts[k]})
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-xs">
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
                    className="border-b-[0.5px] border-border-default px-2.5 py-[9px] text-left text-[11px] font-semibold tracking-[0.7px] uppercase select-none"
                    style={{
                      width: w,
                      color: col && sortCol === col ? T.brandPrimaryFg : T.textMuted,
                      cursor: col ? "pointer" : "default",
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
                const tm = tiersById[b.passenger.tier];
                const sm = bidStatesById[b.state] ?? bidStatesById.pending;
                return (
                  <tr key={b.id} style={{ background: isTop ? T.overlayBrand : "transparent" }}>
                    <td className="border-b-[0.5px] border-border-default px-2.5 py-2.5">
                      <div className="flex items-center gap-[7px]">
                        {isTop && (
                          <div
                            className="h-7 w-[3px] shrink-0 rounded-[2px]"
                            style={{
                              background: T.brandPrimary,
                            }}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-text-primary">{b.passenger.name}</div>
                          {isTop && (
                            <div className="text-[10px]" style={{ color: T.brandPrimaryFg }}>
                              {txt.flightDetail.topCandidate}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border-b-[0.5px] border-border-default px-2.5 py-2.5">
                      <Pill
                        color={colorToken(tm?.colorId ?? "textMuted")}
                        bg={colorToken(tm?.bgId ?? "neutralBgSoft")}
                        size={10}
                      >
                        {b.passenger.tier}
                      </Pill>
                      <div className="mt-0.5 text-[10px] text-text-muted">
                        {tm?.multLabel[locale] ?? ""}
                      </div>
                    </td>
                    <td
                      className="border-b-[0.5px] border-border-default px-2.5 py-2.5 font-mono font-bold"
                      style={{
                        fontFamily: F.mono,
                      }}
                    >
                      ${b.bid}
                    </td>
                    <td
                      className="border-b-[0.5px] border-border-default px-2.5 py-2.5 font-mono font-bold"
                      style={{
                        color: T.brandPrimaryFg,
                        fontFamily: F.mono,
                      }}
                    >
                      ${w}
                    </td>
                    <td
                      className="border-b-[0.5px] border-border-default px-2.5 py-2.5 text-xs"
                      style={{
                        color: T.textMuted,
                      }}
                    >
                      {CH_ICONS[b.channel]} {b.channel}
                    </td>
                    <td
                      className="border-b-[0.5px] border-border-default px-2.5 py-2.5 font-mono text-xs"
                      style={{
                        color: T.textMuted,
                        fontFamily: F.mono,
                      }}
                    >
                      {b.time}
                    </td>
                    <td className="border-b-[0.5px] border-border-default px-2.5 py-2.5">
                      <Pill
                        color={colorToken(sm?.colorId ?? "textMuted")}
                        bg={colorToken(sm?.bgId ?? "neutralBgSoft")}
                        size={10}
                      >
                        {bidStatesById[b.state]?.name[locale] ?? b.state}
                      </Pill>
                    </td>
                    <td className="border-b-[0.5px] border-border-default px-2.5 py-2.5">
                      {b.state === "pending" && (
                        <div className="flex gap-[5px]">
                          <button
                            type="button"
                            onClick={() => approve(b.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="rounded-[5px] px-[9px] py-1 text-[11px] font-semibold"
                            style={{
                              cursor:
                                approveMutation.isPending || rejectMutation.isPending
                                  ? "not-allowed"
                                  : "pointer",
                              background: T.statusSuccessBg,
                              border: `0.5px solid ${T.statusSuccess}`,
                              color: T.statusSuccessFg,
                              opacity:
                                approveMutation.isPending || rejectMutation.isPending ? 0.7 : 1,
                            }}
                          >
                            {txt.flightDetail.acceptButton}
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(b.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="rounded-[5px] px-2 py-1 text-[11px] font-semibold"
                            style={{
                              cursor:
                                approveMutation.isPending || rejectMutation.isPending
                                  ? "not-allowed"
                                  : "pointer",
                              background: T.statusDangerBg,
                              border: `0.5px solid ${T.statusDanger}`,
                              color: T.statusDangerFg,
                              opacity:
                                approveMutation.isPending || rejectMutation.isPending ? 0.7 : 1,
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
        <div className="mt-2.5 text-[11px] text-text-muted">{txt.flightDetail.footerHint}</div>
      </div>
    </div>
  );
}
