export {};

declare global {
  interface Window {
    google: typeof google;
  }
}

export type Theme = "light" | "dark" | "system";

export type Font =
  | "JetBrains Mono"
  | "Cascadia Code"
  | "Dank Mono"
  | "Fira Code"
  | "Writer";

export interface BreadCrumbProp {
  url: string;
  label: string;
}
