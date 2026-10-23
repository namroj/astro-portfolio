import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const loadStyle = (theme: "light" | "dark") =>
  JSON.parse(
    readFileSync(
      new URL(`../assets/map-themes/${theme}.cloud.json`, import.meta.url),
      "utf8",
    ),
  );

const luminance = (hex: string) =>
  [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (value, channel, index) =>
        value + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );

const contrast = (first: string, second: string) => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

describe("Google Cloud map styles", () => {
  it.each([
    ["light", "#f8f9fa", "#495057", "#6d28d9"],
    ["dark", "#251e37", "#ccd6f6", "#b066f5"],
  ] as const)(
    "uses the site's %s palette in a native style object",
    (theme, background, foreground, accent) => {
      const style = loadStyle(theme);

      expect(style).toMatchObject({
        variant: theme,
        backgroundColor: background,
        styles: expect.any(Array),
      });
      expect(style.styles.length).toBeGreaterThan(0);
      expect(style.styles).toContainEqual(
        expect.objectContaining({
          id: "natural.water",
          label: expect.objectContaining({ textFillColor: foreground }),
        }),
      );
      expect(style.styles).toContainEqual(
        expect.objectContaining({
          id: "pointOfInterest",
          label: expect.objectContaining({ pinFillColor: accent }),
        }),
      );
      expect(
        style.styles.every(
          (rule: { id?: string }) => typeof rule.id === "string",
        ),
      ).toBe(true);
    },
  );

  it("makes light forests and parks distinct from surrounding land", () => {
    const { styles } = loadStyle("light");
    const fill = (id: string) =>
      styles.find((rule: { id: string }) => rule.id === id).geometry.fillColor;
    const land = fill("natural.land");

    expect(luminance(fill("natural.land.landCover.forest"))).toBeGreaterThan(
      luminance("#c0e1c6"),
    );
    expect(luminance(fill("pointOfInterest.recreation.park"))).toBeGreaterThan(
      luminance("#d5ecda"),
    );
    expect(
      contrast(land, fill("natural.land.landCover.forest")),
    ).toBeGreaterThan(1.2);
    expect(
      contrast(land, fill("pointOfInterest.recreation.park")),
    ).toBeGreaterThan(1.1);
  });
});
