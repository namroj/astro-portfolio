import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";
import { activeTheme } from "../stores/activeThemeStore.ts";
import type { Theme } from "../types/env";
import "../styles/theme-switcher.css";

const ThemeSwitcher = () => {
  const theme = useStore(activeTheme); // Subscribes to the current theme state
  const [preferredTheme, setPreferredTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) ?? "system";
    setPreferredTheme(savedTheme);
    if (savedTheme !== theme) {
      activeTheme.set(savedTheme);
    }
  }, []);

  // Function to handle the theme change
  const handleThemeChange = (selectedTheme: Theme) => {
    activeTheme.set(selectedTheme); // Update the state
    localStorage.setItem("theme", selectedTheme); // Save to localStorage
    setPreferredTheme(selectedTheme);

    if (selectedTheme === "system") {
      // Apply system theme
      const preferredColorScheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches
        ? "dark"
        : "light";
      document.documentElement.setAttribute("data-theme", preferredColorScheme);
    } else {
      // Apply explicit theme
      document.documentElement.setAttribute("data-theme", selectedTheme);
    }
  };

  useEffect(() => {
    if (theme === "system") {
      const updateSystemTheme = () => {
        const preferredColorScheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
        document.documentElement.setAttribute(
          "data-theme",
          preferredColorScheme,
        );
      };

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateSystemTheme);

      updateSystemTheme();

      return () => mediaQuery.removeEventListener("change", updateSystemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [preferredTheme]);

  return (
    <div class="theme-switcher">
      {/* Light Theme Button */}
      <button
        class={`btn light ${preferredTheme === "light" ? "active" : ""}`}
        onClick={() => handleThemeChange("light")}
      >
        <svg
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="sun"
            fill-rule="evenodd"
            d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"
          ></path>
        </svg>
      </button>

      {/* Dark Theme Button */}
      <button
        class={`btn dark ${preferredTheme === "dark" ? "active" : ""}`}
        onClick={() => handleThemeChange("dark")}
      >
        <svg
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="moon"
            fill-rule="evenodd"
            d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"
          ></path>
        </svg>
      </button>

      {/* System Theme Button */}
      <button
        class={`btn system ${preferredTheme === "system" ? "active" : ""}`}
        onClick={() => handleThemeChange("system")}
      >
        <svg
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="system"
            fill-rule="evenodd"
            d="M6 4a2 2 0 00-2 2v8l-1 3h18l-1-3V6a2 2 0 00-2-2H6zm0 1h12a1 1 0 011 1v7H5V6a1 1 0 011-1zm-2.25 9h16.5l.75 2H3l.75-2zm5.25 3h4v1h-4v-1z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
