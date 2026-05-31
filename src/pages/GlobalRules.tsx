import { useState } from "react";
import type { ReactNode } from "react";
import type {
  ChannelRuleKey,
  PaymentMethodKey,
  PricingHaulKey,
  PricingRow,
  Rules,
  RulesBooleanKey,
  RulesNumberKey,
  RuleSectionId,
  Tier,
  TimingRow,
} from "../types";
import { T } from "../theme";
import { TIER_META } from "../domain/tier";
import { DEFAULT_RULES } from "../domain/rules";
import { colorToken } from "../domain/color";
import { TXT } from "../i18n";
import { NumInput, Pill, SectionLabel, Toggle } from "../primitives";

type RuleSection = { id: RuleSectionId; l: string };
type LabelDescRow<K extends string> = { key: K; label: string; desc: string };
type HaulColumn = { k: PricingHaulKey; lbl: string };
type LoyaltyRow = { key: RulesNumberKey; tier: Tier; color: string; bg: string };
type FeatureStatusKey =
  | "seatBlocker"
  | "payWithPoints"
  | "crossAirlineUpgrades"
  | "continuousPricing"
  | "autoFulfillment"
  | "blindBids";

const RULE_SECTIONS: RuleSection[] = [
  { id: "timing", l: TXT.globalRules.sections.timing },
  { id: "pricing", l: TXT.globalRules.sections.pricing },
  { id: "loyalty", l: TXT.globalRules.sections.loyalty },
  { id: "channels", l: TXT.globalRules.sections.channels },
  { id: "payment", l: TXT.globalRules.sections.payment },
  { id: "features", l: TXT.globalRules.sections.features },
];

const HAUL_COLS: HaulColumn[] = [
  { k: "UltraShort", lbl: TXT.globalRules.haulCols.ultraShort },
  { k: "Short", lbl: TXT.globalRules.haulCols.short },
  { k: "Medium", lbl: TXT.globalRules.haulCols.medium },
  { k: "Long", lbl: TXT.globalRules.haulCols.long },
  { k: "UltraLong", lbl: TXT.globalRules.haulCols.ultraLong },
];

const PRICING_ROWS: PricingRow[] = [
  {
    product: TXT.globalRules.pricingProducts.business,
    keys: {
      UltraShort: "minBcUltraShort",
      Short: "minBcShort",
      Medium: "minBcMedium",
      Long: "minBcLong",
      UltraLong: "minBcUltraLong",
    },
  },
  {
    product: TXT.globalRules.pricingProducts.exitRows,
    keys: {
      UltraShort: "minExitShort",
      Short: "minExitShort",
      Medium: "minExitMedium",
      Long: "minExitLong",
      UltraLong: "minExitLong",
    },
  },
  {
    product: TXT.globalRules.pricingProducts.seatBlock,
    keys: {
      UltraShort: "minSeatBlockShort",
      Short: "minSeatBlockShort",
      Medium: "minSeatBlockMedium",
      Long: "minSeatBlockLong",
      UltraLong: "minSeatBlockLong",
    },
  },
];

const TIMING_ROWS: TimingRow[] = [
  {
    key: "inviteDaysBefore",
    label: TXT.globalRules.timingRows.invite.label,
    desc: TXT.globalRules.timingRows.invite.desc,
    min: 1,
    max: 60,
    unit: TXT.globalRules.timingRows.invite.unit,
  },
  {
    key: "chaserHoursBefore",
    label: TXT.globalRules.timingRows.chaser.label,
    desc: TXT.globalRules.timingRows.chaser.desc,
    min: 12,
    max: 168,
    unit: TXT.globalRules.timingRows.chaser.unit,
  },
  {
    key: "closureHoursBefore",
    label: TXT.globalRules.timingRows.closure.label,
    desc: TXT.globalRules.timingRows.closure.desc,
    min: 1,
    max: 48,
    unit: TXT.globalRules.timingRows.closure.unit,
  },
];

const TIMING_TOGGLE_ROWS: LabelDescRow<RulesBooleanKey>[] = [
  {
    key: "autoFulfillment",
    label: TXT.globalRules.timingToggles.autoFulfillment.label,
    desc: TXT.globalRules.timingToggles.autoFulfillment.desc,
  },
  {
    key: "requirePurchased",
    label: TXT.globalRules.timingToggles.requirePurchased.label,
    desc: TXT.globalRules.timingToggles.requirePurchased.desc,
  },
  {
    key: "blindBids",
    label: TXT.globalRules.timingToggles.blindBids.label,
    desc: TXT.globalRules.timingToggles.blindBids.desc,
  },
];

