export function rehypeExternalLinks({ siteOrigin }) {
  return (tree) => {
    function visit(node) {
      if (node.type === "element" && node.tagName === "a") {
        const href = node.properties?.href;
        if (typeof href === "string") {
          let url;
          try {
            url = new URL(href, siteOrigin);
          } catch {
            url = undefined;
          }

          if (
            url &&
            (url.protocol === "https:" || url.protocol === "http:") &&
            url.origin !== siteOrigin
          ) {
            node.properties.target = "_blank";
            const existingRel = node.properties.rel;
            const rel = new Set(
              Array.isArray(existingRel)
                ? existingRel
                : typeof existingRel === "string"
                  ? existingRel.split(/\s+/)
                  : [],
            );
            rel.add("noopener");
            rel.add("noreferrer");
            node.properties.rel = [...rel];
          }
        }
      }

      for (const child of node.children ?? []) visit(child);
    }

    visit(tree);
  };
}
