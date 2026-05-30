import type { ReactNode } from "react";
import type { EmailTemplateConfig, EmailTemplateType } from "./types";
import { F, T } from "./theme";
import { Pill, SectionLabel } from "./primitives";

export function EmailPreview({ type }: { type: EmailTemplateType }) {
  const cfgs: Record<EmailTemplateType, EmailTemplateConfig> = {
    pte: {
      subject: "Азиз, предложите свою цену на бизнес-класс",
      to: "aziz.karimov@mail.uz",
      tag: "PTE · за 7–14 дней",
      tagC: T.accent,
      tagBg: T.accentDim,
      hBg: T.emailPteBg,
      hLine: T.accent,
      title: "Улучшите перелёт до бизнес-класса",
      body: "Ваш рейс HY 602 квалифицирован для участия в аукционе. Предложите цену — средства спишутся только при подтверждении.",
      ctaLabel: "Предложить цену →",
      ctaBg: T.accent,
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
      tagC: T.amber,
      tagBg: T.amberDim,
      hBg: T.emailChaserBg,
      hLine: T.amber,
      title: "Аукцион закрывается через 14 часов",
      body: "Вы не подавали заявку. Осталось ограниченное число мест. Деньги не списываются без подтверждённого апгрейда.",
      ctaLabel: "Участвовать — осталось мало мест →",
      ctaBg: T.amber,
      urgency: true,
      footer: "Ставка не гарантирует апгрейд. Оплата только при подтверждении.",
    },
    win: {
      subject: "Поздравляем — вы летите бизнес-классом!",
      to: "aziz.karimov@mail.uz",
      tag: "Confirm · за 4–8 часов",
      tagC: T.green,
      tagBg: T.greenDim,
      hBg: T.emailWinBg,
      hLine: T.green,
      title: "Ваш апгрейд подтверждён!",
      body: "Добро пожаловать в бизнес-класс, Азиз! Место 4A забронировано, $580 списано. Приоритетная посадка и лаундж уже доступны.",
      ctaLabel: "Посмотреть посадочный →",
      ctaBg: T.green,
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
  const c = cfgs[type];
  const metaRows: Array<[string, string]> =
    type === "pte"
      ? [
          ["Открываемость", "~35%"],
          ["Конверсия", "18.4%"],
          ["Доля заявок", "30%+"],
          ["Отписок", "0.4%"],
        ]
      : type === "chaser"
        ? [
            ["Открываемость", "~42%"],
            ["Конверсия", "11.2%"],
            ["Срочность", "высокая"],
            ["A/B тест", "2 варианта"],
          ]
        : [
            ["Доставлено", "100%"],
            ["Открыто", "~88%"],
            ["Жалоб", "0"],
            ["NPS impact", "+12"],
          ];
  const metadataRows: Array<{ key: string; label: string; value: ReactNode }> = [
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
      value: <span style={{ fontSize: 12, color: T.textSub }}>{c.to}</span>,
    },
    {
      key: "subject",
      label: "Тема",
      value: <span style={{ fontSize: 12, color: T.text }}>{c.subject}</span>,
    },
  ];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 20, alignItems: "start" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SectionLabel>Метаданные</SectionLabel>
          {metadataRows.map((row) => (
            <div
              key={row.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "7px 0",
                borderBottom: `0.5px solid ${T.border}`,
              }}
            >
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
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SectionLabel>Метрики канала</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {metaRows.map(([k, v]) => (
              <div key={k} style={{ background: T.bg, borderRadius: 7, padding: "9px 11px" }}>
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
                    color: T.text,
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
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: T.bgElevated,
            borderBottom: `0.5px solid ${T.border}`,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {[T.windowControlRed, T.windowControlAmber, T.windowControlGreen].map((col) => (
            <div key={col} style={{ width: 9, height: 9, borderRadius: "50%", background: col }} />
          ))}
          <div
            style={{
              flex: 1,
              background: T.bg,
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
          <div style={{ borderRadius: 7, overflow: "hidden", border: `0.5px solid ${T.border}` }}>
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
                <span style={{ fontSize: 8, fontWeight: 800, color: T.onAccent }}>HY</span>
              </div>
              <span style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>
                Uzbekistan Airways
              </span>
            </div>
            <div style={{ background: T.bgCard, padding: 14 }}>
              <div
                style={{
                  background: T.bgElevated,
                  border: `0.5px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>TAS</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Ташкент</div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                  <span style={{ fontSize: 10, color: T.textMuted }}>✈</span>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>IST</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Стамбул</div>
                </div>
              </div>
              {c.urgency && (
                <div
                  style={{
                    background: T.amberDim,
                    border: `0.5px solid ${T.amber}`,
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
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.amberText }}>
                      Аукцион закрывается через 14 часов
                    </div>
                    <div style={{ fontSize: 10, color: T.amber }}>HY 602 · 15 июня · 08:45</div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 11, color: T.textSub, lineHeight: 1.6, marginBottom: 9 }}>
                {c.body}
              </div>
              {c.offers?.map((o) => (
                <div
                  key={o.name}
                  style={{
                    border: `0.5px solid ${T.border}`,
                    borderRadius: 5,
                    padding: "6px 9px",
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{o.name}</div>
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
                    background: T.greenDim,
                    border: `0.5px solid ${T.green}`,
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
                      <span style={{ color: T.greenText }}>{k}</span>
                      <span style={{ fontWeight: 600, color: T.greenText }}>{v}</span>
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
                  color: T.onAccent,
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
                  borderTop: `0.5px solid ${T.border}`,
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
