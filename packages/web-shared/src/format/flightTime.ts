import { SHARED_I18N } from "../i18n";
import type { Locale } from "../i18n";

const pad2 = (n: number) => String(n).padStart(2, "0");

type Parts = { day: number; month: number; hour: number; minute: number };

const flightTimeTextFor = (locale: Locale) => SHARED_I18N[locale].flightTime;

const getParts = (iso: string, timeZone: string): Parts => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date(iso));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  let hour = get("hour");
  // Intl with hour12:false can return "24" for midnight in some environments.
  if (hour === 24) hour = 0;
  return { day: get("day"), month: get("month"), hour, minute: get("minute") };
};

export const formatFlightDep = (iso: string, timeZone: string, locale: Locale): string => {
  const p = getParts(iso, timeZone);
  return `${p.day} ${flightTimeTextFor(locale).monthsAbbr[p.month - 1]} ${pad2(p.hour)}:${pad2(p.minute)}`;
};

export const formatFlightArr = (iso: string, timeZone: string): string => {
  const p = getParts(iso, timeZone);
  return `${pad2(p.hour)}:${pad2(p.minute)}`;
};

export const formatFlightDuration = (depIso: string, arrIso: string, locale: Locale): string => {
  const minutes = Math.round((Date.parse(arrIso) - Date.parse(depIso)) / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const { durationHourSuffix, durationMinuteSuffix } = flightTimeTextFor(locale);
  return `${h}${durationHourSuffix} ${pad2(m)}${durationMinuteSuffix}`;
};
