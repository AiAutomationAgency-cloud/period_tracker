import { useEffect, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Initialize theme on mount
    const storedTheme = localStorage.getItem("lifecycle-ui-theme") || "light";
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (storedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(storedTheme);
    }
  }, []);

  return <>{children}</>;
}
