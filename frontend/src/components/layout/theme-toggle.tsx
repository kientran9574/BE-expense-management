"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

// The inline script in the root layout owns the class before hydration; this only reads it.
const isDarkNow = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => false);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    for (const listener of listeners) listener();
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Đổi giao diện sáng/tối">
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}
