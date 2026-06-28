import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bid, Flight, FlightDetailFilter, FlightDetailSortCol, SortDir } from "../types";
import { F, T } from "../theme";
import { CH_ICONS } from "../domain/channel";
import { colorToken } from "../domain/color";
import { weighted } from "../domain/weighted";
import {
  computeBidDistribution,
  BC_DIST_COLORS,
  EXIT_DIST_COLORS,
} from "../format/bidDistribution";
import { BarChart, MetricCard, Pill, SeatMap, SectionLabel } from "../primitives";
import { CURRENT_LOCALE, TXT } from "../i18n";
import { useTiersById } from "../queries/useTiers";
import { useBidStatesById } from "../queries/useBidStates";
import { useFlightHaulsById } from "../queries/useFlightHauls";
import { useFlightDetail } from "../queries/useFlightDetail";
import { useFlightBids } from "../queries/useFlightBids";
import { queryKeys } from "../queries/keys";
import { backendClient } from "../backend/client";
import { formatFlightArr, formatFlightDep, formatFlightDuration } from "../format/flightTime";

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-3 rounded-[7px] border-[0.5px] border-border-default bg-transparent px-3 py-1.5 text-xs font-semibold text-text-muted"
      style={{ cursor: "pointer" }}
    >
      {TXT.flightDetail.backButton}
    </button>
  );
}

