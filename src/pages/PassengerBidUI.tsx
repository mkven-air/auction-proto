import { useState } from "react";
import { useTiersById } from "../queries/useTiers";
import { colorToken } from "../domain/color";
import { DEFAULT_RULES } from "../domain/rules";
import { Pill, Toggle } from "../primitives";
import { T } from "../theme";
import { CURRENT_LOCALE, TXT } from "../i18n";
import {
  PASSENGER_DEFAULT_ACTIVE,
  PASSENGER_DEFAULT_BIDS,
  PASSENGER_FLIGHT_ID,
  PASSENGER_FRAME,
  PASSENGER_MULTIPLIER,
  PASSENGER_PRODUCT_SPECS,
} from "./passengerConfig";
import { useCurrentPassenger } from "../queries/useCurrentPassenger";
import { useFlightDetail } from "../queries/useFlightDetail";
import { formatFlightDep, formatFlightDuration } from "../format/flightTime";
import type { ProductActiveMap, ProductBidMap, ProductConfig, ProductKey } from "../types";

export function PassengerBidUI() {
  const { data: passenger } = useCurrentPassenger();
  const { data: flight } = useFlightDetail(PASSENGER_FLIGHT_ID);
  const { byId: tiersById } = useTiersById();
  const fromAirport = flight?.fromAirport;
  const toAirport = flight?.toAirport;
  const fromCityName = fromAirport?.city.name[CURRENT_LOCALE] ?? "";
  const toCityName = toAirport?.city.name[CURRENT_LOCALE] ?? "";
  const departureLabel = flight
    ? formatFlightDep(flight.depAt, fromAirport?.city.timezone ?? "UTC")
    : "";
  const flightDuration = flight ? formatFlightDuration(flight.depAt, flight.arrAt) : "";
  const aircraftLine = flight
    ? `${flight.aircraft} · ${flightDuration} · ${TXT.passenger.flightHeader.classTransition}`
    : "";
  const routeLabel = flight ? `${flight.id} · ${flight.fromAirportId} → ${flight.toAirportId}` : "";
  const PRODUCTS: Record<ProductKey, ProductConfig> = {
    bc: {
      label: TXT.passenger.products.bc.label,
      desc: TXT.passenger.products.bc.desc,
      icon: PASSENGER_PRODUCT_SPECS.bc.icon,
      min: PASSENGER_PRODUCT_SPECS.bc.min,
      max: PASSENGER_PRODUCT_SPECS.bc.max,
      defaultVal: PASSENGER_PRODUCT_SPECS.bc.defaultVal,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
    ex: {
      label: TXT.passenger.products.ex.label,
      desc: TXT.passenger.products.ex.desc,
      icon: PASSENGER_PRODUCT_SPECS.ex.icon,
      min: PASSENGER_PRODUCT_SPECS.ex.min,
      max: PASSENGER_PRODUCT_SPECS.ex.max,
      defaultVal: PASSENGER_PRODUCT_SPECS.ex.defaultVal,
      color: T.statusSuccess,
      trackColor: T.statusSuccess,
    },
    sb: {
      label: TXT.passenger.products.sb.label,
      desc: TXT.passenger.products.sb.desc,
      icon: PASSENGER_PRODUCT_SPECS.sb.icon,
      min: PASSENGER_PRODUCT_SPECS.sb.min,
      max: PASSENGER_PRODUCT_SPECS.sb.max,
      defaultVal: PASSENGER_PRODUCT_SPECS.sb.defaultVal,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
  };

  const [bids, setBids] = useState<ProductBidMap>(PASSENGER_DEFAULT_BIDS);
  const [active, setActive] = useState<ProductActiveMap>(PASSENGER_DEFAULT_ACTIVE);
  const [submitted, setSubmitted] = useState(false);
  const productEntries = (Object.entries(PRODUCTS) as Array<[ProductKey, ProductConfig]>).filter(
    ([key]) => !DEFAULT_RULES.onlyUpgrade || key === "bc",
  );

  const calcChance = (prod: ProductKey, val: number) => {
    const p = PRODUCTS[prod];
    const pct = (val - p.min) / (p.max - p.min);
    return Math.min(Math.max(Math.round(pct * 72 + 8), 5), 90);
  };
  const chanceColor = (p: number) =>
    p >= 65 ? T.statusSuccess : p >= 40 ? T.statusWarning : T.statusDanger;

  const base = productEntries.reduce((sum, [key]) => sum + (active[key] ? bids[key] : 0), 0);
  const wt = Math.round(base * PASSENGER_MULTIPLIER);

  const sliderBg = (prod: ProductKey) => {
    const p = PRODUCTS[prod];
    const v = bids[prod];
    const pct = Math.round(((v - p.min) / (p.max - p.min)) * 100);
    return `linear-gradient(to right,${p.trackColor} 0%,${p.trackColor} ${pct}%,${T.borderDefault} ${pct}%,${T.borderDefault} 100%)`;
  };

  const tierMeta = passenger ? tiersById[passenger.tier] : undefined;

  if (submitted) {
    const prods = productEntries.filter(([key]) => active[key]).map(([, prod]) => prod.label);
    return (
      <div className="flex justify-center px-4 py-6">
        <div className="w-[390px] overflow-hidden rounded-2xl border-[0.5px] border-border-default bg-surface-card">
          {/* Status bar */}
          <div className="flex justify-between bg-surface-elevated px-4 pb-[7px] pt-[9px]">
            <span className="text-[11px] text-text-muted">{PASSENGER_FRAME.statusBarTime}</span>
            <span className="text-[11px] text-text-muted">{PASSENGER_FRAME.statusBarHost}</span>
            <span className="text-[11px] text-text-muted">●●●</span>
          </div>
          <div className="px-5 pb-6 pt-8 text-center">
            <div
              className="mx-auto mb-4 flex size-[60px] items-center justify-center rounded-full text-2xl"
              style={{
                background: T.statusSuccessBg,
                border: `1.5px solid ${T.statusSuccess}`,
              }}
            >
              ✓
            </div>
            <div className="mb-1 text-lg font-bold text-text-primary">
              {TXT.passenger.submitted.title}
            </div>
            <div className="mb-[22px] text-xs leading-[1.7] text-text-muted">
              {TXT.passenger.submitted.desc1}
              <br />
              {TXT.passenger.submitted.desc2}
            </div>
            <div
              className="mb-4 rounded-[10px] px-[14px] py-3 text-left"
              style={{
                background: T.surfaceElevated,
                border: `0.5px solid ${T.statusSuccessBg}`,
              }}
            >
              {[
                [TXT.passenger.submitted.rows.flight, routeLabel],
                [TXT.passenger.submitted.rows.upgrades, prods.join(" + ") || "—"],
                [TXT.passenger.submitted.rows.paymentStatus, TXT.passenger.submitted.paymentValue],
                [TXT.passenger.submitted.rows.weightedBid, `$${wt}`],
                [
                  TXT.passenger.submitted.rows.notification,
                  TXT.passenger.submitted.notificationValue,
                ],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  className="flex justify-between py-1.5"
                  style={{
                    borderBottom: i < arr.length - 1 ? `0.5px solid ${T.borderDefault}` : "none",
                  }}
                >
                  <span className="text-xs text-text-muted">{k}</span>
                  <span
                    className="font-mono text-[13px] font-semibold"
                    style={{
                      color:
                        k === TXT.passenger.submitted.rows.paymentStatus
                          ? T.statusSuccessFg
                          : k === TXT.passenger.submitted.rows.weightedBid
                            ? T.brandPrimaryFg
                            : T.textPrimary,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-4 text-[11px] leading-[1.6] text-text-muted">
              {TXT.passenger.submitted.editHint}
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="rounded-lg border-[0.5px] border-border-default bg-transparent px-[18px] py-[9px] text-[13px] text-text-muted"
              style={{
                cursor: "pointer",
              }}
            >
              {TXT.passenger.submitted.editButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-[390px] overflow-hidden rounded-2xl border-[0.5px] border-border-default bg-surface-card">
        {/* Status bar */}
        <div className="flex justify-between bg-surface-elevated px-4 pb-[7px] pt-[9px]">
          <span className="text-[11px] text-text-muted">{PASSENGER_FRAME.statusBarTime}</span>
          <span className="text-[11px] text-text-muted">{PASSENGER_FRAME.statusBarHost}</span>
          <span className="text-[11px] text-text-muted">●●●</span>
        </div>

        {/* Flight header */}
        <div className="border-b-[0.5px] border-border-default bg-surface-elevated px-4 pb-[14px] pt-3">
          <div className="mb-2.5 flex items-center gap-[9px]">
            <div
              className="flex h-[18px] w-7 items-center justify-center rounded-[4px]"
              style={{
                background: T.brandPrimary,
              }}
            >
              <span
                className="text-[8px] font-extrabold tracking-[0.5px]"
                style={{
                  color: T.onBrandPrimarySoft,
                }}
              >
                HY
              </span>
            </div>
            <span className="text-base font-bold tracking-[-0.3px] text-text-primary">
              {flight?.id ?? ""}
            </span>
            <span
              className="ml-auto font-mono text-xs text-text-muted"
              style={{
                color: T.textMuted,
              }}
            >
              {departureLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-xl font-bold text-text-primary">{fromAirport?.id ?? ""}</div>
              <div className="text-[10px] text-text-muted">{fromCityName}</div>
            </div>
            <div className="flex flex-1 items-center gap-1">
              <div className="h-px flex-1 bg-border-default" />
              <span className="text-sm text-text-muted">✈</span>
              <div className="h-px flex-1 bg-border-default" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-text-primary">{toAirport?.id ?? ""}</div>
              <div className="text-[10px] text-text-muted">{toCityName}</div>
            </div>
          </div>
          <div className="mt-[7px] text-[11px] text-text-muted">{aircraftLine}</div>
        </div>

        <div className="max-h-[540px] overflow-y-auto px-4 py-[14px]">
          {/* Passenger row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 14,
              background: T.surfaceElevated,
              border: `0.5px solid ${T.borderDefault}`,
              borderRadius: 8,
              padding: "9px 12px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: T.statusWarningBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: T.statusWarningFg,
                flexShrink: 0,
              }}
            >
              {passenger?.initials ?? ""}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
                {passenger?.name ?? ""}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted }}>{TXT.passenger.loyaltyProgram}</div>
            </div>
            {passenger && tierMeta && (
              <Pill color={colorToken(tierMeta.colorId)} bg={colorToken(tierMeta.bgId)} size={10}>
                {passenger.tier}
              </Pill>
            )}
          </div>

          <div className="mb-2.5 text-[10px] font-bold tracking-[1.5px] text-text-muted uppercase">
            {TXT.passenger.chooseUpgrades}
          </div>

          {/* Product cards */}
          {productEntries.map(([key, prod]) => {
            const on = active[key];
            const val = bids[key];
            const chance = on ? calcChance(key, val) : 0;
            const cc = chanceColor(chance);
            return (
              <div
                key={key}
                style={{
                  background: T.surfaceElevated,
                  border: `0.5px solid ${on ? T.brandPrimary : T.borderDefault}`,
                  borderRadius: 10,
                  padding: "12px 13px",
                  marginBottom: 9,
                  opacity: on ? 1 : 0.55,
                  transition: "opacity .2s, border-color .2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 9,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: on ? T.brandPrimaryBg : T.borderDefault,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {prod.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
                        {prod.label}
                      </div>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>
                        {prod.desc}
                      </div>
                    </div>
                  </div>
                  <Toggle checked={on} onChange={(v) => setActive((a) => ({ ...a, [key]: v }))} />
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: on ? T.textPrimary : T.textMuted,
                    fontFamily: "monospace",
                    marginBottom: 7,
                  }}
                >
                  ${val}{" "}
                  <span style={{ fontSize: 12, fontWeight: 400, color: T.textMuted }}>USD</span>
                </div>

                <input
                  type="range"
                  min={prod.min}
                  max={prod.max}
                  value={val}
                  step={1}
                  disabled={!on}
                  onChange={(e) => setBids((b) => ({ ...b, [key]: Number(e.target.value) }))}
                  style={{
                    width: "100%",
                    height: 4,
                    WebkitAppearance: "none",
                    appearance: "none",
                    borderRadius: 2,
                    outline: "none",
                    cursor: on ? "pointer" : "not-allowed",
                    display: "block",
                    marginBottom: 5,
                    background: on ? sliderBg(key) : T.borderDefault,
                    opacity: on ? 1 : 0.5,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: T.textMuted,
                    marginBottom: on && key !== "sb" ? 8 : 0,
                  }}
                >
                  <span>от ${prod.min}</span>
                  <span>до ${prod.max}</span>
                </div>

                {on && key !== "sb" && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 11, color: T.textMuted }}>
                        {TXT.passenger.chanceLabel}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: cc,
                          fontFamily: "monospace",
                        }}
                      >
                        {chance}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: T.borderDefault,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${chance}%`,
                          height: "100%",
                          background: cc,
                          borderRadius: 2,
                          transition: "width .3s, background .3s",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Divider */}
          <div className="my-3 h-[0.5px] bg-border-default" />

          {/* Summary */}
          <div className="mb-2.5 text-[10px] font-bold tracking-[1.5px] text-text-muted uppercase">
            {TXT.passenger.totalTitle}
          </div>
          <div
            style={{
              background: T.surfaceElevated,
              border: `0.5px solid ${T.borderDefault}`,
              borderRadius: 10,
              padding: "11px 13px",
              marginBottom: 11,
            }}
          >
            {productEntries.map(
              ([key, prod]) =>
                active[key] && (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: `0.5px solid ${T.borderDefault}`,
                    }}
                  >
                    <span style={{ fontSize: 12, color: T.textMuted }}>{prod.label}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.textPrimary,
                        fontFamily: "monospace",
                      }}
                    >
                      ${bids[key]}
                    </span>
                  </div>
                ),
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0 3px" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
                {TXT.passenger.weightedTotal}
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.brandPrimaryFg,
                  fontFamily: "monospace",
                }}
              >
                ${wt}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: T.textMuted }}>
                {TXT.passenger.platinumBonus}
              </span>
              <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "monospace" }}>
                {TXT.passenger.basePrefix}
                {base}
              </span>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              background: T.brandPrimaryBg,
              border: `0.5px solid ${T.brandPrimary}`,
              borderRadius: 8,
              padding: "9px 12px",
              marginBottom: 11,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ color: T.brandPrimaryFg, fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>
              ℹ
            </span>
            <div style={{ fontSize: 11, color: T.brandPrimaryFg, lineHeight: 1.6 }}>
              {TXT.passenger.infoTextStart}{" "}
              <strong style={{ color: T.onBrandPrimarySoft }}>
                {TXT.passenger.infoTextStrong}
              </strong>{" "}
              {TXT.passenger.infoTextEnd}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={base === 0}
            onClick={() => setSubmitted(true)}
            className="mb-2 w-full rounded-[10px] border-none p-[13px] text-sm font-bold tracking-[0.2px]"
            style={{
              cursor: base === 0 ? "not-allowed" : "pointer",
              background: base === 0 ? T.borderDefault : T.brandPrimary,
              color: base === 0 ? T.textMuted : T.onBrandPrimarySoft,
            }}
          >
            {base === 0 ? TXT.passenger.submitEmpty : `${TXT.passenger.submitPrefix}${base}`}
          </button>
          <div className="pb-1 text-center text-[10px] text-text-muted">
            {TXT.passenger.auctionClosesIn}{" "}
            <strong style={{ color: T.statusWarning }}>{PASSENGER_FRAME.closingIn}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
