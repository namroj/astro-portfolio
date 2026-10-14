// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { render } from "preact";
import { act } from "preact/test-utils";
import LineNumberToggle from "../components/LineNumberToggle";
import { initializePreferences } from "../scripts/preferences";

afterEach(() => {
  render(null, document.body);
  document.body.innerHTML = "";
  localStorage.clear();
  document.documentElement.classList.remove("hide-line-numbers");
});

it("opens the panel, restores focus on Escape, and preserves outside-click focus", () => {
  document.body.innerHTML = '<button id="preferences-toggle-btn"></button><aside id="preferences"><button>Theme</button></aside><button id="outside">Outside</button>';
  const panel = document.getElementById("preferences")!;
  panel.inert = true;
  const trigger = document.getElementById("preferences-toggle-btn")!;
  initializePreferences();
  trigger.click();
  expect(panel.inert).toBe(false);
  expect(document.activeElement).toBe(panel.querySelector("button"));
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  expect(panel.inert).toBe(true);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
  trigger.click();
  const outside = document.getElementById("outside")!;
  outside.focus();
  outside.click();
  expect(panel.inert).toBe(true);
  expect(document.activeElement).toBe(outside);
});

it("restores hidden line numbers consistently and persists the next toggle", async () => {
  localStorage.setItem("showLineNumbers", "false");
  await act(async () => { render(<LineNumberToggle label="Show line numbers" />, document.body); });
  const button = document.querySelector('button')!;
  await vi.waitFor(() => expect(button.getAttribute("aria-checked")).toBe("false"));
  expect(document.documentElement.classList.contains("hide-line-numbers")).toBe(true);
  act(() => button.click());
  await vi.waitFor(() => expect(button.getAttribute("aria-checked")).toBe("true"));
  expect(localStorage.getItem("showLineNumbers")).toBe("true");
  expect(document.documentElement.classList.contains("hide-line-numbers")).toBe(false);
});
