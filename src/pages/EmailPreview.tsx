import type { CSSProperties, ReactNode } from "react";
import type { EmailTemplateConfig, EmailTemplateType } from "../types";
import { F, T } from "../theme";
import { Pill, SectionLabel } from "../primitives";
import { CURRENT_LOCALE, TXT } from "../i18n";
import { useAirportsWithLocationByIds } from "../queries/useAirportsWithLocationByIds";

const EMAIL_FROM_AIRPORT_ID = "TAS";
const EMAIL_TO_AIRPORT_ID = "IST";

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
    subject: TXT.emailPreview.templates.pte.subject,
    to: TXT.emailPreview.templates.pte.to,
    tag: TXT.emailPreview.templates.pte.tag,
    tagC: T.brandPrimary,
    tagBg: T.brandPrimaryBg,
    hBg: T.emailPteHeaderBg,
    hLine: T.brandPrimary,
    title: TXT.emailPreview.templates.pte.title,
    body: TXT.emailPreview.templates.pte.body,
    ctaLabel: TXT.emailPreview.templates.pte.ctaLabel,
    ctaBg: T.brandPrimary,
    offers: [
      {
        name: TXT.emailPreview.templates.pte.offers.bc.name,
        desc: TXT.emailPreview.templates.pte.offers.bc.desc,
        from: TXT.emailPreview.templates.pte.offers.bc.from,
      },
      {
        name: TXT.emailPreview.templates.pte.offers.ex.name,
        desc: TXT.emailPreview.templates.pte.offers.ex.desc,
        from: TXT.emailPreview.templates.pte.offers.ex.from,
      },
    ],
    footer: TXT.emailPreview.templates.pte.footer,
  },
  chaser: {
    subject: TXT.emailPreview.templates.chaser.subject,
    to: TXT.emailPreview.templates.chaser.to,
    tag: TXT.emailPreview.templates.chaser.tag,
    tagC: T.statusWarning,
    tagBg: T.statusWarningBg,
    hBg: T.emailChaserHeaderBg,
    hLine: T.statusWarning,
    title: TXT.emailPreview.templates.chaser.title,
    body: TXT.emailPreview.templates.chaser.body,
    ctaLabel: TXT.emailPreview.templates.chaser.ctaLabel,
    ctaBg: T.statusWarning,
    urgency: true,
    footer: TXT.emailPreview.templates.chaser.footer,
  },
  win: {
    subject: TXT.emailPreview.templates.win.subject,
    to: TXT.emailPreview.templates.win.to,
    tag: TXT.emailPreview.templates.win.tag,
    tagC: T.statusSuccess,
    tagBg: T.statusSuccessBg,
    hBg: T.emailWinHeaderBg,
    hLine: T.statusSuccess,
    title: TXT.emailPreview.templates.win.title,
    body: TXT.emailPreview.templates.win.body,
    ctaLabel: TXT.emailPreview.templates.win.ctaLabel,
    ctaBg: T.statusSuccess,
    booking: {
      [TXT.emailPreview.templates.win.booking.flight]: "HY 602",
      [TXT.emailPreview.templates.win.booking.route]: TXT.emailPreview.templates.win.routeValue,
      [TXT.emailPreview.templates.win.booking.seat]: "4A · Бизнес-класс",
      [TXT.emailPreview.templates.win.booking.departure]: "15 июня · 08:45",
      [TXT.emailPreview.templates.win.booking.charged]: "$580",
    },
    footer: TXT.emailPreview.templates.win.footer,
  },
};

const META_ROWS_BY_TYPE: Record<EmailTemplateType, MetaRow[]> = {
  pte: [
    [TXT.emailPreview.metaRows.pte.openRate, "~35%"],
    [TXT.emailPreview.metaRows.pte.conversion, "18.4%"],
    [TXT.emailPreview.metaRows.pte.share, "30%+"],
    [TXT.emailPreview.metaRows.pte.unsub, "0.4%"],
  ],
  chaser: [
    [TXT.emailPreview.metaRows.chaser.openRate, "~42%"],
    [TXT.emailPreview.metaRows.chaser.conversion, "11.2%"],
    [TXT.emailPreview.metaRows.chaser.urgency, TXT.emailPreview.templates.chaser.urgencyValue],
    [TXT.emailPreview.metaRows.chaser.abTest, "2 варианта"],
  ],
  win: [
    [TXT.emailPreview.metaRows.win.delivered, "100%"],
    [TXT.emailPreview.metaRows.win.opened, "~88%"],
    [TXT.emailPreview.metaRows.win.complaints, "0"],
    [TXT.emailPreview.metaRows.win.npsImpact, "+12"],
  ],
};

export function EmailPreview({ type }: { type: EmailTemplateType }) {
  const c = TEMPLATE_CONFIGS[type];
  const metaRows = META_ROWS_BY_TYPE[type];
  const airportIds = [EMAIL_FROM_AIRPORT_ID, EMAIL_TO_AIRPORT_ID];
  const airportsQuery = useAirportsWithLocationByIds(airportIds);
  const airports = airportsQuery.data ?? [];
  const fromAirport = airports.find((a) => a.id === EMAIL_FROM_AIRPORT_ID);
  const toAirport = airports.find((a) => a.id === EMAIL_TO_AIRPORT_ID);
  const fromCityName = fromAirport?.city.name[CURRENT_LOCALE] ?? "";
  const toCityName = toAirport?.city.name[CURRENT_LOCALE] ?? "";
  const metadataRows: MetadataRow[] = [
    {
      key: "type",
      label: TXT.emailPreview.metadata.type,
      value: (
        <Pill color={c.tagC} bg={c.tagBg}>
          {c.tag}
        </Pill>
      ),
    },
    {
      key: "to",
      label: TXT.emailPreview.metadata.to,
      value: <span style={{ fontSize: 12, color: T.textSecondary }}>{c.to}</span>,
    },
    {
      key: "subject",
      label: TXT.emailPreview.metadata.subject,
      value: <span style={{ fontSize: 12, color: T.textPrimary }}>{c.subject}</span>,
    },
  ];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 20, alignItems: "start" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={SIDE_PANEL_CARD_STYLE}>
          <SectionLabel>{TXT.emailPreview.metadata.title}</SectionLabel>
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
          <SectionLabel>{TXT.emailPreview.channelMetrics.title}</SectionLabel>
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
            <span style={{ fontSize: 10, color: T.textMuted }}>{TXT.emailPreview.browserHost}</span>
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
                {TXT.emailPreview.airlineBrand}
              </span>
            </div>
            <div style={{ background: T.surfaceCard, padding: 14 }}>
              <div style={FLIGHT_STRIP_STYLE}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>
                    {fromAirport?.id ?? EMAIL_FROM_AIRPORT_ID}
                  </div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>{fromCityName}</div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
                  <span style={{ fontSize: 10, color: T.textMuted }}>✈</span>
                  <div style={{ flex: 1, height: 1, background: T.borderDefault }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>
                    {toAirport?.id ?? EMAIL_TO_AIRPORT_ID}
                  </div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>{toCityName}</div>
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
                      {TXT.emailPreview.urgencyTitle}
                    </div>
                    <div style={{ fontSize: 10, color: T.statusWarning }}>
                      {TXT.emailPreview.urgencyMeta}
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
                    <div style={{ fontSize: 9, color: T.textMuted }}>
                      {TXT.emailPreview.fromLabel}
                    </div>
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
