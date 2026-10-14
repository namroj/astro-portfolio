import { useEffect, useState } from "preact/hooks";
import { activeFont } from "../stores/activeFontStore.ts";
import type { Font } from "../types/env";
import "../styles/font-switcher.css";

const fonts: Font[] = ["JetBrains Mono", "Cascadia Code", "Dank Mono", "Fira Code", "Writer"];
const applyFont = (font: Font) => {
  activeFont.set(font);
  document.documentElement.style.setProperty("--main-font", `"${font}", monospace`);
  document.documentElement.style.setProperty("--code-font", `"${font}", monospace`);
};

export default function FontSwitcher() {
  const [font, setFont] = useState<Font>("JetBrains Mono");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("font"); } catch {}
    const initial = fonts.includes(saved as Font) ? saved as Font : fonts[0];
    setFont(initial);
    applyFont(initial);
  }, []);
  const select = (next: Font) => {
    setFont(next);
    applyFont(next);
    try { localStorage.setItem("font", next); } catch {}
  };
  return <div class="font-switcher">
    {fonts.map(option => <button type="button" class={`font-btn ${font === option ? "active" : ""}`}
      aria-pressed={font === option} onClick={() => select(option)}>{option}</button>)}
  </div>;
}
