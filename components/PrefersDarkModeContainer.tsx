import * as React from "react";

type PrefersDarkModeContainerProps = {};

export const PrefersDarkModeContainer: React.FC<PrefersDarkModeContainerProps> = ({
  children,
}) => {
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(() => {
    if (!process.browser) return false;

    const storedValue = localStorage.getItem(STORAGE_KEY);
    return storedValue
      ? JSON.parse(storedValue)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (prefersDarkMode) {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [prefersDarkMode]);

  const toggleDarkMode = React.useCallback(() => {
    setPrefersDarkMode(!prefersDarkMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(!prefersDarkMode));
  }, [prefersDarkMode]);

  return (
    <PrefersDarkModeContext.Provider
      value={{
        prefersDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </PrefersDarkModeContext.Provider>
  );
};

const PrefersDarkModeContext = React.createContext({
  prefersDarkMode: false,
  toggleDarkMode: (() => null) as (boolean) => void,
});
export const usePrefersDarkMode = () =>
  React.useContext(PrefersDarkModeContext);

const STORAGE_KEY = "GKS_POKEDEX_PREFERS_DARK";
