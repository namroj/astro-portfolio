import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";
import { activeFont } from "../stores/activeFontStore.ts";
import type { Font } from "../env";
import "../styles/font-switcher.css";

const FontSwitcher = () => {
  const font = useStore(activeFont); // Subscribes to the current font state

  // Function to handle the font change
  const handleFontChange = (selectedFont: Font) => {
    activeFont.set(selectedFont); // Update the state
    localStorage.setItem("font", selectedFont); // Save to localStorage

    // Apply the font
    document.documentElement.style.setProperty("--main-font", selectedFont);
    document.documentElement.style.setProperty("--code-font", selectedFont);
  };

  // Synchronize the font on the component mount
  useEffect(() => {
    // Get the stored font from localStorage
    const storedFont = (localStorage.getItem("font") ||
      "Cascadia Code") as Font;

    // Set the initial font
    activeFont.set(storedFont);

    // Apply the stored font
    document.documentElement.style.setProperty("--main-font", storedFont);
    document.documentElement.style.setProperty("--code-font", storedFont);
  }, []); // Runs only once on mount

  return (
    <div class="font-switcher">
      {/* JetBrains Mono Button */}
      <button
        class={`font-btn jetbrains-mono ${font === "JetBrains Mono" ? "active" : ""}`}
        onClick={() => handleFontChange("JetBrains Mono")}
        title="JetBrains Mono"
      >
        J
      </button>

      {/* Cascadia Code Button */}
      <button
        class={`font-btn cascadia-code ${font === "Cascadia Code" ? "active" : ""}`}
        onClick={() => handleFontChange("Cascadia Code")}
        title="Cascadia Code"
      >
        C
      </button>

      {/* Dank Mono Button */}
      <button
        class={`font-btn dank-mono ${font === "Dank Mono" ? "active" : ""}`}
        onClick={() => handleFontChange("Dank Mono")}
        title="Dank Mono"
      >
        D
      </button>

      {/* Fira Code Button */}
      <button
        class={`font-btn fira-code ${font === "Fira Code" ? "active" : ""}`}
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
