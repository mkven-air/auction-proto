import { useState } from "react";
import { TIER_META, colorToken } from "./data";
import { Pill, Toggle } from "./primitives";
import { T } from "./theme";
import type { ProductActiveMap, ProductBidMap, ProductConfig, ProductKey, Tier } from "./types";

export function PassengerBidUI() {
  const PASSENGER: { name: string; tier: Tier; initials: string } = {
    name: "Азиз Каримов",
    tier: "Platinum",
    initials: "АК",
  };
  const PRODUCTS: Record<ProductKey, ProductConfig> = {
    bc: {
      label: "Бизнес-класс",
      desc: "Раскладное кресло · Лаундж · Питание",
      icon: "🛋",
      min: 262,
      max: 750,
      defaultVal: 350,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
    ex: {
      label: "Ряд у аварийного выхода",
      desc: "+30 см для ног · Ранняя посадка",
      icon: "🦵",
      min: 32,
      max: 85,
      defaultVal: 46,
      color: T.statusSuccess,
      trackColor: T.statusSuccess,
    },
    sb: {
      label: "Seat Blocker",
      desc: "Заблокировать соседнее место",
      icon: "🪑",
      min: 8,
      max: 45,
      defaultVal: 18,
      color: T.brandPrimary,
      trackColor: T.brandPrimary,
    },
  };
  const MULT = 1.1;

  const [bids, setBids] = useState<ProductBidMap>({ bc: 350, ex: 46, sb: 18 });
  const [active, setActive] = useState<ProductActiveMap>({ bc: true, ex: true, sb: false });
  const [submitted, setSubmitted] = useState(false);
  const productEntries = Object.entries(PRODUCTS) as Array<[ProductKey, ProductConfig]>;

  const calcChance = (prod: ProductKey, val: number) => {
    const p = PRODUCTS[prod];
    const pct = (val - p.min) / (p.max - p.min);
    return Math.min(Math.max(Math.round(pct * 72 + 8), 5), 90);
  };
  const chanceColor = (p: number) =>
    p >= 65 ? T.statusSuccess : p >= 40 ? T.statusWarning : T.statusDanger;

  const base = (Object.keys(active) as ProductKey[]).reduce(
    (sum, key) => sum + (active[key] ? bids[key] : 0),
    0,
  );
  const wt = Math.round(base * MULT);

  const sliderBg = (prod: ProductKey) => {
    const p = PRODUCTS[prod];
    const v = bids[prod];
    const pct = Math.round(((v - p.min) / (p.max - p.min)) * 100);
    return `linear-gradient(to right,${p.trackColor} 0%,${p.trackColor} ${pct}%,${T.borderDefault} ${pct}%,${T.borderDefault} 100%)`;
  };

  const tierMeta = TIER_META[PASSENGER.tier];

  if (submitted) {
    const prods = (Object.keys(active) as ProductKey[])
      .filter((key) => active[key])
      .map((key) => PRODUCTS[key].label);
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px" }}>
        <div
          style={{
            width: 390,
            background: T.surfaceCard,
            borderRadius: 16,
            border: `0.5px solid ${T.borderDefault}`,
            overflow: "hidden",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              background: T.surfaceElevated,
              padding: "9px 16px 7px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 11, color: T.textMuted }}>09:41</span>
            <span style={{ fontSize: 11, color: T.textMuted }}>uzbekistanairways.uz</span>
            <span style={{ fontSize: 11, color: T.textMuted }}>●●●</span>
          </div>
          <div style={{ padding: "32px 20px 24px", textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: T.statusSuccessBg,
                border: `1.5px solid ${T.statusSuccess}`,
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>
              Заявка принята!
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 22, lineHeight: 1.7 }}>
              Результат будет известен за 4–8 часов до вылета.
              <br />
              Средства спишутся только при подтверждении.
            </div>
            <div
              style={{
                background: T.surfaceElevated,
                border: `0.5px solid ${T.statusSuccessBg}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 16,
                textAlign: "left",
              }}
            >
              {[
                ["Рейс", "HY 602 · TAS → IST"],
                ["Апгрейды", prods.join(" + ") || "—"],
                ["Статус оплаты", "Не списано ✓"],
                ["Взвешенная ставка", `$${wt}`],
                ["Уведомление", "Email · App"],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: i < arr.length - 1 ? `0.5px solid ${T.borderDefault}` : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: T.textMuted }}>{k}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        k === "Статус оплаты"
                          ? T.statusSuccessFg
                          : k === "Взвешенная ставка"
                            ? T.brandPrimaryFg
                            : T.textPrimary,
                      fontFamily: "monospace",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
              Изменить или отозвать заявку можно в разделе «Управление бронированием» до закрытия
              аукциона.
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                background: "transparent",
                border: `0.5px solid ${T.borderDefault}`,
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                color: T.textMuted,
                cursor: "pointer",
              }}
            >
              ← Изменить заявку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px" }}>
      <div
        style={{
          width: 390,
          background: T.surfaceCard,
          borderRadius: 16,
          border: `0.5px solid ${T.borderDefault}`,
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            background: T.surfaceElevated,
            padding: "9px 16px 7px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: T.textMuted }}>09:41</span>
          <span style={{ fontSize: 11, color: T.textMuted }}>uzbekistanairways.uz</span>
          <span style={{ fontSize: 11, color: T.textMuted }}>●●●</span>
        </div>

        {/* Flight header */}
        <div
          style={{
            background: T.surfaceElevated,
            padding: "12px 16px 14px",
            borderBottom: `0.5px solid ${T.borderDefault}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div
              style={{
                background: T.brandPrimary,
                borderRadius: 4,
                width: 28,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  color: T.onBrandPrimarySoft,
                  letterSpacing: 0.5,
                }}
              >
                HY
              </span>
            </div>
            <span
              style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.3 }}
            >
              HY 602
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: T.textMuted,
                fontFamily: "monospace",
              }}
            >
              15 июн · 08:45
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary }}>TAS</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Ташкент</div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
              <span style={{ fontSize: 14, color: T.textMuted }}>✈</span>
              <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary }}>IST</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Стамбул</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 7 }}>
            Airbus A321 · 5ч 35м · Эконом → Бизнес
          </div>
        </div>

        <div style={{ padding: "14px 16px", maxHeight: 540, overflowY: "auto" }}>
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
              {PASSENGER.initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
                {PASSENGER.name}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Программа лояльности</div>
            </div>
            <Pill color={colorToken(tierMeta.colorId)} bg={colorToken(tierMeta.bgId)} size={10}>
              {PASSENGER.tier}
            </Pill>
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: T.textMuted,
              marginBottom: 10,
            }}
          >
            Выберите апгрейды
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
                      <span style={{ fontSize: 11, color: T.textMuted }}>Шанс принятия</span>
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
          <div style={{ height: "0.5px", background: T.borderDefault, margin: "12px 0" }} />

          {/* Summary */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: T.textMuted,
              marginBottom: 10,
            }}
          >
            Итого
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
                Взвешенная сумма
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
              <span style={{ fontSize: 10, color: T.textMuted }}>× бонус Platinum +10%</span>
              <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "monospace" }}>
                базовая ${base}
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
              Средства <strong style={{ color: T.onBrandPrimarySoft }}>не списываются</strong>{" "}
              сразу. Оплата — только при подтверждении апгрейда авиакомпанией.
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={base === 0}
            onClick={() => setSubmitted(true)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 10,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: base === 0 ? "not-allowed" : "pointer",
              background: base === 0 ? T.borderDefault : T.brandPrimary,
              color: base === 0 ? T.textMuted : T.onBrandPrimarySoft,
              letterSpacing: 0.2,
              marginBottom: 8,
            }}
          >
            {base === 0 ? "Выберите хотя бы один апгрейд" : `Подать заявку · $${base}`}
          </button>
          <div style={{ fontSize: 10, color: T.textMuted, textAlign: "center", paddingBottom: 4 }}>
            Аукцион закрывается через <strong style={{ color: T.statusWarning }}>3ч 20м</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
