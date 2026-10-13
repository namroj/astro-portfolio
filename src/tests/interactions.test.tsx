// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "preact";
import { act } from "preact/test-utils";
import Search from "../components/Search";

afterEach(() => {
  render(null, document.body);
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("static portfolio filtering", () => {
  it("paginates, filters across all pages, and resets without a server request", async () => {
    document.body.innerHTML = `<section data-filter-list><input data-filter-query><button data-filter-tag="Java">Java</button><button data-filter-reset>Clear</button><p data-filter-empty hidden></p><div data-filter-pagination hidden><button data-filter-prev>Previous</button><span data-filter-count></span><button data-filter-next>Next</button></div>${Array.from({ length: 27 }, (_, i) => `<article data-filter-item data-tags="${i === 24 ? "Java" : "React"}">${i === 24 ? "Programación Java" : "Course " + i}</article>`).join("")}</section>`;
    await import("../scripts/filter");
    const visible = () =>
      [...document.querySelectorAll<HTMLElement>("[data-filter-item]")].filter(
        (e) => !e.hidden,
      );
    expect(visible()).toHaveLength(10);
    (document.querySelector("[data-filter-next]") as HTMLElement).click();
    expect(document.querySelector("[data-filter-count]")!.textContent).toBe(
      "2 / 3",
    );
    const input = document.querySelector("input")!;
    input.value = "programacion";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(visible()).toHaveLength(1);
    expect(visible()[0].textContent).toContain("Java");
    (document.querySelector("[data-filter-reset]") as HTMLElement).click();
    expect(visible()).toHaveLength(10);
    expect(input.value).toBe("");
    (document.querySelector("[data-filter-tag]") as HTMLElement).click();
    expect(visible()).toHaveLength(1);
    input.value = "missing";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(visible()).toHaveLength(0);
    expect(
      (document.querySelector("[data-filter-empty]") as HTMLElement).hidden,
    ).toBe(false);
  });
});

describe("global search controls", () => {
  it("loads the localized index, opens with the keyboard, finds projects, and closes with Escape", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "daza",
            type: "project",
            url: "/en/projects/#daza",
            title: "Daza Real Estate",
            description: "Property website",
            content: "",
            tags: ["React"],
          },
        ],
      });
    vi.stubGlobal("fetch", fetch);
    act(() => render(<Search locale="en" />, document.body));
    await vi.waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/en/search.json", expect.anything()),
    );
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });
    const input = document.querySelector("input")!;
    expect(document.activeElement).toBe(input);
    act(() => {
      input.value = "daza";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(
      document.querySelector('[role="option"] a')!.getAttribute("href"),
    ).toBe("/en/projects/#daza");
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
  it("offers a working retry after the search index fails to load", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetch);
    act(() => render(<Search locale="en" />, document.body));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await act(async () => {
      await Promise.resolve();
    });
    act(() => document.querySelector("input")!.focus());
    const retry = [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "Retry",
    )!;
    expect(retry).toBeTruthy();
    act(() => retry.click());
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await act(async () => {
      await Promise.resolve();
    });
    expect(document.body.textContent).not.toContain("Search could not load");
  });
});