export function FlightDetail({ flightId, onBack }: { flightId: Flight["id"]; onBack: () => void }) {
  const queryClient = useQueryClient();
  const { data: flight, isLoading, isError } = useFlightDetail(flightId);
  const {
    data: bids = [],
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useFlightBids(flightId, "businessClass");
  const { data: exitBids = [] } = useFlightBids(flightId, "exitRows");
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
    mutationFn: (bidId: Bid["id"]) => backendClient.bids.approve(flightId, bidId),
    onSuccess: refreshBids,
  });
  const rejectMutation = useMutation({
    mutationFn: (bidId: Bid["id"]) => backendClient.bids.reject(flightId, bidId),
    onSuccess: refreshBids,
  });
  const autoSelectMutation = useMutation({
    mutationFn: () => backendClient.bids.autoSelect(flightId),
    onSuccess: async () => {
      await refreshBids();
      setAutoRan(true);
    },
  });
  const detailFilters: Array<[FlightDetailFilter, string]> = [
    ["all", TXT.flightDetail.filters.all],
    ["pending", TXT.flightDetail.filters.pending],
    ["approved", TXT.flightDetail.filters.approved],
    ["rejected", TXT.flightDetail.filters.rejected],
  ];
  const detailHeaderCols: Array<[FlightDetailSortCol | null, string, string]> = [
    ["name", TXT.flightDetail.headers.passenger, "22%"],
    ["tier", TXT.flightDetail.headers.tier, "11%"],
    ["bid", TXT.flightDetail.headers.bid, "10%"],
    ["weighted", TXT.flightDetail.headers.weighted, "11%"],
    ["channel", TXT.flightDetail.headers.channel, "9%"],
    ["time", TXT.flightDetail.headers.time, "9%"],
    [null, TXT.flightDetail.headers.status, "11%"],
    [null, TXT.flightDetail.headers.action, "17%"],
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
        <div className="text-[13px] text-text-muted">{TXT.flightDetail.states.loading}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-status-danger-fg">{TXT.flightDetail.states.loadError}</div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-text-muted">{TXT.flightDetail.states.notFound}</div>
      </div>
    );
  }

  if (isBidsLoading) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-text-muted">{TXT.flightDetail.states.bidsLoading}</div>
      </div>
    );
  }

  if (isBidsError) {
    return (
      <div>
        <BackButton onBack={onBack} />
        <div className="text-[13px] text-status-danger-fg">
          {TXT.flightDetail.states.bidsLoadError}
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
          className="rounded-[7px] border-[0.5px] border-border-default bg-transparent px-3 py-1.5 text-xs font-semibold text-text-muted"
          style={{
            cursor: "pointer",
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-extrabold">{flight.id}</span>
          <span className="text-[13px] text-text-secondary">
            {flight.fromAirportId} → {flight.toAirportId}
          </span>
          <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
            {TXT.flightDetail.auctionOpen}
          </Pill>
        </div>
        <div className="ml-auto flex gap-2">
          {!autoRan ? (
            <button
              type="button"
              onClick={autoSelect}
              disabled={autoSelectMutation.isPending}
              className="rounded-lg px-4 py-[9px] text-[13px] font-semibold"
              style={{
                background: T.brandPrimary,
                border: "none",
                color: T.onBrandPrimarySoft,
                cursor: autoSelectMutation.isPending ? "not-allowed" : "pointer",
                opacity: autoSelectMutation.isPending ? 0.7 : 1,
              }}
            >
              {TXT.flightDetail.autoSelect}
            </button>
          ) : (
            <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
              {TXT.flightDetail.amadeusUpdated}
            </Pill>
          )}
        </div>
      </div>
      <div className="mb-[18px] text-xs text-text-muted">
        {formatFlightDep(flight.depAt, fromTz)} — {formatFlightArr(flight.arrAt, toTz)} ·{" "}
        {flight.aircraft} · {formatFlightDuration(flight.depAt, flight.arrAt)} ·{" "}
        {haulsById[flight.haul]?.name[CURRENT_LOCALE] ?? flight.haul}
      </div>
      <div className="mb-[18px] grid grid-cols-4 gap-3">
        <MetricCard
          label={TXT.flightDetail.metrics.bcSeats.label}
          value={`${flight.bcFree} / ${flight.bcTotal}`}
          accent={flight.bcFree < 4 ? T.statusDangerFg : T.statusSuccessFg}
          sub={TXT.flightDetail.metrics.bcSeats.sub}
        />
        <MetricCard
          label={TXT.flightDetail.metrics.bcBidsLabel}
          value={String(bids.length)}
          sub={`${counts.pending} ${TXT.flightDetail.metrics.pendingSuffix}`}
        />
        <MetricCard
          label={TXT.flightDetail.metrics.topBidLabel}
          value={`$${flight.topBid}`}
          accent={T.brandPrimaryFg}
          sub={`${TXT.flightDetail.metrics.weightedPrefix}${Math.round(flight.topBid * 1.1)}`}
        />
        <MetricCard
          label={TXT.flightDetail.metrics.revenueLabel}
          value={`$${flight.revenue.toLocaleString()}`}
          accent={T.statusSuccessFg}
          sub={`${flight.bcFree} ${TXT.flightDetail.metrics.winnersSuffix}`}
        />
      </div>
      <div className="mb-[18px] grid grid-cols-2 gap-4">
        <div className="rounded-xl border-[0.5px] border-border-default bg-surface-card px-[18px] py-4">
          <SectionLabel>{TXT.flightDetail.section.seatMap}</SectionLabel>
          <SeatMap />
          <div className="mt-2.5 text-[11px] text-text-muted">
            {flight.bcFree} свободных · {bids.length} заявок
          </div>
        </div>
        <div className="rounded-xl border-[0.5px] border-border-default bg-surface-card px-[18px] py-4">
          <SectionLabel>{TXT.flightDetail.section.bidDistribution}</SectionLabel>
          <div className="mb-2 text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">
            {TXT.flightDetail.section.businessClass}
          </div>
          <BarChart
            data={computeBidDistribution(bids, BC_DIST_COLORS).map((row) => ({
              ...row,
              color: colorToken(row.colorId),
            }))}
          />
          <div className="my-3 h-px bg-border-default" />
          <div className="mb-2 text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">
            {TXT.flightDetail.section.exitRows}
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
          <SectionLabel>{TXT.flightDetail.section.bidsTable}</SectionLabel>
          <div className="flex flex-wrap gap-[5px]">
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
                    style={{
                      width: w,
                      textAlign: "left",
                      padding: "9px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: col && sortCol === col ? T.brandPrimaryFg : T.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      borderBottom: `0.5px solid ${T.borderDefault}`,
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
                const tm = tiersById[b.passenger.tier];
                const sm = bidStatesById[b.state] ?? bidStatesById.pending;
                return (
                  <tr key={b.id} style={{ background: isTop ? T.overlayBrand : "transparent" }}>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {isTop && (
                          <div
                            style={{
                              width: 3,
                              height: 28,
                              background: T.brandPrimary,
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: T.textPrimary }}>
                            {b.passenger.name}
                          </div>
                          {isTop && (
                            <div style={{ fontSize: 10, color: T.brandPrimaryFg }}>
                              {TXT.flightDetail.topCandidate}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                      }}
                    >
                      <Pill
                        color={colorToken(tm?.colorId ?? "textMuted")}
                        bg={colorToken(tm?.bgId ?? "neutralBgSoft")}
                        size={10}
                      >
                        {b.passenger.tier}
                      </Pill>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                        {tm?.multLabel[CURRENT_LOCALE] ?? ""}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                        fontWeight: 700,
                        fontFamily: F.mono,
                      }}
                    >
                      ${b.bid}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                        fontWeight: 700,
                        color: T.brandPrimaryFg,
                        fontFamily: F.mono,
                      }}
                    >
                      ${w}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                        color: T.textMuted,
                        fontSize: 12,
                      }}
                    >
                      {CH_ICONS[b.channel]} {b.channel}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                        color: T.textMuted,
                        fontFamily: F.mono,
                        fontSize: 12,
                      }}
                    >
                      {b.time}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                      }}
                    >
                      <Pill
                        color={colorToken(sm?.colorId ?? "textMuted")}
                        bg={colorToken(sm?.bgId ?? "neutralBgSoft")}
                        size={10}
                      >
                        {bidStatesById[b.state]?.name[CURRENT_LOCALE] ?? b.state}
                      </Pill>
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                      }}
                    >
                      {b.state === "pending" && (
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            type="button"
                            onClick={() => approve(b.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            style={{
                              padding: "4px 9px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
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
                            {TXT.flightDetail.acceptButton}
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(b.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            style={{
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
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
        <div className="mt-2.5 text-[11px] text-text-muted">{TXT.flightDetail.footerHint}</div>
      </div>
    </div>
  );
}
