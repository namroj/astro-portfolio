import { atom } from "nanostores";
import type { Font } from "../env";

export const activeFont = atom<Font>();