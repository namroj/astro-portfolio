// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  document.head.innerHTML = "";
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("Google Maps loader", () => {
  it("uses Google's async callback loader and requests maps and marker libraries once", async () => {
    const importLibrary = vi.fn(async (name: string) => ({ name }));
    vi.stubGlobal("google", undefined);

    const { loadGoogleMaps } = await import("../utils/googleMapsLoader");
    const firstLoad = loadGoogleMaps("test-key");
    const secondLoad = loadGoogleMaps("test-key");
    const script = document.querySelector<HTMLScriptElement>("script")!;

    expect(script.src).toContain("loading=async");
    expect(script.src).toContain("callback=__portfolioGoogleMapsReady");
    expect(script.onload).toBeNull();
    expect(document.querySelectorAll("script")).toHaveLength(1);

    vi.stubGlobal("google", { maps: { importLibrary } });
    (window as Window & { __portfolioGoogleMapsReady?: () => void })
      .__portfolioGoogleMapsReady?.();

    await expect(firstLoad).resolves.toEqual({
      maps: { name: "maps" },
      marker: { name: "marker" },
    });
    await expect(secondLoad).resolves.toEqual({
      maps: { name: "maps" },
      marker: { name: "marker" },
    });
    expect(importLibrary.mock.calls).toEqual([["maps"], ["marker"]]);
  });

  it("rejects a failed script load instead of leaving map initialization pending", async () => {
    vi.stubGlobal("google", undefined);

    const { loadGoogleMaps } = await import("../utils/googleMapsLoader");
    const load = loadGoogleMaps("test-key");
    const script = document.querySelector<HTMLScriptElement>("script")!;

    script.onerror?.(new Event("error"));

    await expect(load).rejects.toThrow("Unable to load Google Maps");
  });
});
