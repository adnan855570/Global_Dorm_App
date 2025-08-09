// src/hooks/useDarkMode.js
import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Robust dark-mode hook:
 * - Initial: localStorage -> system preference -> light
 * - Applies/removes "dark" on <html>, <body>, and #root (covers stray classes)
 * - Sets color-scheme for native form controls
 * - No flicker (layout effect)
 */
export default function useDarkMode() {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  };

  const [dark, setDark] = useState(getInitial);

  // Apply before paint
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    // Toggle dark class on all common roots
    [html, body, root].forEach((el) => {
      if (!el) return;
      el.classList.toggle("dark", dark);
    });

    // Hint to the browser for native controls
    html.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
}
