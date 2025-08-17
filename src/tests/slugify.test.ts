import { describe, it, expect } from "vitest";
import { slugify } from "../utils/slugify.ts";

describe("slugify function", () => {
  it("should handle accented characters", () => {
    expect(slugify("patrón de diseño")).toBe("patron-de-diseno");
    expect(slugify("Programación Orientada a Objetos")).toBe(
      "programacion-orientada-a-objetos"
    );
    expect(slugify("¡Hola Mundo!")).toBe("hola-mundo");
  });

  it("should convert to lowercase", () => {
    expect(slugify("JavaScript")).toBe("javascript");
  });

  it("should remove special characters", () => {
    expect(slugify("React.js")).toBe("reactjs");
    expect(slugify("C++")).toBe("c");
    expect(slugify("Node.js & Express")).toBe("nodejs-express");
  });

  it("should retain underscores", () => {
    expect(slugify("under_score value")).toBe("under_score-value");
    expect(slugify("__init__")).toBe("__init__");
  });

  it("should trim spaces", () => {
    expect(slugify("  spaces  ")).toBe("spaces");
  });

  it("should handle empty strings", () => {
    expect(slugify("")).toBe("");
  });

  it("should handle strings with only special characters", () => {
    expect(slugify("!@#$%^&*()")).toBe("");
  });

  it("should handle multiple hyphens", () => {
    expect(slugify("multiple---hyphens")).toBe("multiple-hyphens");
  });

  it("should trim hyphens from start and end", () => {
    expect(slugify("-trim-hyphens-")).toBe("trim-hyphens");
  });
});
