import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";
import { activeFont } from "../stores/activeFontStore.ts";
import type { Font } from "../types/env";
import "../styles/font-switcher.css";

const FontSwitcher = () => {
  const font = useStore(activeFont); // Subscribes to the current font state
  const [preferredFont, setPreferredFont] = useState<Font>("JetBrains Mono");

  const handleFontChange = (selectedFont: Font) => {
    activeFont.set(selectedFont); // Update the state
    localStorage.setItem("font", selectedFont); // Save to localStorage
    setPreferredFont(selectedFont);

    document.documentElement.style.setProperty("--main-font", selectedFont);
    document.documentElement.style.setProperty("--code-font", selectedFont);
  };

  useEffect(() => {
    const storedFont = (localStorage.getItem("font") ??
      "JetBrains Mono") as Font;

    activeFont.set(storedFont);
    setPreferredFont(storedFont);

    // Apply the stored font
    document.documentElement.style.setProperty("--main-font", storedFont);
    document.documentElement.style.setProperty("--code-font", storedFont);
  }, []);

  return (
    <div class="font-switcher">
      {/* JetBrains Mono Button */}
      <button
        class={`font-btn jetbrains-mono ${preferredFont === "JetBrains Mono" ? "active" : ""}`}
        onClick={() => handleFontChange("JetBrains Mono")}
        title="JetBrains Mono"
      >
        J
      </button>

      {/* Cascadia Code Button */}
      <button
        class={`font-btn cascadia-code ${preferredFont === "Cascadia Code" ? "active" : ""}`}
        onClick={() => handleFontChange("Cascadia Code")}
        title="Cascadia Code"
      >
        C
      </button>

      {/* Dank Mono Button */}
      <button
        class={`font-btn dank-mono ${preferredFont === "Dank Mono" ? "active" : ""}`}
        onClick={() => handleFontChange("Dank Mono")}
        title="Dank Mono"
      >
        D
      </button>

      {/* Fira Code Button */}
      <button
        class={`font-btn fira-code ${preferredFont === "Fira Code" ? "active" : ""}`}
        onClick={() => handleFontChange("Fira Code")}
        title="Fira Code"
      >
        F
      </button>

      {/* Writer Button */}
      <button
        class={`font-btn writer ${font === "Writer" ? "active" : ""}`}
        onClick={() => handleFontChange("Writer")}
        title="Wrtter"
      >
        W
      </button>
    </div>
  );
};

export default FontSwitcher;
