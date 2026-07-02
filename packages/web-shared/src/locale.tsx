import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { SHARED_I18N } from "./i18n";
import type { Locale } from "./i18n";

type SharedTxt = (typeof SHARED_I18N)[Locale];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  txt: SharedTxt;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "ru",
  setLocale: () => {},
  txt: SHARED_I18N.ru,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, txt: SHARED_I18N[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Reads the shared locale state (locale + setter) and the shared text slice
 * (flightTime + seatMap). App-specific text lives in each app's own `locale`
 * module, which wraps this hook and indexes its own dictionary.
 */
export function useLocale() {
  return useContext(LocaleContext);
}
