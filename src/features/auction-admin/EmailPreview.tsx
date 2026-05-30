import type { CSSProperties, ReactNode } from "react";
import type { EmailTemplateConfig, EmailTemplateType } from "./types";
import { F, T } from "./theme";
import { Pill, SectionLabel } from "./primitives";

type MetaRow = [string, string];
type MetadataRow = { key: string; label: string; value: ReactNode };

const SIDE_PANEL_CARD_STYLE: CSSProperties = {
  background: T.surfaceCard,
  border: `0.5px solid ${T.borderDefault}`,
  borderRadius: 10,
  padding: "14px 16px",
};

const META_ROW_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "7px 0",
  borderBottom: `0.5px solid ${T.borderDefault}`,
};

const METRIC_TILE_STYLE: CSSProperties = {
  background: T.surfacePage,
  borderRadius: 7,
  padding: "9px 11px",
};

const PREVIEW_FRAME_STYLE: CSSProperties = {
  background: T.surfaceCard,
  border: `0.5px solid ${T.borderDefault}`,
  borderRadius: 12,
  overflow: "hidden",
};

const PREVIEW_TOPBAR_STYLE: CSSProperties = {
  background: T.surfaceElevated,
  borderBottom: `0.5px solid ${T.borderDefault}`,
  padding: "7px 12px",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const FLIGHT_STRIP_STYLE: CSSProperties = {
  background: T.surfaceElevated,
  border: `0.5px solid ${T.borderDefault}`,
  borderRadius: 6,
  padding: "8px 10px",
  marginBottom: 10,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const OFFER_ROW_STYLE: CSSProperties = {
  border: `0.5px solid ${T.borderDefault}`,
  borderRadius: 5,
  padding: "6px 9px",
  marginBottom: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const TEMPLATE_CONFIGS: Record<EmailTemplateType, EmailTemplateConfig> = {
  pte: {
    subject: "Азиз, предложите свою цену на бизнес-класс",
    to: "aziz.karimov@mail.uz",
    tag: "PTE · за 7–14 дней",
    tagC: T.brandPrimary,
    tagBg: T.brandPrimaryBg,
    hBg: T.emailPteHeaderBg,
    hLine: T.brandPrimary,
    title: "Улучшите перелёт до бизнес-класса",
    body: "Ваш рейс HY 602 квалифицирован для участия в аукционе. Предложите цену — средства спишутся только при подтверждении.",
    ctaLabel: "Предложить цену →",
    ctaBg: T.brandPrimary,
    offers: [
      { name: "Бизнес-класс", desc: "Раскладное кресло · Лаундж", from: "$262" },
      { name: "Ряд у выхода", desc: "+30 см для ног", from: "$32" },
    ],
    footer: "Ставка не гарантирует апгрейд. Оплата только при подтверждении.",
  },
  chaser: {
    subject: "Последний шанс: мест в бизнес-классе почти нет",
    to: "j.smith@company.com",
    tag: "Chaser · за 48–72 часа",
    tagC: T.statusWarning,
    tagBg: T.statusWarningBg,
    hBg: T.emailChaserHeaderBg,
    hLine: T.statusWarning,
    title: "Аукцион закрывается через 14 часов",
    body: "Вы не подавали заявку. Осталось ограниченное число мест. Деньги не списываются без подтверждённого апгрейда.",
    ctaLabel: "Участвовать — осталось мало мест →",
    ctaBg: T.statusWarning,
    urgency: true,
    footer: "Ставка не гарантирует апгрейд. Оплата только при подтверждении.",
  },
  win: {
    subject: "Поздравляем — вы летите бизнес-классом!",
    to: "aziz.karimov@mail.uz",
    tag: "Confirm · за 4–8 часов",
    tagC: T.statusSuccess,
    tagBg: T.statusSuccessBg,
    hBg: T.emailWinHeaderBg,
    hLine: T.statusSuccess,
    title: "Ваш апгрейд подтверждён!",
    body: "Добро пожаловать в бизнес-класс, Азиз! Место 4A забронировано, $580 списано. Приоритетная посадка и лаундж уже доступны.",
    ctaLabel: "Посмотреть посадочный →",
    ctaBg: T.statusSuccess,
    booking: {
      Рейс: "HY 602",
      Маршрут: "Ташкент → Стамбул",
      Место: "4A · Бизнес-класс",
      Вылет: "15 июня · 08:45",
      Списано: "$580",
    },
    footer: "Uzbekistan Airways · hy-support@uzbekistanairways.com",
  },
};

const META_ROWS_BY_TYPE: Record<EmailTemplateType, MetaRow[]> = {
  pte: [
    ["Открываемость", "~35%"],
    ["Конверсия", "18.4%"],
    ["Доля заявок", "30%+"],
    ["Отписок", "0.4%"],
  ],
  chaser: [
    ["Открываемость", "~42%"],
    ["Конверсия", "11.2%"],
    ["Срочность", "высокая"],
    ["A/B тест", "2 варианта"],
  ],
  win: [
    ["Доставлено", "100%"],
    ["Открыто", "~88%"],
    ["Жалоб", "0"],
    ["NPS impact", "+12"],
  ],
};

export function EmailPreview({ type }: { type: EmailTemplateType }) {
  const c = TEMPLATE_CONFIGS[type];
  const metaRows = META_ROWS_BY_TYPE[type];
  const metadataRows: MetadataRow[] = [
    {
      key: "type",
      label: "Тип",
      value: (
        <Pill color={c.tagC} bg={c.tagBg}>
          {c.tag}
        </Pill>
      ),
    },
    {
      key: "to",
      label: "Кому",
      value: <span style={{ fontSize: 12, color: T.textSecondary }}>{c.to}</span>,
    },
    {
      key: "subject",
      label: "Тема",
      value: <span style={{ fontSize: 12, color: T.textPrimary }}>{c.subject}</span>,
    },
  ];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 20, alignItems: "start" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={SIDE_PANEL_CARD_STYLE}>
          <SectionLabel>Метаданные</SectionLabel>
          {metadataRows.map((row) => (
            <div key={row.key} style={META_ROW_STYLE}>
              <div
                style={{
                  width: 44,
                  fontSize: 11,
                  color: T.textMuted,
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {row.label}
              </div>
              <div>{row.value}</div>
            </div>
          ))}
        </div>
        <div style={SIDE_PANEL_CARD_STYLE}>
          <SectionLabel>Метрики канала</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {metaRows.map(([k, v]) => (
              <div key={k} style={METRIC_TILE_STYLE}>
                <div
                  style={{
                    fontSize: 10,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: T.textPrimary,
                    marginTop: 3,
                    fontFamily: F.mono,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={PREVIEW_FRAME_STYLE}>
        <div style={PREVIEW_TOPBAR_STYLE}>
          {[T.windowControlRed, T.windowControlAmber, T.windowControlGreen].map((col) => (
            <div key={col} style={{ width: 9, height: 9, borderRadius: "50%", background: col }} />
          ))}
          <div
            style={{
              flex: 1,
              background: T.surfacePage,
              borderRadius: 4,
              height: 17,
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              paddingLeft: 8,
            }}
          >
            <span style={{ fontSize: 10, color: T.textMuted }}>mail.uzbekistanairways.uz</span>
          </div>
        </div>
        <div style={{ padding: 12 }}>
          <div
            style={{
              borderRadius: 7,
              overflow: "hidden",
              border: `0.5px solid ${T.borderDefault}`,
            }}
          >
            <div
              style={{
                background: c.hBg,
                borderBottom: `2px solid ${c.hLine}`,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  background: c.hLine,
                  borderRadius: 4,
                  width: 24,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 800, color: T.onBrandPrimary }}>HY</span>
              </div>
              <span style={{ color: T.textPrimary, fontWeight: 600, fontSize: 12 }}>
                Uzbekistan Airways
              </span>
            </div>
            <div style={{ background: T.surfaceCard, padding: 14 }}>
              <div style={FLIGHT_STRIP_STYLE}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>TAS</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Ташкент</div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
                  <span style={{ fontSize: 10, color: T.textMuted }}>✈</span>
                  <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>IST</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Стамбул</div>
                </div>
              </div>
              {c.urgency && (
                <div
                  style={{
                    background: T.statusWarningBg,
                    border: `0.5px solid ${T.statusWarning}`,
                    borderRadius: 5,
                    padding: "6px 9px",
                    marginBottom: 9,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 12 }}>⏳</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.statusWarningFg }}>
                      Аукцион закрывается через 14 часов
                    </div>
                    <div style={{ fontSize: 10, color: T.statusWarning }}>
                      HY 602 · 15 июня · 08:45
                    </div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>
                {c.title}
              </div>
              <div
                style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6, marginBottom: 9 }}
              >
                {c.body}
              </div>
              {c.offers?.map((o) => (
                <div key={o.name} style={OFFER_ROW_STYLE}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.textPrimary }}>
                      {o.name}
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>{o.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: T.textMuted }}>от</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.tagC }}>{o.from}</div>
                  </div>
                </div>
              ))}
              {c.booking && (
                <div
                  style={{
                    background: T.statusSuccessBg,
                    border: `0.5px solid ${T.statusSuccess}`,
                    borderRadius: 5,
                    padding: "8px 9px",
                    marginBottom: 9,
                  }}
                >
                  {Object.entries(c.booking).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        padding: "2px 0",
                        borderBottom: `0.5px solid ${T.dividerSuccess}`,
                      }}
                    >
                      <span style={{ color: T.statusSuccessFg }}>{k}</span>
                      <span style={{ fontWeight: 600, color: T.statusSuccessFg }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  background: c.ctaBg,
                  borderRadius: 5,
                  padding: "8px",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.onBrandPrimary,
                  marginBottom: 7,
                  cursor: "pointer",
                }}
              >
                {c.ctaLabel}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  borderTop: `0.5px solid ${T.borderDefault}`,
                  paddingTop: 7,
                  lineHeight: 1.6,
                }}
              >
                {c.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
