import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bid, Flight, FlightDetailFilter, FlightDetailSortCol, SortDir } from "./types";
import { F, T } from "./theme";
import {
  CH_ICONS,
  DIST_DATA,
  EXIT_DATA,
  HAUL_LABELS,
  STATE_META,
  TIER_META,
  colorToken,
  weighted,
} from "./data";
import { BarChart, MetricCard, Pill, SeatMap, SectionLabel } from "./primitives";
import { TXT } from "./i18n";
import { useFlightById } from "./queries/useFlightById";
import { useFlightBids } from "./queries/useFlightBids";
import { queryKeys } from "./queries/keys";
import { backendClient } from "./backend/client";

export function FlightDetail({ flightId, onBack }: { flightId: Flight["id"]; onBack: () => void }) {
  const queryClient = useQueryClient();
  const { data: flight, isLoading, isError } = useFlightById(flightId);
  const {
    data: bids = [],
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useFlightBids(flightId);
  const [filter, setFilter] = useState<FlightDetailFilter>("all");
  const [autoRan, setAutoRan] = useState(false);
  const [sortCol, setSortCol] = useState<FlightDetailSortCol>("weighted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const refreshBids = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.flightBids(flightId) });
  const approveMutation = useMutation({
    mutationFn: (bidId: Bid["id"]) => backendClient.bids.approveBid(flightId, bidId),
    onSuccess: refreshBids,
  });
  const rejectMutation = useMutation({
    mutationFn: (bidId: Bid["id"]) => backendClient.bids.rejectBid(flightId, bidId),
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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ fontSize: 13, color: T.textMuted }}>{TXT.flightDetail.states.loading}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ fontSize: 13, color: T.statusDangerFg }}>
          {TXT.flightDetail.states.loadError}
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div>
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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ fontSize: 13, color: T.textMuted }}>{TXT.flightDetail.states.notFound}</div>
      </div>
    );
  }

  if (isBidsLoading) {
    return (
      <div>
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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ fontSize: 13, color: T.textMuted }}>
          {TXT.flightDetail.states.bidsLoading}
        </div>
      </div>
    );
  }

  if (isBidsError) {
    return (
      <div>
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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ fontSize: 13, color: T.statusDangerFg }}>
          {TXT.flightDetail.states.bidsLoadError}
        </div>
      </div>
    );
  }

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
            border: `0.5px solid ${T.borderDefault}`,
            color: T.textMuted,
          }}
        >
          {TXT.flightDetail.backButton}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{flight.id}</span>
          <span style={{ fontSize: 13, color: T.textSecondary }}>
            {flight.fromAirportId} → {flight.toAirportId}
          </span>
          <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
            {TXT.flightDetail.auctionOpen}
          </Pill>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!autoRan ? (
            <button
              type="button"
              onClick={autoSelect}
              disabled={autoSelectMutation.isPending}
              style={{
                background: T.brandPrimary,
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 600,
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
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 18 }}>
        {flight.dep} — {flight.arr} · {flight.aircraft} · {flight.duration} ·{" "}
        {HAUL_LABELS[flight.haul]}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}
      >
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <div
          style={{
            background: T.surfaceCard,
            border: `0.5px solid ${T.borderDefault}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>{TXT.flightDetail.section.seatMap}</SectionLabel>
          <SeatMap />
          <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
            {flight.bcFree} свободных · {bids.length} заявок
          </div>
        </div>
        <div
          style={{
            background: T.surfaceCard,
            border: `0.5px solid ${T.borderDefault}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>{TXT.flightDetail.section.bidDistribution}</SectionLabel>
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
            {TXT.flightDetail.section.businessClass}
          </div>
          <BarChart data={DIST_DATA.map((row) => ({ ...row, color: colorToken(row.colorId) }))} />
          <div style={{ height: 1, background: T.borderDefault, margin: "12px 0" }} />
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
            {TXT.flightDetail.section.exitRows}
          </div>
          <BarChart data={EXIT_DATA.map((row) => ({ ...row, color: colorToken(row.colorId) }))} />
        </div>
      </div>
      <div
        style={{
          background: T.surfaceCard,
          border: `0.5px solid ${T.borderDefault}`,
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
          <SectionLabel>{TXT.flightDetail.section.bidsTable}</SectionLabel>
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
                const tm = TIER_META[b.tier];
                const sm = STATE_META[b.state] ?? STATE_META.pending;
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
                          <div style={{ fontWeight: 600, color: T.textPrimary }}>{b.name}</div>
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
                      <Pill color={colorToken(tm.colorId)} bg={colorToken(tm.bgId)} size={10}>
                        {tm.label}
                      </Pill>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                        {tm.mult}
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
                      <Pill color={colorToken(sm.colorId)} bg={colorToken(sm.bgId)} size={10}>
                        {sm.label}
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
        <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
          {TXT.flightDetail.footerHint}
        </div>
      </div>
    </div>
  );
}
