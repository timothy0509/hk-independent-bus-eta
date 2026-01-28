import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { ColorMode } from "../../data";

interface ThemeContextValue {
  colorMode: "light" | "dark";
  themeMode: ColorMode;
  setThemeMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ColorMode;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "colorMode",
}: ThemeProviderProps) => {
  const [themeMode, setThemeModeState] = useState<ColorMode>(() => {
    const stored = localStorage.getItem(storageKey) as ColorMode | null;
    return stored || defaultTheme;
  });

  const [colorMode, setColorMode] = useState<"light" | "dark">(() => {
    const initialMode = localStorage.getItem(storageKey) as ColorMode | null;
    return calculateColorMode(initialMode || defaultTheme);
  });

  const calculateColorMode = useCallback(
    (mode: ColorMode): "light" | "dark" => {
      if (mode === "light" || mode === "dark") {
        return mode;
      }
      if (
        (window as any).systemColorScheme?.value &&
        ["light", "dark"].includes((window as any).systemColorScheme?.value)
      ) {
        return (window as any).systemColorScheme?.value;
      }
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    },
    []
  );

  const applyTheme = useCallback(
    (mode: ColorMode) => {
      const resolvedColorMode = calculateColorMode(mode);
      setColorMode(resolvedColorMode);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedColorMode);

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "color-mode",
          value: resolvedColorMode,
        })
      );

      if (typeof (window as any).harmonyBridger !== "undefined") {
        (window as any).harmonyBridger.setTheme(resolvedColorMode);
      }
    },
    [calculateColorMode]
  );

  useEffect(() => {
    const storedMode = localStorage.getItem(storageKey) as ColorMode | null;
    const initialMode = storedMode || defaultTheme;
    applyTheme(initialMode);
  }, [defaultTheme, storageKey, applyTheme]);

  useEffect(() => {
    if (themeMode === "system") {
      const handleSystemThemeChange = () => {
        applyTheme(themeMode);
      };

      const mql = window.matchMedia("(prefers-color-scheme: light)");
      mql.addEventListener("change", handleSystemThemeChange);

      const systemCallbacks = (window as any).systemColorSchemeCallbacks;
      if (Array.isArray(systemCallbacks)) {
        systemCallbacks.push(handleSystemThemeChange);
      }

      return () => {
        mql.removeEventListener("change", handleSystemThemeChange);
        if (Array.isArray((window as any).systemColorSchemeCallbacks)) {
          (window as any).systemColorSchemeCallbacks = (
            window as any
          ).systemColorSchemeCallbacks.filter(
            (cb: any) => cb !== handleSystemThemeChange
          );
        }
      };
    }
  }, [themeMode, applyTheme]);

  const setThemeMode = useCallback(
    (mode: ColorMode) => {
      setThemeModeState(mode);
      localStorage.setItem(storageKey, mode);
      applyTheme(mode);
    },
    [storageKey, applyTheme]
  );

  const toggleColorMode = useCallback(() => {
    const prevMode = themeMode;
    let newMode: ColorMode = "dark";
    switch (prevMode) {
      case "dark":
        newMode = "light";
        break;
      case "light":
        newMode = "system";
        break;
      default:
        newMode = "dark";
        break;
    }
    setThemeMode(newMode);
  }, [themeMode]);

  const value: ThemeContextValue = {
    colorMode,
    themeMode,
    setThemeMode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