const LOYALTY_ROWS: LoyaltyRow[] = [
  { key: "multiplierPlatinum", tier: "Platinum", color: T.statusWarning, bg: T.statusWarningBg },
  { key: "multiplierGold", tier: "Gold", color: T.brandPrimary, bg: T.brandPrimaryBg },
  { key: "multiplierSilver", tier: "Silver", color: T.textSecondary, bg: T.neutralBgSoft },
];

const CHANNEL_ROWS: LabelDescRow<ChannelRuleKey>[] = [
  {
    key: "email",
    label: "Email (PTE + Chaser + Confirm)",
    desc: "30%+ всех заявок. Базовый канал",
  },
  { key: "mmb", label: "Manage My Booking", desc: "+25% к объёму. Средняя ставка выше на 77%" },
  {
    key: "app",
    label: TXT.globalRules.channels.app.label,
    desc: TXT.globalRules.channels.app.desc,
  },
  {
    key: "web",
    label: TXT.globalRules.channels.web.label,
    desc: TXT.globalRules.channels.web.desc,
  },
  {
    key: "webcheckin",
    label: TXT.globalRules.channels.webcheckin.label,
    desc: TXT.globalRules.channels.webcheckin.desc,
  },
  {
    key: "pushNotif",
    label: TXT.globalRules.channels.pushNotif.label,
    desc: TXT.globalRules.channels.pushNotif.desc,
  },
];

const PAYMENT_ROWS: LabelDescRow<PaymentMethodKey>[] = [
  { key: "visa", label: "Visa", desc: TXT.globalRules.payments.visa },
  { key: "mastercard", label: "Mastercard", desc: TXT.globalRules.payments.mastercard },
  { key: "amex", label: "American Express", desc: TXT.globalRules.payments.amex },
  { key: "jcb", label: "JCB", desc: TXT.globalRules.payments.jcb },
  { key: "diners", label: "Diners Club", desc: TXT.globalRules.payments.diners },
];

const FEATURE_ROWS: LabelDescRow<RulesBooleanKey>[] = [
  {
    key: "seatBlocker",
    label: "Seat Blocker",
    desc: "+10–20% выручки. Блокировка соседнего места",
  },
  {
    key: "payWithPoints",
    label: "Pay with Points",
    desc: TXT.globalRules.features.payWithPoints,
  },
  {
    key: "crossAirlineUpgrades",
    label: "Cross Airline Upgrades",
    desc: "+21% заявок через альянс/кодшер",
  },
  {
    key: "continuousPricing",
    label: "Continuous Pricing (AI)",
    desc: "+12% выручки по A/B-тесту",
  },
  {
    key: "autoFulfillment",
    label: TXT.globalRules.features.autoFulfillment.label,
    desc: TXT.globalRules.features.autoFulfillment.desc,
  },
  {
    key: "blindBids",
    label: TXT.globalRules.features.blindBids.label,
    desc: TXT.globalRules.features.blindBids.desc,
  },
];

const FEATURE_STATUS_LABELS: Record<FeatureStatusKey, string> = {
  seatBlocker: TXT.passenger.products.sb.label,
  payWithPoints: "Pay with Points",
  crossAirlineUpgrades: "Cross Airline",
  continuousPricing: "Continuous Pricing",
  autoFulfillment: TXT.globalRules.features.autoFulfillment.label,
  blindBids: TXT.globalRules.features.blindBids.label,
};

