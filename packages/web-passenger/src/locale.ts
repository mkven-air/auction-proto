import { LocaleProvider, useLocale as useSharedLocale } from "@auction/web-shared";
import { PASSENGER_I18N } from "./i18n";

export { LocaleProvider };

/**
 * Passenger-scoped locale hook: shares locale state with `@auction/web-shared`
 * but returns the passenger text dictionary.
 */
export function useLocale() {
  const { locale, setLocale } = useSharedLocale();
  return { locale, setLocale, txt: PASSENGER_I18N[locale] };
}
