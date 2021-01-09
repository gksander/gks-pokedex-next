import * as React from "react";

type PrefersDarkModeContainerProps = {};

export const PrefersDarkModeContainer: React.FC<PrefersDarkModeContainerProps> = ({
  children,
}) => {
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(
    process.browser
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (evt: MediaQueryListEvent) =>
      setPrefersDarkMode(evt.matches);

    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return (
    <PrefersDarkModeContext.Provider value={prefersDarkMode}>
      {children}
    </PrefersDarkModeContext.Provider>
  );
};

const PrefersDarkModeContext = React.createContext(false);
export const usePrefersDarkMode = () =>
  React.useContext(PrefersDarkModeContext);
