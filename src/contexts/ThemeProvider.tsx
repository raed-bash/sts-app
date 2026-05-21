import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const darkMode = localStorage.darkMode;

    if (darkMode) {
      return darkMode === "1";
    }

    LocalStorageHelper.setItem("darkMode", "0");

    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode((darkMode) => !darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");

      LocalStorageHelper.setItem("darkMode", "1");
    } else {
      document.documentElement.classList.remove("dark");

      LocalStorageHelper.setItem("darkMode", "0");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
