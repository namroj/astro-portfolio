import { atom } from "nanostores";

let initialShowLineNumbers: boolean = true;
if (typeof window !== "undefined") {
  initialShowLineNumbers =
    (localStorage.getItem("showLineNumbers") as unknown as boolean) ?? true;
}

// Store for line number visibility state
export const showLineNumbers = atom<boolean>(initialShowLineNumbers);
