import { LocaleProvider, useLocale as useSharedLocale } from "@auction/web-shared";
import { ADMIN_I18N } from "./i18n";

export { LocaleProvider };

/**
 * Admin-scoped locale hook: shares locale state with `@auction/web-shared` but
 * returns the admin text dictionary. Shared components (e.g. SeatMap) keep
 * using the shared `useLocale` for the shared text slice.
 */
export function useLocale() {
  const { locale, setLocale } = useSharedLocale();
  return { locale, setLocale, txt: ADMIN_I18N[locale] };
}
