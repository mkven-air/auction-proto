import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@auction/core";
import { T } from "@auction/web-shared";
import { useTiersById } from "@auction/web-shared";
import { colorToken } from "@auction/web-shared";
import { useLocale } from "@auction/web-shared";
import { NumInput, Pill, SectionLabel, Toggle } from "@auction/web-shared";
import { adminBackend } from "@auction/web-shared";
import { queryKeys } from "@auction/web-shared";
import { useRules } from "@auction/web-shared";

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
  | "blindBids"
  | "onlyUpgrade";

type Txt = ReturnType<typeof useLocale>["txt"];

function buildRuleCopy(txt: Txt) {
  const ruleSections: RuleSection[] = [
    { id: "timing", l: txt.globalRules.sections.timing },
    { id: "pricing", l: txt.globalRules.sections.pricing },
    { id: "loyalty", l: txt.globalRules.sections.loyalty },
    { id: "channels", l: txt.globalRules.sections.channels },
    { id: "payment", l: txt.globalRules.sections.payment },
    { id: "features", l: txt.globalRules.sections.features },
  ];

  const haulCols: HaulColumn[] = [
    { k: "UltraShort", lbl: txt.globalRules.haulCols.ultraShort },
    { k: "Short", lbl: txt.globalRules.haulCols.short },
    { k: "Medium", lbl: txt.globalRules.haulCols.medium },
    { k: "Long", lbl: txt.globalRules.haulCols.long },
    { k: "UltraLong", lbl: txt.globalRules.haulCols.ultraLong },
  ];

  const pricingRows: PricingRow[] = [
    {
      product: txt.globalRules.pricingProducts.business,
      keys: {
        UltraShort: "minBcUltraShort",
        Short: "minBcShort",
        Medium: "minBcMedium",
        Long: "minBcLong",
        UltraLong: "minBcUltraLong",
      },
    },
    {
      product: txt.globalRules.pricingProducts.exitRows,
      keys: {
        UltraShort: "minExitShort",
        Short: "minExitShort",
        Medium: "minExitMedium",
        Long: "minExitLong",
        UltraLong: "minExitLong",
      },
    },
    {
      product: txt.globalRules.pricingProducts.seatBlock,
      keys: {
        UltraShort: "minSeatBlockShort",
        Short: "minSeatBlockShort",
        Medium: "minSeatBlockMedium",
        Long: "minSeatBlockLong",
        UltraLong: "minSeatBlockLong",
      },
    },
  ];

  const timingRows: TimingRow[] = [
    {
      key: "inviteDaysBefore",
      label: txt.globalRules.timingRows.invite.label,
      desc: txt.globalRules.timingRows.invite.desc,
      min: 1,
      max: 60,
      unit: txt.globalRules.timingRows.invite.unit,
    },
    {
      key: "chaserHoursBefore",
      label: txt.globalRules.timingRows.chaser.label,
      desc: txt.globalRules.timingRows.chaser.desc,
      min: 12,
      max: 168,
      unit: txt.globalRules.timingRows.chaser.unit,
    },
    {
      key: "closureHoursBefore",
      label: txt.globalRules.timingRows.closure.label,
      desc: txt.globalRules.timingRows.closure.desc,
      min: 1,
      max: 48,
      unit: txt.globalRules.timingRows.closure.unit,
    },
  ];

  const timingToggleRows: LabelDescRow<RulesBooleanKey>[] = [
    {
      key: "autoFulfillment",
      label: txt.globalRules.timingToggles.autoFulfillment.label,
      desc: txt.globalRules.timingToggles.autoFulfillment.desc,
    },
    {
      key: "requirePurchased",
      label: txt.globalRules.timingToggles.requirePurchased.label,
      desc: txt.globalRules.timingToggles.requirePurchased.desc,
    },
    {
      key: "blindBids",
      label: txt.globalRules.timingToggles.blindBids.label,
      desc: txt.globalRules.timingToggles.blindBids.desc,
    },
  ];

  const loyaltyRows: LoyaltyRow[] = [
    { key: "multiplierPlatinum", tier: "platinum", color: T.statusWarning, bg: T.statusWarningBg },
    { key: "multiplierGold", tier: "gold", color: T.brandPrimary, bg: T.brandPrimaryBg },
    { key: "multiplierSilver", tier: "silver", color: T.textSecondary, bg: T.neutralBgSoft },
  ];

  const channelRows: LabelDescRow<ChannelRuleKey>[] = [
    {
      key: "email",
      label: "Email (PTE + Chaser + Confirm)",
      desc: "30%+ всех заявок. Базовый канал",
    },
    { key: "mmb", label: "Manage My Booking", desc: "+25% к объёму. Средняя ставка выше на 77%" },
    {
      key: "app",
      label: txt.globalRules.channels.app.label,
      desc: txt.globalRules.channels.app.desc,
    },
    {
      key: "web",
      label: txt.globalRules.channels.web.label,
      desc: txt.globalRules.channels.web.desc,
    },
    {
      key: "webcheckin",
      label: txt.globalRules.channels.webcheckin.label,
      desc: txt.globalRules.channels.webcheckin.desc,
    },
    {
      key: "pushNotif",
      label: txt.globalRules.channels.pushNotif.label,
      desc: txt.globalRules.channels.pushNotif.desc,
    },
  ];

  const paymentRows: LabelDescRow<PaymentMethodKey>[] = [
    { key: "visa", label: "Visa", desc: txt.globalRules.payments.visa },
    { key: "mastercard", label: "Mastercard", desc: txt.globalRules.payments.mastercard },
    { key: "amex", label: "American Express", desc: txt.globalRules.payments.amex },
    { key: "jcb", label: "JCB", desc: txt.globalRules.payments.jcb },
    { key: "diners", label: "Diners Club", desc: txt.globalRules.payments.diners },
  ];

  const featureRows: LabelDescRow<RulesBooleanKey>[] = [
    {
      key: "seatBlocker",
      label: "Seat Blocker",
      desc: "+10–20% выручки. Блокировка соседнего места",
    },
    {
      key: "payWithPoints",
      label: "Pay with Points",
      desc: txt.globalRules.features.payWithPoints,
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
      label: txt.globalRules.features.autoFulfillment.label,
      desc: txt.globalRules.features.autoFulfillment.desc,
    },
    {
      key: "blindBids",
      label: txt.globalRules.features.blindBids.label,
      desc: txt.globalRules.features.blindBids.desc,
    },
    {
      key: "onlyUpgrade",
      label: txt.globalRules.features.onlyUpgrade.label,
      desc: txt.globalRules.features.onlyUpgrade.desc,
    },
  ];

  const featureStatusLabels: Record<FeatureStatusKey, string> = {
    seatBlocker: txt.passenger.products.sb.label,
    payWithPoints: "Pay with Points",
    crossAirlineUpgrades: "Cross Airline",
    continuousPricing: "Continuous Pricing",
    autoFulfillment: txt.globalRules.features.autoFulfillment.label,
    blindBids: txt.globalRules.features.blindBids.label,
    onlyUpgrade: txt.globalRules.features.onlyUpgrade.label,
  };

  return {
    ruleSections,
    haulCols,
    pricingRows,
    timingRows,
    timingToggleRows,
    loyaltyRows,
    channelRows,
    paymentRows,
    featureRows,
    featureStatusLabels,
  };
}

