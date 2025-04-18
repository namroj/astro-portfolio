import { atom } from "nanostores";

// Store for line number visibility state
export const showLineNumbers = atom<boolean>(true); // Default to showing line numbers