export function GlobalRules() {
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState<RuleSectionId>("timing");

  const setRule = <K extends RulesNumberKey | RulesBooleanKey>(key: K, val: Rules[K]) => {
    setRules((r) => ({ ...r, [key]: val }));
    setSaved(false);
  };
  const setNestedRule = <K extends "channels" | "paymentMethods", SK extends keyof Rules[K]>(
    key: K,
    subkey: SK,
    val: boolean,
  ) => {
    setRules((r) => ({ ...r, [key]: { ...r[key], [subkey]: val } as Rules[K] }));
    setSaved(false);
  };

  const RuleRow = ({
    label,
    desc,
    children,
  }: {
    label: ReactNode;
    desc?: ReactNode;
    children: ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: `0.5px solid ${T.borderDefault}`,
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary }}>{label}</div>
        {desc && (
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, lineHeight: 1.5 }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );

  const loyaltyPreview: Array<{ tier: Tier; mult: number }> = [
    { tier: "Standard", mult: 1 },
    { tier: "Silver", mult: 1 + rules.multiplierSilver / 100 },
    { tier: "Gold", mult: 1 + rules.multiplierGold / 100 },
    { tier: "Platinum", mult: 1 + rules.multiplierPlatinum / 100 },
  ];

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 16, alignItems: "start" }}
    >
      <div
        style={{
          background: T.surfaceCard,
          border: `0.5px solid ${T.borderDefault}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "12px 14px", borderBottom: `0.5px solid ${T.borderDefault}` }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: T.textMuted,
            }}
          >
            {TXT.globalRules.side.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, lineHeight: 1.5 }}>
            {TXT.globalRules.side.desc}
          </div>
        </div>
        {RULE_SECTIONS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "11px 14px",
              fontSize: 13,
              fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? T.brandPrimary : T.textSecondary,
              background: activeSection === s.id ? T.brandPrimaryBg : "transparent",
              border: "none",
              cursor: "pointer",
              borderBottom:
                i < RULE_SECTIONS.length - 1 ? `0.5px solid ${T.borderDefault}` : "none",
            }}
          >
            {s.l}
          </button>
        ))}
        <div style={{ padding: "10px 12px", borderTop: `0.5px solid ${T.borderDefault}` }}>
          <button
            type="button"
            onClick={() => setSaved(true)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: saved ? T.statusSuccessBg : T.brandPrimary,
              border: `0.5px solid ${saved ? T.statusSuccess : T.brandPrimary}`,
              color: saved ? T.statusSuccessFg : T.onBrandPrimarySoft,
              transition: "all .2s",
            }}
          >
            {saved ? TXT.globalRules.side.saved : TXT.globalRules.side.save}
          </button>
          {!saved && (
            <div
              style={{ fontSize: 10, color: T.statusWarning, marginTop: 5, textAlign: "center" }}
            >
              {TXT.globalRules.side.unsaved}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: T.surfaceCard,
          border: `0.5px solid ${T.borderDefault}`,
          borderRadius: 12,
          padding: "20px 24px",
        }}
      >
        {activeSection === "timing" && (
          <div>
            <SectionLabel>Тайминг аукциона</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Управляет жизненным циклом коммуникаций и автоматическими процессами.
            </div>
            {TIMING_ROWS.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <NumInput
                  value={rules[row.key]}
                  onChange={(v) => setRule(row.key, v)}
                  min={row.min}
                  max={row.max}
                  unit={row.unit}
                />
              </RuleRow>
            ))}
            {TIMING_TOGGLE_ROWS.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <RuleRow
              label={TXT.globalRules.labels.maxUpgrades}
              desc={TXT.globalRules.labels.maxUpgradesDesc}
            >
              <NumInput
                value={rules.maxUpgradesPerFlight}
                onChange={(v) => setRule("maxUpgradesPerFlight", v)}
                min={0}
                max={50}
                unit={TXT.globalRules.labels.maxUpgradesUnit}
              />
            </RuleRow>
          </div>
        )}
        {activeSection === "pricing" && (
          <div>
            <SectionLabel>{TXT.globalRules.labels.pricingSection}</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              {TXT.globalRules.labels.pricingSectionDesc}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        color: T.textMuted,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        borderBottom: `0.5px solid ${T.borderDefault}`,
                        background: T.surfaceElevated,
                      }}
                    >
                      {TXT.globalRules.labels.product}
                    </th>
                    {HAUL_COLS.map((c) => (
                      <th
                        key={c.k}
                        style={{
                          textAlign: "center",
                          padding: "8px 10px",
                          color: T.textMuted,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          borderBottom: `0.5px solid ${T.borderDefault}`,
                          background: T.surfaceElevated,
                        }}
                      >
                        {c.lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRICING_ROWS.map((row) => (
                    <tr
                      key={row.product}
                      style={{ borderBottom: `0.5px solid ${T.borderDefault}` }}
                    >
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: T.textPrimary }}>
                        {row.product}
                      </td>
                      {HAUL_COLS.map((c) => (
                        <td key={c.k} style={{ padding: "9px 10px", textAlign: "center" }}>
                          <input
                            type="number"
                            value={rules[row.keys[c.k]]}
                            min={0}
                            onChange={(e) => setRule(row.keys[c.k], Number(e.target.value))}
                            style={{
                              width: 58,
                              padding: "4px 6px",
                              borderRadius: 5,
                              textAlign: "center",
                              border: `0.5px solid ${T.borderSubtle}`,
                              background: T.surfaceElevated,
                              color: T.textPrimary,
                              fontSize: 12,
                              fontFamily: "monospace",
                              outline: "none",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16 }}>
              <RuleRow label="Continuous Pricing (AI)" desc="+12% выручки по A/B-тесту">
                <Toggle
                  checked={rules.continuousPricing}
                  onChange={(v) => setRule("continuousPricing", v)}
                />
              </RuleRow>
            </div>
          </div>
        )}
        {activeSection === "loyalty" && (
          <div>
            <SectionLabel>{TXT.globalRules.labels.loyaltySection}</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              {TXT.globalRules.labels.loyaltySectionDesc}
            </div>
            {LOYALTY_ROWS.map((row) => (
              <RuleRow
                key={row.key}
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill color={row.color} bg={row.bg}>
                      {row.tier}
                    </Pill>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary }}>
                      {row.tier}
                    </span>
                  </span>
                }
                desc=""
              >
                <NumInput
                  value={rules[row.key]}
                  onChange={(v) => setRule(row.key, v)}
                  min={0}
                  max={50}
                  unit="%"
                />
              </RuleRow>
            ))}
            <div
              style={{
                marginTop: 16,
                background: T.surfaceElevated,
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: T.textMuted,
                  marginBottom: 10,
                }}
              >
                {TXT.globalRules.labels.previewBase}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {loyaltyPreview.map((row) => {
                  const tm = TIER_META[row.tier];
                  return (
                    <div
                      key={row.tier}
                      style={{
                        background: T.surfacePage,
                        borderRadius: 8,
                        padding: "9px 11px",
                        textAlign: "center",
                      }}
                    >
                      <Pill color={colorToken(tm.colorId)} bg={colorToken(tm.bgId)} size={10}>
                        {row.tier}
                      </Pill>
                      <div style={{ fontSize: 11, color: T.textMuted, margin: "5px 0 2px" }}>
                        $400
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.brandPrimaryFg,
                          fontFamily: "monospace",
                        }}
                      >
                        ${Math.round(400 * row.mult)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {activeSection === "channels" && (
          <div>
            <SectionLabel>{TXT.globalRules.labels.channelsSection}</SectionLabel>
            {CHANNEL_ROWS.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.channels[row.key]}
                  onChange={(v) => setNestedRule("channels", row.key, v)}
                />
              </RuleRow>
            ))}
          </div>
        )}
        {activeSection === "payment" && (
          <div>
            <SectionLabel>{TXT.globalRules.labels.paymentSection}</SectionLabel>
            {PAYMENT_ROWS.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.paymentMethods[row.key]}
                  onChange={(v) => setNestedRule("paymentMethods", row.key, v)}
                />
              </RuleRow>
            ))}
            <RuleRow
              label={TXT.globalRules.labels.auth3ds}
              desc={TXT.globalRules.labels.auth3dsDesc}
            >
              <Toggle checked={rules.use3ds} onChange={(v) => setRule("use3ds", v)} />
            </RuleRow>
            {rules.use3ds && (
              <div
                style={{
                  marginTop: 8,
                  background: T.statusWarningBg,
                  border: `0.5px solid ${T.statusWarning}`,
                  borderRadius: 8,
                  padding: "10px 13px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.statusWarningFg,
                    marginBottom: 2,
                  }}
                >
                  {TXT.globalRules.labels.auth3dsEnabled}
                </div>
                <div style={{ fontSize: 11, color: T.statusWarning, lineHeight: 1.5 }}>
                  {TXT.globalRules.labels.auth3dsEnabledDesc}
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === "features" && (
          <div>
            <SectionLabel>{TXT.globalRules.labels.featuresSection}</SectionLabel>
            {FEATURE_ROWS.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <div
              style={{
                marginTop: 16,
                background: T.surfaceElevated,
                borderRadius: 10,
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: T.textMuted,
                  marginBottom: 10,
                }}
              >
                {TXT.globalRules.labels.featuresStatus}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 7 }}>
                {(
                  Object.keys(FEATURE_STATUS_LABELS) as Array<keyof typeof FEATURE_STATUS_LABELS>
                ).map((k) => {
                  return (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: T.surfacePage,
                        borderRadius: 7,
                        padding: "7px 11px",
                      }}
                    >
                      <span style={{ fontSize: 12, color: T.textSecondary }}>
                        {FEATURE_STATUS_LABELS[k]}
                      </span>
                      <Pill
                        color={rules[k] ? T.statusSuccessFg : T.textMuted}
                        bg={rules[k] ? T.statusSuccessBg : T.neutralBgSoft}
                        size={10}
                      >
                        {rules[k]
                          ? TXT.globalRules.featureStatus.enabled
                          : TXT.globalRules.featureStatus.disabled}
                      </Pill>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
