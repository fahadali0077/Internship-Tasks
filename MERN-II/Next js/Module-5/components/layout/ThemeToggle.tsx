"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Render a placeholder until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border" />
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? <Moon size={16} /> :
      theme === "light" ? <Sun size={16} /> :
        <Monitor size={16} />;

  const label =
    theme === "dark" ? "Switch to system theme" :
      theme === "light" ? "Switch to dark mode" :
        "Switch to light mode";

  return (
    <button
      onClick={cycle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink-muted transition-all hover:-translate-y-0.5 hover:border-amber hover:text-amber dark:border-dark-border dark:bg-dark-surface dark:text-ink-muted dark:hover:text-amber"
      aria-label={label}
      title={`Current: ${theme ?? "system"}`}
    >
      {icon}
    </button>
  );
}
