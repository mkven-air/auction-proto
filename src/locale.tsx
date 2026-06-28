import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { I18N } from "./i18n";
import type { Locale } from "./i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  txt: (typeof I18N)[Locale];
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "ru",
  setLocale: () => {},
  txt: I18N.ru,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, txt: I18N[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
