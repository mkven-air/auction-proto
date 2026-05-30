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
} from "./types";
import { T } from "./theme";
import { DEFAULT_RULES, TIER_META } from "./data";
import { NumInput, Pill, SectionLabel, Toggle } from "./primitives";

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

  const SECTIONS: Array<{ id: RuleSectionId; l: string }> = [
    { id: "timing", l: "Тайминг" },
    { id: "pricing", l: "Ценообразование" },
    { id: "loyalty", l: "Лояльность" },
    { id: "channels", l: "Каналы охвата" },
    { id: "payment", l: "Платежи" },
    { id: "features", l: "Функции" },
  ];

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
        borderBottom: `0.5px solid ${T.border}`,
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{label}</div>
        {desc && (
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, lineHeight: 1.5 }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );

  const haulCols: Array<{ k: PricingHaulKey; lbl: string }> = [
    { k: "UltraShort", lbl: "<1.5ч" },
    { k: "Short", lbl: "1.5–3ч" },
    { k: "Medium", lbl: "3–5ч" },
    { k: "Long", lbl: "5–8ч" },
    { k: "UltraLong", lbl: "8ч+" },
  ];
  const pricingRows: PricingRow[] = [
    {
      product: "Бизнес-класс",
      keys: {
        UltraShort: "minBcUltraShort",
        Short: "minBcShort",
        Medium: "minBcMedium",
        Long: "minBcLong",
        UltraLong: "minBcUltraLong",
      },
    },
    {
      product: "Ряды у выхода",
      keys: {
        UltraShort: "minExitShort",
        Short: "minExitShort",
        Medium: "minExitMedium",
        Long: "minExitLong",
        UltraLong: "minExitLong",
      },
    },
    {
      product: "Блок соседнего",
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
      label: "Первое приглашение (PTE)",
      desc: "За сколько дней отправить первое письмо",
      min: 1,
      max: 60,
      unit: "дн. до вылета",
    },
    {
      key: "chaserHoursBefore",
      label: "Напоминание (Chaser)",
      desc: "За сколько часов отправить напоминание без заявки",
      min: 12,
      max: 168,
      unit: "ч. до вылета",
    },
    {
      key: "closureHoursBefore",
      label: "Закрытие аукциона",
      desc: "За сколько часов прекратить приём заявок",
      min: 1,
      max: 48,
      unit: "ч. до вылета",
    },
  ];
  const timingToggleRows: Array<{ key: RulesBooleanKey; label: string; desc: string }> = [
    {
      key: "autoFulfillment",
      label: "Авто-фулфилмент",
      desc: "Автоматически выбирает победителей и обновляет PNR",
    },
    {
      key: "requirePurchased",
      label: "Только при наличии билета",
      desc: "Ключевой антидилюционный механизм",
    },
    {
      key: "blindBids",
      label: "Слепые ставки",
      desc: "Пассажиры не видят ставки других участников",
    },
  ];
  const loyaltyRows: Array<{ key: RulesNumberKey; tier: Tier; color: string; bg: string }> = [
    { key: "multiplierPlatinum", tier: "Platinum", color: T.amber, bg: T.amberDim },
    { key: "multiplierGold", tier: "Gold", color: T.accent, bg: T.accentDim },
    { key: "multiplierSilver", tier: "Silver", color: T.textSub, bg: T.neutralSoft },
  ];
  const loyaltyPreview: Array<{ tier: Tier; mult: number }> = [
    { tier: "Standard", mult: 1 },
    { tier: "Silver", mult: 1 + rules.multiplierSilver / 100 },
    { tier: "Gold", mult: 1 + rules.multiplierGold / 100 },
    { tier: "Platinum", mult: 1 + rules.multiplierPlatinum / 100 },
  ];
  const channelRows: Array<{ key: ChannelRuleKey; label: string; desc: string }> = [
    {
      key: "email",
      label: "Email (PTE + Chaser + Confirm)",
      desc: "30%+ всех заявок. Базовый канал",
    },
    { key: "mmb", label: "Manage My Booking", desc: "+25% к объёму. Средняя ставка выше на 77%" },
    { key: "app", label: "Мобильное приложение + Push", desc: "+4% к объёму" },
    { key: "web", label: "Маркетинговая страница", desc: "41% выручки партнёра" },
    {
      key: "webcheckin",
      label: "Онлайн-регистрация",
      desc: "+10% к выручке. 55% уникальных посетителей",
    },
    { key: "pushNotif", label: "Push-уведомления", desc: "Уведомляет о статусе ставки" },
  ];
  const paymentRows: Array<{ key: PaymentMethodKey; label: string; desc: string }> = [
    { key: "visa", label: "Visa", desc: "Поддерживается всеми PSP-партнёрами" },
    { key: "mastercard", label: "Mastercard", desc: "Поддерживается всеми PSP-партнёрами" },
    { key: "amex", label: "American Express", desc: "Более высокий средний чек" },
    { key: "jcb", label: "JCB", desc: "Актуально для маршрутов в Азию" },
    { key: "diners", label: "Diners Club", desc: "Ограниченная поддержка эквайеров" },
  ];
  const featureRows: Array<{ key: RulesBooleanKey; label: string; desc: string }> = [
    {
      key: "seatBlocker",
      label: "Seat Blocker",
      desc: "+10–20% выручки. Блокировка соседнего места",
    },
    { key: "payWithPoints", label: "Pay with Points", desc: "Оплата баллами лояльности" },
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
      label: "Авто-фулфилмент",
      desc: "Автовыбор победителей без ручного одобрения",
    },
    { key: "blindBids", label: "Слепые ставки", desc: "Участники не видят предложения других" },
  ];
  const featureStatusLabels: Record<
    | "seatBlocker"
    | "payWithPoints"
    | "crossAirlineUpgrades"
    | "continuousPricing"
    | "autoFulfillment"
    | "blindBids",
    string
  > = {
    seatBlocker: "Seat Blocker",
    payWithPoints: "Pay with Points",
    crossAirlineUpgrades: "Cross Airline",
    continuousPricing: "Continuous Pricing",
    autoFulfillment: "Авто-фулфилмент",
    blindBids: "Слепые ставки",
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 16, alignItems: "start" }}
    >
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "12px 14px", borderBottom: `0.5px solid ${T.border}` }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: T.textMuted,
            }}
          >
            Глобальные правила
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, lineHeight: 1.5 }}>
            Применяются ко всем рейсам по умолчанию
          </div>
        </div>
        {SECTIONS.map((s, i) => (
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
              color: activeSection === s.id ? T.accent : T.textSub,
              background: activeSection === s.id ? T.accentDim : "transparent",
              border: "none",
              cursor: "pointer",
              borderBottom: i < SECTIONS.length - 1 ? `0.5px solid ${T.border}` : "none",
            }}
          >
            {s.l}
          </button>
        ))}
        <div style={{ padding: "10px 12px", borderTop: `0.5px solid ${T.border}` }}>
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
              background: saved ? T.greenDim : T.accent,
              border: `0.5px solid ${saved ? T.green : T.accent}`,
              color: saved ? T.greenText : T.onAccentSoft,
              transition: "all .2s",
            }}
          >
            {saved ? "✓ Сохранено" : "Сохранить правила"}
          </button>
          {!saved && (
            <div style={{ fontSize: 10, color: T.amber, marginTop: 5, textAlign: "center" }}>
              Есть несохранённые изменения
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
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
            <RuleRow label="Макс. апгрейдов на рейс" desc="0 = без ограничений">
              <NumInput
                value={rules.maxUpgradesPerFlight}
                onChange={(v) => setRule("maxUpgradesPerFlight", v)}
                min={0}
                max={50}
                unit="мест (0=∞)"
              />
            </RuleRow>
          </div>
        )}
        {activeSection === "pricing" && (
          <div>
            <SectionLabel>Минимальные ставки по типу хола (USD)</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Пассажир не сможет предложить сумму ниже указанной.
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
                        borderBottom: `0.5px solid ${T.border}`,
                        background: T.bgElevated,
                      }}
                    >
                      Продукт
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
                          borderBottom: `0.5px solid ${T.border}`,
                          background: T.bgElevated,
                        }}
                      >
                        {c.lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row) => (
                    <tr key={row.product} style={{ borderBottom: `0.5px solid ${T.border}` }}>
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: T.text }}>
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
                              border: `0.5px solid ${T.borderLight}`,
                              background: T.bgElevated,
                              color: T.text,
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
            <SectionLabel>Множители статуса лояльности</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Взвешенная = базовая × (1 + множитель%). При равных ставках побеждает более высокий
              статус.
            </div>
            {loyaltyRows.map((row) => (
              <RuleRow
                key={row.key}
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill color={row.color} bg={row.bg}>
                      {row.tier}
                    </Pill>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{row.tier}</span>
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
              style={{ marginTop: 16, background: T.bgElevated, borderRadius: 10, padding: "14px" }}
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
                Предпросмотр: базовая $400
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {loyaltyPreview.map((row) => {
                  const tm = TIER_META[row.tier];
                  return (
                    <div
                      key={row.tier}
                      style={{
                        background: T.bg,
                        borderRadius: 8,
                        padding: "9px 11px",
                        textAlign: "center",
                      }}
                    >
                      <Pill color={tm.color} bg={tm.bg} size={10}>
                        {row.tier}
                      </Pill>
                      <div style={{ fontSize: 11, color: T.textMuted, margin: "5px 0 2px" }}>
                        $400
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.accentText,
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
            <SectionLabel>Активные каналы охвата</SectionLabel>
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
            <SectionLabel>Методы оплаты</SectionLabel>
            {paymentRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.paymentMethods[row.key]}
                  onChange={(v) => setNestedRule("paymentMethods", row.key, v)}
                />
              </RuleRow>
            ))}
            <RuleRow
              label="3DS аутентификация"
              desc="Снижает конверсию. Включайте только при обязательном 3DS в регионе"
            >
              <Toggle checked={rules.use3ds} onChange={(v) => setRule("use3ds", v)} />
            </RuleRow>
            {rules.use3ds && (
              <div
                style={{
                  marginTop: 8,
                  background: T.amberDim,
                  border: `0.5px solid ${T.amber}`,
                  borderRadius: 8,
                  padding: "10px 13px",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: T.amberText, marginBottom: 2 }}>
                  ⚠ 3DS включён
                </div>
                <div style={{ fontSize: 11, color: T.amber, lineHeight: 1.5 }}>
                  Используйте Plusgrade Community MPI.
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === "features" && (
          <div>
            <SectionLabel>Дополнительные функции</SectionLabel>
            {featureRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <div
              style={{ marginTop: 16, background: T.bgElevated, borderRadius: 10, padding: "14px" }}
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
                Статус функций
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
                          background: T.bg,
                          borderRadius: 7,
                          padding: "7px 11px",
                        }}
                      >
                        <span style={{ fontSize: 12, color: T.textSub }}>
                          {featureStatusLabels[k]}
                        </span>
                        <Pill
                          color={rules[k] ? T.greenText : T.textMuted}
                          bg={rules[k] ? T.greenDim : T.neutralSoft}
                          size={10}
                        >
                          {rules[k] ? "вкл" : "выкл"}
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
