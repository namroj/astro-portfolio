import { atom } from "nanostores";
import type { Theme } from "./env";

export const activeTheme = atom<Theme>();