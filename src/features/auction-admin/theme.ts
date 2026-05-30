const PALETTE = {
  white: "#FFFFFF",

  slate900: "#10253E",
  slate700: "#334E68",
  slate600: "#5B6B80",
  slate500: "#7B8794",

  blue900: "#1F4E8F",
  blue800: "#1E5AA8",
  blue700: "#2B5D97",
  blue600: "#4E7FBD",
  blue500: "#89ACD5",
  blue400: "#B7CCE8",
  blue300: "#C3D2E5",
  blue200: "#C7D9ED",
  blue100: "#D5E4F7",
  blue050: "#E7F0FB",

  gray200: "#D7E1EE",
  gray100: "#EAF0F8",
  gray075: "#EEF2F7",

  teal700: "#1A7A4C",
  teal600: "#1F9D61",
  teal500: "#63BA90",
  teal100: "#E7F6EE",

  amber700: "#8A5A13",
  amber600: "#B7791F",
  amber100: "#FEF5E7",

  red700: "#9B2C2C",
  red600: "#C53030",
  red100: "#FDECEC",

  success050: "#EAF7F0",
  info050: "#EEF4FC",
  warning050: "#FEF6EA",

  whiteBlue050: "#EFF6FF",
  whiteBlue100: "#F4F7FB",
  whiteBlue075: "#F8FAFC",
  whiteBlue080: "#EEF3FB",

  windowRed: "#FF5F57",
  windowAmber: "#FEBC2E",
  windowGreen: "#28C840",
} as const;

const SEMANTIC = {
  surfacePage: PALETTE.whiteBlue100,
  surfaceCard: PALETTE.white,
  surfaceElevated: PALETTE.whiteBlue075,
  surfaceHover: PALETTE.whiteBlue080,

  borderDefault: PALETTE.gray200,
  borderSubtle: PALETTE.blue300,

  brandPrimary: PALETTE.blue800,
  brandPrimaryFg: PALETTE.blue900,
  brandPrimaryBg: PALETTE.blue050,
  brandPrimarySoft: PALETTE.blue600,
  brandPrimaryMuted: PALETTE.blue500,
  brandPrimaryPale: PALETTE.blue200,

  statusSuccess: PALETTE.teal600,
  statusSuccessFg: PALETTE.teal700,
  statusSuccessBg: PALETTE.teal100,
  statusSuccessSoft: PALETTE.teal500,
  statusWarning: PALETTE.amber600,
  statusWarningFg: PALETTE.amber700,
  statusWarningBg: PALETTE.amber100,
  statusDanger: PALETTE.red600,
  statusDangerFg: PALETTE.red700,
  statusDangerBg: PALETTE.red100,

  textPrimary: PALETTE.slate900,
  textSecondary: PALETTE.slate700,
  textMuted: PALETTE.slate600,

  onBrandPrimary: PALETTE.white,
  onBrandPrimarySoft: PALETTE.whiteBlue050,

  neutralBgSoft: PALETTE.gray100,
  neutralBgPale: PALETTE.gray075,
  neutralText: PALETTE.slate500,

  seatTakenBg: PALETTE.blue100,
  seatTakenFg: PALETTE.blue700,
  seatTakenBorder: PALETTE.blue400,
  emailPteHeaderBg: PALETTE.info050,
  emailChaserHeaderBg: PALETTE.warning050,
  emailWinHeaderBg: PALETTE.success050,
  windowControlRed: PALETTE.windowRed,
  windowControlAmber: PALETTE.windowAmber,
  windowControlGreen: PALETTE.windowGreen,

  overlayBrand: "rgba(30,90,168,.06)",
  dividerSuccess: "rgba(16,185,129,.15)",
} as const;

export const T = SEMANTIC;

export const F = {
  sans: "Segoe UI, Helvetica Neue, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
};
