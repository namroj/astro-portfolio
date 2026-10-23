import { expect, it } from "vitest";
import { getMapColorScheme } from "../utils/googleMapColorScheme";

it("selects the matching Maps color scheme for each portfolio theme", () => {
  expect(getMapColorScheme("light")).toBe("LIGHT");
  expect(getMapColorScheme("dark")).toBe("DARK");
});
