import { atom } from "nanostores";
import type { Theme } from "../types/env";

const getInitialTheme = (): Theme => {
  if (typeof localStorage !== "undefined") {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  }
  return "system";
};

export const activeTheme = atom<Theme>(getInitialTheme());
