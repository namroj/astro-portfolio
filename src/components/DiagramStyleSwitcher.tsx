import { useEffect, useState } from "preact/hooks";
import "../styles/diagram-style-switcher.css";

type DiagramStyle = "sketch" | "classic";
type DiagramTheme = "site" | "dark" | "forest";

interface Props {
  labels: {
    diagramStyle: string;
    sketch: string;
    classic: string;
    diagramTheme: string;
    matchSite: string;
    darkTheme: string;
    forestTheme: string;
  };
}

const STORAGE_KEY = "diagramStyle";
const THEME_STORAGE_KEY = "diagramTheme";

const applyDiagramStyle = (style: DiagramStyle) => {
  document.documentElement.dataset.mermaidLook =
    style === "classic" ? "classic" : "handDrawn";
};

const applyDiagramTheme = (theme: DiagramTheme) => {
  document.documentElement.dataset.mermaidTheme = theme;
};

const DiagramStyleSwitcher = ({ labels }: Props) => {
  const [style, setStyle] = useState<DiagramStyle>("classic");
  const [theme, setTheme] = useState<DiagramTheme>("site");

  useEffect(() => {
    const storedStyle = localStorage.getItem(STORAGE_KEY);
    const initialStyle = storedStyle === "sketch" ? "sketch" : "classic";
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: DiagramTheme =
      storedTheme === "dark" || storedTheme === "forest" ? storedTheme : "site";
    setStyle(initialStyle);
    applyDiagramStyle(initialStyle);
    setTheme(initialTheme);
    applyDiagramTheme(initialTheme);
  }, []);

  const selectStyle = (nextStyle: DiagramStyle) => {
    setStyle(nextStyle);
    localStorage.setItem(STORAGE_KEY, nextStyle);
    applyDiagramStyle(nextStyle);
  };

  const selectTheme = (nextTheme: DiagramTheme) => {
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyDiagramTheme(nextTheme);
  };

  return (
    <div class="diagram-style-switcher">
      <span class="diagram-style-label">{labels.diagramStyle}</span>
      <div class="diagram-style-options" role="group" aria-label={labels.diagramStyle}>
        {(["classic", "sketch"] as const).map((option) => (
          <button
            type="button"
            class={`diagram-style-btn ${style === option ? "active" : ""}`}
            aria-pressed={style === option}
            onClick={() => selectStyle(option)}
          >
            {labels[option]}
          </button>
        ))}
      </div>
      <span class="diagram-style-label">{labels.diagramTheme}</span>
      <div class="diagram-style-options" role="group" aria-label={labels.diagramTheme}>
        {(["site", "dark", "forest"] as const).map((option) => {
          const optionLabel = {
            site: labels.matchSite,
            dark: labels.darkTheme,
            forest: labels.forestTheme,
          }[option];
          return (
            <button
              type="button"
              class={`diagram-style-btn ${theme === option ? "active" : ""}`}
              aria-pressed={theme === option}
              onClick={() => selectTheme(option)}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiagramStyleSwitcher;
