import { atom } from "nanostores";
import type { Font } from "../types/env";

const getInitialFont = (): Font => {
  if (typeof localStorage !== "undefined") {
    return (localStorage.getItem("font") as Font) ?? "JetBrains Mono";
  }
  return "JetBrains Mono";
};

export const activeFont = atom<Font>(getInitialFont());
