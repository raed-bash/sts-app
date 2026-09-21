import { useEffect, useState } from "react";
import { LanguageContext, type Language } from "./LanguageContext";
import i18n from "@/i18n";
import { LocalStorageHelper } from "@/shared/utils";

const LANGUAGE_KEY = "language";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = LocalStorageHelper.getItem(LANGUAGE_KEY);

    return stored === "ar" ? "ar" : "en";
  });

  const changeLanguage = (next: Language) => {
    setLanguage(next);

    LocalStorageHelper.setItem(LANGUAGE_KEY, next);
  };

  useEffect(() => {
    i18n.changeLanguage(language);

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
