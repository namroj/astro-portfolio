export function initializePreferences() {
  const trigger = document.getElementById("preferences-toggle-btn");
  const panel = document.getElementById("preferences");
  if (!trigger || !panel || trigger.dataset.initialized) return;
  trigger.dataset.initialized = "true";
  const setOpen = (open: boolean, restoreFocus = false) => {
    panel.inert = !open;
    panel.setAttribute("aria-hidden", String(!open));
    panel.classList.toggle("active", open);
    trigger.classList.toggle("active", open);
    trigger.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    else if (restoreFocus) trigger.focus({ preventScroll: true });
  };
  trigger.addEventListener("click", () => setOpen(panel.inert, !panel.inert));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.inert) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener("click", event => {
    const target = event.target as Node;
    if (!panel.inert && !panel.contains(target) && !trigger.contains(target)) setOpen(false);
  });
}
initializePreferences();
document.addEventListener("astro:page-load", initializePreferences);
