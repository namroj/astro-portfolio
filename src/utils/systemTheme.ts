export function subscribeToSystemTheme(
  onChange: (prefersDark: boolean) => void,
): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const update = () => onChange(mediaQuery.matches);

  update();
  mediaQuery.addEventListener("change", update);

  return () => mediaQuery.removeEventListener("change", update);
}
