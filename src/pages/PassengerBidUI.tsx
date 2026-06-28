import { useEffect, useState } from "react";
import { useTiersById } from "../queries/useTiers";
import { colorToken } from "../domain/color";
import { Pill, Toggle } from "../primitives";
import { T } from "../theme";
import { useLocale } from "../locale";
import { cn } from "../lib/utils";
import { usePassengerConfig } from "../queries/usePassengerConfig";
import { useCurrentPassenger } from "../queries/useCurrentPassenger";
import { useFlightDetail } from "../queries/useFlightDetail";
import { formatFlightDep, formatFlightDuration } from "../format/flightTime";
import type { ProductActiveMap, ProductBidMap, ProductConfig, ProductKey } from "../types";

export function PassengerBidUI() {
  const { txt, locale, setLocale } = useLocale();
  const { data: passenger } = useCurrentPassenger();
  const { data: config, isLoading: configLoading } = usePassengerConfig();
  const { data: flight } = useFlightDetail(config?.flightId);
  const { byId: tiersById } = useTiersById();

  // Initialize state before conditionals, then hydrate from backend config.
  const [bids, setBids] = useState<ProductBidMap | null>(null);
  const [active, setActive] = useState<ProductActiveMap | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Sync state when config loads
  useEffect(() => {
    if (config) {
      setBids(config.defaultBids);
      setActive(config.defaultActive);
      setSubmitted(false);
    }
  }, [config]);

  if (configLoading || !config || !bids || !active) {
    return (
      <div className="flex justify-center px-4 py-6">
        <div className="text-[13px] text-text-muted">{txt.admin.states.loading}</div>
      </div>
    );
  }

  const fromAirport = flight?.fromAirport;
  const toAirport = flight?.toAirport;
  const fromCityName = fromAirport?.city.name[locale] ?? "";
  const toCityName = toAirport?.city.name[locale] ?? "";
  const departureLabel = flight
    ? formatFlightDep(flight.depAt, fromAirport?.city.timezone ?? "UTC")
    : "";
  const flightDuration = flight ? formatFlightDuration(flight.depAt, flight.arrAt) : "";
  const aircraftLine = flight
    ? `${flight.aircraft} · ${flightDuration} · ${txt.passenger.flightHeader.classTransition}`
    : "";
  const routeLabel = flight ? `${flight.id} · ${flight.fromAirportId} → ${flight.toAirportId}` : "";

  const PRODUCTS: Record<ProductKey, ProductConfig> = {
    bc: {
      label: txt.passenger.products.bc.label,
      desc: txt.passenger.products.bc.desc,
      icon: config.productSpecs.bc.icon,
      min: config.productSpecs.bc.min,
      max: config.productSpecs.bc.max,
      defaultVal: config.productSpecs.bc.defaultVal,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
    ex: {
      label: txt.passenger.products.ex.label,
      desc: txt.passenger.products.ex.desc,
      icon: config.productSpecs.ex.icon,
      min: config.productSpecs.ex.min,
      max: config.productSpecs.ex.max,
      defaultVal: config.productSpecs.ex.defaultVal,
      color: T.statusSuccess,
      trackColor: T.statusSuccess,
    },
    sb: {
      label: txt.passenger.products.sb.label,
      desc: txt.passenger.products.sb.desc,
      icon: config.productSpecs.sb.icon,
      min: config.productSpecs.sb.min,
      max: config.productSpecs.sb.max,
      defaultVal: config.productSpecs.sb.defaultVal,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
  };

  const productEntries = (Object.entries(PRODUCTS) as Array<[ProductKey, ProductConfig]>).map(
    ([key]) => [key, PRODUCTS[key]] as const,
  );

  const calcChance = (prod: ProductKey, val: number) => {
    const p = PRODUCTS[prod];
    const pct = (val - p.min) / (p.max - p.min);
    return Math.min(Math.max(Math.round(pct * 72 + 8), 5), 90);
  };
  const chanceColor = (p: number) =>
    p >= 65 ? T.statusSuccess : p >= 40 ? T.statusWarning : T.statusDanger;

  const base = productEntries.reduce((sum, [key]) => sum + (active[key] ? bids[key] : 0), 0);
  const wt = Math.round(base * config.multiplier);

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
            <span className="text-[11px] text-text-muted">{config.frame.statusBarTime}</span>
            <span className="text-[11px] text-text-muted">{config.frame.statusBarHost}</span>
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
              {txt.passenger.submitted.title}
            </div>
            <div className="mb-[22px] text-xs leading-[1.7] text-text-muted">
              {txt.passenger.submitted.desc1}
              <br />
              {txt.passenger.submitted.desc2}
            </div>
            <div
              className="mb-4 rounded-[10px] px-[14px] py-3 text-left"
              style={{
                background: T.surfaceElevated,
                border: `0.5px solid ${T.statusSuccessBg}`,
              }}
            >
              {[
                [txt.passenger.submitted.rows.flight, routeLabel],
                [txt.passenger.submitted.rows.upgrades, prods.join(" + ") || "—"],
                [txt.passenger.submitted.rows.paymentStatus, txt.passenger.submitted.paymentValue],
                [txt.passenger.submitted.rows.weightedBid, `$${wt}`],
                [
                  txt.passenger.submitted.rows.notification,
                  txt.passenger.submitted.notificationValue,
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
                        k === txt.passenger.submitted.rows.paymentStatus
                          ? T.statusSuccessFg
                          : k === txt.passenger.submitted.rows.weightedBid
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
              {txt.passenger.submitted.editHint}
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="cursor-pointer rounded-lg border-[0.5px] border-border-default bg-transparent px-[18px] py-[9px] text-[13px] text-text-muted"
            >
              {txt.passenger.submitted.editButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6">
      <div className="flex gap-[3px] rounded-lg border-[0.5px] border-border-default bg-surface-elevated px-1 py-[3px]">
        {(["en", "ru", "uz"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "rounded-[5px] px-[7px] py-[3px] text-[11px] font-bold cursor-pointer border-none",
              locale === code
                ? "bg-brand-primary text-on-brand-primary-soft"
                : "bg-transparent text-text-muted",
            )}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="w-[390px] overflow-hidden rounded-2xl border-[0.5px] border-border-default bg-surface-card">
        {/* Status bar */}
        <div className="flex justify-between bg-surface-elevated px-4 pb-[7px] pt-[9px]">
          <span className="text-[11px] text-text-muted">{config.frame.statusBarTime}</span>
          <span className="text-[11px] text-text-muted">{config.frame.statusBarHost}</span>
          <span className="text-[11px] text-text-muted">●●●</span>
        </div>

        {/* Flight header */}
        <div className="border-b-[0.5px] border-border-default bg-surface-elevated px-4 pb-[14px] pt-3">
          <div className="mb-2.5 flex items-center gap-[9px]">
            <div
              className="flex h-[18px] w-7 items-center justify-center rounded-[4px]"
              style={{ background: T.brandPrimary }}
            >
              <span
                className="text-[8px] font-extrabold tracking-[0.5px]"
                style={{ color: T.onBrandPrimarySoft }}
              >
                HY
              </span>
            </div>
            <span className="text-base font-bold tracking-[-0.3px] text-text-primary">
              {flight?.id ?? ""}
            </span>
            <span className="ml-auto font-mono text-xs text-text-muted">{departureLabel}</span>
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
          <div className="mb-[14px] flex items-center gap-[9px] rounded-lg border-[0.5px] border-border-default bg-surface-elevated px-3 py-[9px]">
            <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-status-warning-bg text-[11px] font-bold text-status-warning-fg">
              {passenger?.initials ?? ""}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-text-primary">
                {passenger?.name ?? ""}
              </div>
              <div className="text-[10px] text-text-muted">{txt.passenger.loyaltyProgram}</div>
            </div>
            {passenger && tierMeta && (
              <Pill color={colorToken(tierMeta.colorId)} bg={colorToken(tierMeta.bgId)} size={10}>
                {passenger.tier}
              </Pill>
            )}
          </div>

          <div className="mb-2.5 text-[10px] font-bold tracking-[1.5px] text-text-muted uppercase">
            {txt.passenger.chooseUpgrades}
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
                className="mb-[9px] rounded-[10px] px-[13px] py-3"
                style={{
                  background: T.surfaceElevated,
                  border: `0.5px solid ${on ? T.brandPrimary : T.borderDefault}`,
                  opacity: on ? 1 : 0.55,
                  transition: "opacity .2s, border-color .2s",
                }}
              >
                <div className="mb-[9px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-[13px]"
                      style={{
                        background: on ? T.brandPrimaryBg : T.borderDefault,
                      }}
                    >
                      {prod.icon}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-text-primary">
                        {prod.label}
                      </div>
                      <div className="mt-px text-[10px] text-text-muted">{prod.desc}</div>
                    </div>
                  </div>
                  <Toggle
                    checked={on}
                    onChange={(v) => setActive((a) => (a ? { ...a, [key]: v } : a))}
                  />
                </div>

                <div
                  className="mb-[7px] font-mono text-xl font-bold"
                  style={{
                    color: on ? T.textPrimary : T.textMuted,
                  }}
                >
                  ${val} <span className="text-xs font-normal text-text-muted">USD</span>
                </div>

                <input
                  type="range"
                  min={prod.min}
                  max={prod.max}
                  value={val}
                  step={1}
                  disabled={!on}
                  onChange={(e) =>
                    setBids((b) => (b ? { ...b, [key]: Number(e.target.value) } : b))
                  }
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
                  className="flex justify-between text-[10px] text-text-muted"
                  style={{
                    marginBottom: on && key !== "sb" ? 8 : 0,
                  }}
                >
                  <span>от ${prod.min}</span>
                  <span>до ${prod.max}</span>
                </div>

                {on && key !== "sb" && (
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">
                        {txt.passenger.chanceLabel}
                      </span>
                      <span
                        className="font-mono text-[13px] font-bold"
                        style={{
                          color: cc,
                        }}
                      >
                        {chance}%
                      </span>
                    </div>
                    <div
                      className="h-1 overflow-hidden rounded-[2px]"
                      style={{
                        background: T.borderDefault,
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
            {txt.passenger.totalTitle}
          </div>
          <div className="mb-[11px] rounded-[10px] border-[0.5px] border-border-default bg-surface-elevated px-[13px] py-[11px]">
            {productEntries.map(
              ([key, prod]) =>
                active[key] && (
                  <div
                    key={key}
                    className="flex justify-between py-[5px]"
                    style={{
                      borderBottom: `0.5px solid ${T.borderDefault}`,
                    }}
                  >
                    <span className="text-xs text-text-muted">{prod.label}</span>
                    <span className="font-mono text-[13px] font-semibold text-text-primary">
                      ${bids[key]}
                    </span>
                  </div>
                ),
            )}
            <div className="flex justify-between pb-[3px] pt-[7px]">
              <span className="text-[13px] font-semibold text-text-primary">
                {txt.passenger.weightedTotal}
              </span>
              <span
                className="font-mono text-base font-bold"
                style={{
                  color: T.brandPrimaryFg,
                }}
              >
                ${wt}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">{txt.passenger.platinumBonus}</span>
              <span className="font-mono text-[11px] text-text-muted">
                {txt.passenger.basePrefix}
                {base}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="mb-[11px] flex gap-2 rounded-lg border-[0.5px] border-brand-primary bg-brand-primary-bg px-3 py-[9px]">
            <span className="shrink-0 text-[13px] leading-[1.5] text-brand-primary-fg">ℹ</span>
            <div className="text-[11px] leading-[1.6] text-brand-primary-fg">
              {txt.passenger.infoTextStart}{" "}
              <strong className="text-on-brand-primary-soft">{txt.passenger.infoTextStrong}</strong>{" "}
              {txt.passenger.infoTextEnd}
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
            {base === 0 ? txt.passenger.submitEmpty : `${txt.passenger.submitPrefix}${base}`}
          </button>
          <div className="pb-1 text-center text-[10px] text-text-muted">
            {txt.passenger.auctionClosesIn}{" "}
            <strong className="text-status-warning">{config.frame.closingIn}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
