import { createContext, useContext } from "react";

export const LANGUAGES = ["en", "ar"] as const;

export type Language = (typeof LANGUAGES)[number];

export type LanguageContextType = {
  language: Language;
  changeLanguage: (language: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
});

export const useLanguageContext = () => useContext(LanguageContext);
