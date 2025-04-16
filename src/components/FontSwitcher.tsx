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

  // Synchronize the font on component mount
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
      {/* Cascadia Code Button */}
      <button
        class={`font-btn cascadia ${font === "Cascadia Code" ? "active" : ""}`}
        onClick={() => handleFontChange("Cascadia Code")}
        title="Cascadia Code"
      >
        C
      </button>

      {/* DankMono Button */}
      <button
        class={`font-btn dankmono ${font === "DankMono" ? "active" : ""}`}
        onClick={() => handleFontChange("DankMono")}
        title="DankMono"
      >
        D
      </button>

      {/* Fira Code Button */}
      <button
        class={`font-btn firacode ${font === "Fira Code" ? "active" : ""}`}
        onClick={() => handleFontChange("Fira Code")}
        title="Fira Code"
      >
        F
      </button>

      {/* Writter Button */}
      <button
        class={`font-btn writter ${font === "Writter" ? "active" : ""}`}
        onClick={() => handleFontChange("Writter")}
        title="Writter"
      >
        W
      </button>

      {/* JetBrains Mono Button */}
      <button
        class={`font-btn jetbrains ${font === "JetBrains Mono" ? "active" : ""}`}
        onClick={() => handleFontChange("JetBrains Mono")}
        title="JetBrains Mono"
      >
        J
      </button>
    </div>
  );
};

export default FontSwitcher;
