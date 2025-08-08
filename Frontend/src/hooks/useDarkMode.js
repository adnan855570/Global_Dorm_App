import { useState, useEffect } from "react";

/**
 * useDarkMode
 * 
 * Custom React hook for toggling dark mode (light/dark theme) and persisting preference in localStorage.
 * Adds/removes "dark" class to the <html> tag for Tailwind support and sets color scheme for native UI.
 *
 * @returns [dark, setDark] - boolean state, and setter function for toggling.
 */
export default function useDarkMode() {
  // Initialize state based on localStorage value (default: light)
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false; // SSR safety
    return localStorage.getItem("theme") === "dark";
  });

  // Side effect: Update <html> class and localStorage whenever "dark" changes
  useEffect(() => {
    // (Tiny delay for Tailwind + SSR compatibility)
    setTimeout(() => {
      if (dark) {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
        localStorage.setItem("theme", "light");
      }
    }, 1);
  }, [dark]);

  // Return current mode and setter
  return [dark, setDark];
}
