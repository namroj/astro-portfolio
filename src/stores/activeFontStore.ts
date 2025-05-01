import { atom } from "nanostores";
import type { Font } from "../types/env";

let initialFont: Font = "JetBrains Mono";
if (typeof window !== "undefined") {
  initialFont = (localStorage.getItem("font") ?? "JetBrains Mono") as Font;
}

export const activeFont = atom<Font>(initialFont);
