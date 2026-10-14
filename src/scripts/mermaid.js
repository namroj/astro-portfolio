const mermaidUrl =
  "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs";

let mermaidPromise;
let diagramId = 0;
let isRendering = false;
let themeObserver;

function getDiagramSource(code) {
  const lines = [...code.querySelectorAll(":scope > .line")];
  return lines.length
    ? lines.map((line) => line.textContent).join("\n")
    : code.textContent.trim();
}

function getMermaidConfig() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const color = (name, fallback) =>
    styles.getPropertyValue(name).trim() || fallback;

  const theme = root.dataset.mermaidTheme;
  const themeName = theme === "dark" ? "dark" : theme === "forest" ? "forest" : "base";

  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: themeName,
    look: root.dataset.mermaidLook === "classic" ? "classic" : "handDrawn",
    handDrawnSeed: 7,
    flowchart: {
      wrappingWidth: 110,
      htmlLabels: false,
      useMaxWidth: false,
    },
    themeVariables: themeName === "base" ? {
      darkMode: root.dataset.theme === "dark",
      background: color("--background-color", "#251e37"),
      primaryColor: color("--background-color", "#251e37"),
      primaryTextColor: color("--foreground-color", "#ccd6f6"),
      primaryBorderColor: color("--accent-color", "#b066f5"),
      lineColor: color("--accent-color", "#b066f5"),
      secondaryColor: color("--border-color", "#40364d"),
      tertiaryColor: color("--background-color", "#251e37"),
      textColor: color("--foreground-color", "#ccd6f6"),
      edgeLabelBackground: color("--background-color", "#251e37"),
      fontFamily: color("--main-font", "sans-serif"),
    } : undefined,
  };
}

function getMermaid() {
  mermaidPromise ??= import(/* @vite-ignore */ mermaidUrl).then(
    (module) => module.default,
  );
  return mermaidPromise;
}

async function renderDiagram(mermaid, figure) {
  const output = figure.querySelector(".mermaid-output");
  const generation = Number(figure.dataset.generation || 0) + 1;
  figure.dataset.generation = String(generation);

  try {
    const { svg, bindFunctions } = await mermaid.render(
      `blog-mermaid-${++diagramId}`,
      figure.dataset.mermaidSource,
    );
    if (figure.dataset.generation !== String(generation)) return;
    output.innerHTML = svg;
    const renderedSvg = output.querySelector("svg");
    if (renderedSvg) {
      renderedSvg.removeAttribute("width");
      renderedSvg.removeAttribute("height");
      renderedSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    bindFunctions?.(output);
    return true;
  } catch (error) {
    console.error("Unable to render Mermaid diagram:", error);
    return false;
  }
}

async function renderDiagrams() {
  if (isRendering) return;
  const blocks = [...document.querySelectorAll('pre[data-language="mermaid"]')];
  if (!blocks.length) return;

  isRendering = true;
  try {
    const mermaid = await getMermaid();
    mermaid.initialize(getMermaidConfig());

    for (const pre of blocks) {
      if (pre.dataset.mermaidRendered === "true") continue;
      const code = pre.querySelector("code");
      if (!code) continue;

      const figure = document.createElement("figure");
      figure.className = "mermaid-diagram";
      figure.dataset.mermaidSource = getDiagramSource(code);

      const output = document.createElement("div");
      output.className = "mermaid-output";
      output.setAttribute("aria-label", "Rendered Mermaid diagram");
      figure.append(output);

      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = document.documentElement.lang === "es"
        ? "Ver código del diagrama"
        : "View diagram source";
      details.append(summary, pre.cloneNode(true));
      figure.append(details);

      pre.dataset.mermaidRendered = "true";
      pre.replaceWith(figure);
      if (!(await renderDiagram(mermaid, figure))) details.open = true;
    }

    if (!themeObserver) {
      themeObserver = new MutationObserver(async (mutations) => {
        if (!mutations.some((mutation) =>
          ["data-theme", "data-mermaid-look", "data-mermaid-theme"].includes(mutation.attributeName)
        )) {
          return;
        }
        mermaid.initialize(getMermaidConfig());
        for (const figure of document.querySelectorAll(
          "figure.mermaid-diagram[data-mermaid-source]",
        )) {
          await renderDiagram(mermaid, figure);
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-mermaid-look", "data-mermaid-theme"],
      });
    }
  } catch (error) {
    // Leave the original Mermaid source visible if the renderer cannot load.
    console.error("Unable to load Mermaid diagrams:", error);
  } finally {
    isRendering = false;
  }
}

document.addEventListener("astro:page-load", renderDiagrams);
document.addEventListener("DOMContentLoaded", renderDiagrams);
