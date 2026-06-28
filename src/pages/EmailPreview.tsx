import type { ReactNode } from "react";
import type { EmailTemplateConfig, EmailTemplateType } from "../types";
import { T } from "../theme";
import { Pill, SectionLabel } from "../primitives";
import { CURRENT_LOCALE, TXT } from "../i18n";
import { useAirportsWithLocationByIds } from "../queries/useAirportsWithLocationByIds";

const EMAIL_FROM_AIRPORT_ID = "TAS";
const EMAIL_TO_AIRPORT_ID = "IST";

type MetaRow = [string, string];
type MetadataRow = { key: string; label: string; value: ReactNode };

const SIDE_PANEL_CARD_CLASS =
  "rounded-[10px] border-[0.5px] border-border-default bg-surface-card px-4 py-3.5";

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
      value: <span className="text-xs text-text-secondary">{c.to}</span>,
    },
    {
      key: "subject",
      label: TXT.emailPreview.metadata.subject,
      value: <span className="text-xs text-text-primary">{c.subject}</span>,
    },
  ];
  return (
    <div className="grid items-start gap-5" style={{ gridTemplateColumns: "1fr 330px" }}>
      <div className="flex flex-col gap-3">
        <div className={SIDE_PANEL_CARD_CLASS}>
          <SectionLabel>{TXT.emailPreview.metadata.title}</SectionLabel>
          {metadataRows.map((row) => (
            <div
              key={row.key}
              className="flex items-start gap-3 border-b-[0.5px] border-border-default py-[7px]"
            >
              <div className="w-11 shrink-0 pt-0.5 text-[11px] text-text-muted">{row.label}</div>
              <div>{row.value}</div>
            </div>
          ))}
        </div>
        <div className={SIDE_PANEL_CARD_CLASS}>
          <SectionLabel>{TXT.emailPreview.channelMetrics.title}</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {metaRows.map(([k, v]) => (
              <div key={k} className="rounded-[7px] bg-surface-page px-[11px] py-[9px]">
                <div className="text-[10px] tracking-[0.8px] text-text-muted uppercase">{k}</div>
                <div className="mt-[3px] font-mono text-[17px] font-bold text-text-primary">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-[12px] border-[0.5px] border-border-default bg-surface-card">
        <div className="flex items-center gap-1.5 border-b-[0.5px] border-border-default bg-surface-elevated px-3 py-[7px]">
          {[T.windowControlRed, T.windowControlAmber, T.windowControlGreen].map((col) => (
            <div key={col} className="h-[9px] w-[9px] rounded-full" style={{ background: col }} />
          ))}
          <div className="ml-2 flex h-[17px] flex-1 items-center rounded-[4px] bg-surface-page pl-2">
            <span className="text-[10px] text-text-muted">{TXT.emailPreview.browserHost}</span>
          </div>
        </div>
        <div className="p-3">
          <div className="overflow-hidden rounded-[7px] border-[0.5px] border-border-default">
            <div
              className="flex items-center gap-2 px-3.5 py-[11px]"
              style={{ background: c.hBg, borderBottom: `2px solid ${c.hLine}` }}
            >
              <div
                className="flex h-4 w-6 items-center justify-center rounded-[4px]"
                style={{ background: c.hLine }}
              >
                <span className="text-[8px] font-extrabold text-on-brand-primary">HY</span>
              </div>
              <span className="text-xs font-semibold text-text-primary">
                {TXT.emailPreview.airlineBrand}
              </span>
            </div>
            <div className="bg-surface-card p-3.5">
              <div className="mb-2.5 flex items-center gap-2.5 rounded-[6px] border-[0.5px] border-border-default bg-surface-elevated px-2.5 py-2">
                <div className="text-center">
                  <div className="text-[15px] font-bold text-text-primary">
                    {fromAirport?.id ?? EMAIL_FROM_AIRPORT_ID}
                  </div>
                  <div className="text-[9px] text-text-muted">{fromCityName}</div>
                </div>
                <div className="flex flex-1 items-center gap-[3px]">
                  <div className="h-px flex-1 bg-border-default" />
                  <span className="text-[10px] text-text-muted">✈</span>
                  <div className="h-px flex-1 bg-border-default" />
                </div>
                <div className="text-center">
                  <div className="text-[15px] font-bold text-text-primary">
                    {toAirport?.id ?? EMAIL_TO_AIRPORT_ID}
                  </div>
                  <div className="text-[9px] text-text-muted">{toCityName}</div>
                </div>
              </div>
              {c.urgency && (
                <div className="mb-[9px] flex items-center gap-1.5 rounded-[5px] border-[0.5px] border-status-warning bg-status-warning-bg px-[9px] py-1.5">
                  <span className="text-xs">⏳</span>
                  <div>
                    <div className="text-[11px] font-semibold text-status-warning-fg">
                      {TXT.emailPreview.urgencyTitle}
                    </div>
                    <div className="text-[10px] text-status-warning">
                      {TXT.emailPreview.urgencyMeta}
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-1 text-[13px] font-semibold text-text-primary">{c.title}</div>
              <div className="mb-[9px] text-[11px] leading-[1.6] text-text-secondary">{c.body}</div>
              {c.offers?.map((o) => (
                <div
                  key={o.name}
                  className="mb-[5px] flex items-center justify-between rounded-[5px] border-[0.5px] border-border-default px-[9px] py-1.5"
                >
                  <div>
                    <div className="text-[11px] font-semibold text-text-primary">{o.name}</div>
                    <div className="text-[10px] text-text-muted">{o.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-text-muted">{TXT.emailPreview.fromLabel}</div>
                    <div className="text-sm font-bold" style={{ color: c.tagC }}>
                      {o.from}
                    </div>
                  </div>
                </div>
              ))}
              {c.booking && (
                <div className="mb-[9px] rounded-[5px] border-[0.5px] border-status-success bg-status-success-bg px-[9px] py-2">
                  {Object.entries(c.booking).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-0.5 text-[11px]"
                      style={{ borderBottom: `0.5px solid ${T.dividerSuccess}` }}
                    >
                      <span className="text-status-success-fg">{k}</span>
                      <span className="font-semibold text-status-success-fg">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="mb-[7px] cursor-pointer rounded-[5px] py-2 text-center text-[11px] font-bold text-on-brand-primary"
                style={{ background: c.ctaBg }}
              >
                {c.ctaLabel}
              </div>
              <div className="border-t-[0.5px] border-border-default pt-[7px] text-[10px] leading-[1.6] text-text-muted">
                {c.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