export function GlobalRules() {
  const { txt } = useLocale();
  const queryClient = useQueryClient();
  const { byId: tiersById } = useTiersById();
  const { data: loadedRules, isLoading: isRulesLoading, isError: isRulesError } = useRules();
  const [rules, setRules] = useState<Rules | null>(null);
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState<RuleSectionId>("timing");
  const {
    ruleSections,
    haulCols,
    pricingRows,
    timingRows,
    timingToggleRows,
    loyaltyRows,
    channelRows,
    paymentRows,
    featureRows,
    featureStatusLabels,
  } = buildRuleCopy(txt);

  const saveMutation = useMutation({
    mutationFn: (nextRules: Rules) => adminBackend.rules.update(nextRules),
    onSuccess: (nextRules) => {
      setRules(nextRules);
      setSaved(true);
      queryClient.setQueryData(queryKeys.rules, nextRules);
    },
  });

  useEffect(() => {
    if (!loadedRules || rules !== null) return;
    setRules(loadedRules);
  }, [loadedRules, rules]);

  if (isRulesLoading || !rules) {
    return <div style={{ fontSize: 13, color: T.textMuted }}>{txt.admin.states.loading}</div>;
  }

  if (isRulesError) {
    return (
      <div style={{ fontSize: 13, color: T.statusDangerFg }}>{txt.admin.states.loadError}</div>
    );
  }

  const setRule = <K extends RulesNumberKey | RulesBooleanKey>(key: K, val: Rules[K]) => {
    setRules((r) => (r ? { ...r, [key]: val } : null));
    setSaved(false);
  };
  const setNestedRule = <K extends "channels" | "paymentMethods", SK extends keyof Rules[K]>(
    key: K,
    subkey: SK,
    val: boolean,
  ) => {
    setRules((r) => (r ? { ...r, [key]: { ...r[key], [subkey]: val } as Rules[K] } : null));
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
    { tier: "standard", mult: 1 },
    { tier: "silver", mult: 1 + rules.multiplierSilver / 100 },
    { tier: "gold", mult: 1 + rules.multiplierGold / 100 },
    { tier: "platinum", mult: 1 + rules.multiplierPlatinum / 100 },
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
            {txt.globalRules.side.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, lineHeight: 1.5 }}>
            {txt.globalRules.side.desc}
          </div>
        </div>
        {ruleSections.map((s, i) => (
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
              borderBottom: i < ruleSections.length - 1 ? `0.5px solid ${T.borderDefault}` : "none",
            }}
          >
            {s.l}
          </button>
        ))}
        <div style={{ padding: "10px 12px", borderTop: `0.5px solid ${T.borderDefault}` }}>
          <button
            type="button"
            onClick={() => saveMutation.mutate(rules)}
            disabled={saveMutation.isPending || saved}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: saveMutation.isPending || saved ? "not-allowed" : "pointer",
              background: saved ? T.statusSuccessBg : T.brandPrimary,
              border: `0.5px solid ${saved ? T.statusSuccess : T.brandPrimary}`,
              color: saved ? T.statusSuccessFg : T.onBrandPrimarySoft,
              opacity: saveMutation.isPending || saved ? 0.8 : 1,
              transition: "all .2s",
            }}
          >
            {saveMutation.isPending
              ? `${txt.globalRules.side.save}...`
              : saved
                ? txt.globalRules.side.saved
                : txt.globalRules.side.save}
          </button>
          {!saved && (
            <div
              style={{ fontSize: 10, color: T.statusWarning, marginTop: 5, textAlign: "center" }}
            >
              {txt.globalRules.side.unsaved}
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
            {timingRows.map((row) => (
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
            {timingToggleRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <RuleRow
              label={txt.globalRules.labels.maxUpgrades}
              desc={txt.globalRules.labels.maxUpgradesDesc}
            >
              <NumInput
                value={rules.maxUpgradesPerFlight}
                onChange={(v) => setRule("maxUpgradesPerFlight", v)}
                min={0}
                max={50}
                unit={txt.globalRules.labels.maxUpgradesUnit}
              />
            </RuleRow>
          </div>
        )}
        {activeSection === "pricing" && (
          <div>
            <SectionLabel>{txt.globalRules.labels.pricingSection}</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              {txt.globalRules.labels.pricingSectionDesc}
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
                      {txt.globalRules.labels.product}
                    </th>
                    {haulCols.map((c) => (
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
                  {pricingRows.map((row) => (
                    <tr
                      key={row.product}
                      style={{ borderBottom: `0.5px solid ${T.borderDefault}` }}
                    >
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: T.textPrimary }}>
                        {row.product}
                      </td>
                      {haulCols.map((c) => (
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
            <SectionLabel>{txt.globalRules.labels.loyaltySection}</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              {txt.globalRules.labels.loyaltySectionDesc}
            </div>
            {loyaltyRows.map((row) => (
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
                {txt.globalRules.labels.previewBase}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {loyaltyPreview.map((row) => {
                  const tm = tiersById[row.tier];
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
                      <Pill
                        color={colorToken(tm?.colorId ?? "textMuted")}
                        bg={colorToken(tm?.bgId ?? "neutralBgSoft")}
                        size={10}
                      >
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
            <SectionLabel>{txt.globalRules.labels.channelsSection}</SectionLabel>
            {channelRows.map((row) => (
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
            <SectionLabel>{txt.globalRules.labels.paymentSection}</SectionLabel>
            {paymentRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.paymentMethods[row.key]}
                  onChange={(v) => setNestedRule("paymentMethods", row.key, v)}
                />
              </RuleRow>
            ))}
            <RuleRow
              label={txt.globalRules.labels.auth3ds}
              desc={txt.globalRules.labels.auth3dsDesc}
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
                  {txt.globalRules.labels.auth3dsEnabled}
                </div>
                <div style={{ fontSize: 11, color: T.statusWarning, lineHeight: 1.5 }}>
                  {txt.globalRules.labels.auth3dsEnabledDesc}
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === "features" && (
          <div>
            <SectionLabel>{txt.globalRules.labels.featuresSection}</SectionLabel>
            {featureRows.map((row) => (
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
                {txt.globalRules.labels.featuresStatus}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 7 }}>
                {(Object.keys(featureStatusLabels) as Array<keyof typeof featureStatusLabels>).map(
                  (k) => {
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
                          {featureStatusLabels[k]}
                        </span>
                        <Pill
                          color={rules[k] ? T.statusSuccessFg : T.textMuted}
                          bg={rules[k] ? T.statusSuccessBg : T.neutralBgSoft}
                          size={10}
                        >
                          {rules[k]
                            ? txt.globalRules.featureStatus.enabled
                            : txt.globalRules.featureStatus.disabled}
                        </Pill>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
