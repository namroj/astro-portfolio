// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("system theme subscription", () => {
  it("reads the current preference when subscribing and tracks later changes", async () => {
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
    let prefersDark = true;
    const mediaQuery = {
      get matches() {
        return prefersDark;
      },
      addEventListener: vi.fn((_: string, listener: (event: MediaQueryListEvent) => void) => {
        changeListener = listener;
      }),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList;
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    });

    try {
      const { subscribeToSystemTheme } = await import("../utils/systemTheme");
      const onChange = vi.fn();
      const unsubscribe = subscribeToSystemTheme(onChange);

      expect(onChange).toHaveBeenCalledWith(true);
      prefersDark = false;
      changeListener?.({ matches: false } as MediaQueryListEvent);
      expect(onChange).toHaveBeenLastCalledWith(false);

      unsubscribe();
      expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });
});
