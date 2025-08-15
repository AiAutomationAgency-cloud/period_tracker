// Simple theme hook without complex state management
export type Theme = "dark" | "light" | "system";

export function useTheme() {
  const getTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("lifecycle-ui-theme") as Theme) || "light";
  };

  const setTheme = (theme: Theme) => {
    localStorage.setItem("lifecycle-ui-theme", theme);
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));
  };

  return {
    theme: getTheme(),
    setTheme,
  };
}
