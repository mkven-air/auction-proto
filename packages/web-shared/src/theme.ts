// Color values are defined as CSS custom properties on :root in index.css.
// This module is a typed bridge that lets inline-style consumers reference them
// while we migrate toward Tailwind/shadcn classes.
import type { ColorTokenId } from "@auction/core";

const cssVar = (name: string) => `var(--${name})`;

const SEMANTIC = {
  surfacePage: cssVar("surface-page"),
  surfaceCard: cssVar("surface-card"),
  surfaceElevated: cssVar("surface-elevated"),
  surfaceHover: cssVar("surface-hover"),

  borderDefault: cssVar("border-default"),
  borderSubtle: cssVar("border-subtle"),

  brandPrimary: cssVar("brand-primary"),
  brandPrimaryFg: cssVar("brand-primary-fg"),
  brandPrimaryBg: cssVar("brand-primary-bg"),
  brandPrimarySoft: cssVar("brand-primary-soft"),
  brandPrimaryMuted: cssVar("brand-primary-muted"),
  brandPrimaryPale: cssVar("brand-primary-pale"),

  statusSuccess: cssVar("status-success"),
  statusSuccessFg: cssVar("status-success-fg"),
  statusSuccessBg: cssVar("status-success-bg"),
  statusSuccessSoft: cssVar("status-success-soft"),
  statusWarning: cssVar("status-warning"),
  statusWarningFg: cssVar("status-warning-fg"),
  statusWarningBg: cssVar("status-warning-bg"),
  statusDanger: cssVar("status-danger"),
  statusDangerFg: cssVar("status-danger-fg"),
  statusDangerBg: cssVar("status-danger-bg"),

  textPrimary: cssVar("text-primary"),
  textSecondary: cssVar("text-secondary"),
  textMuted: cssVar("text-muted"),

  onBrandPrimary: cssVar("on-brand-primary"),
  onBrandPrimarySoft: cssVar("on-brand-primary-soft"),

  neutralBgSoft: cssVar("neutral-bg-soft"),
  neutralBgPale: cssVar("neutral-bg-pale"),
  neutralText: cssVar("neutral-text"),

  seatTakenBg: cssVar("seat-taken-bg"),
  seatTakenFg: cssVar("seat-taken-fg"),
  seatTakenBorder: cssVar("seat-taken-border"),
  emailPteHeaderBg: cssVar("email-pte-header-bg"),
  emailChaserHeaderBg: cssVar("email-chaser-header-bg"),
  emailWinHeaderBg: cssVar("email-win-header-bg"),
  windowControlRed: cssVar("window-control-red"),
  windowControlAmber: cssVar("window-control-amber"),
  windowControlGreen: cssVar("window-control-green"),

  overlayBrand: cssVar("overlay-brand"),
  dividerSuccess: cssVar("divider-success"),
} as const satisfies Record<ColorTokenId, string>;

export const T = SEMANTIC;

export const F = {
  sans: "Segoe UI, Helvetica Neue, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
};
