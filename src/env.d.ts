export {};

declare global {
  interface Window {
    google: typeof google;
  }
}

export type Theme = "light" | "dark" | "system";

export type Font =
  | "Cascadia Code"
  | "DankMono"
  | "Fira Code"
  | "Writter"
  | "JetBrains Mono";

export interface BreadCrumbProp {
  url: string;
  label: string;
}
