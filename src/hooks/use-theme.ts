import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = stored === "dark" || (!stored && preferredDark) ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  };

  return { theme, toggleTheme, mounted };
}
