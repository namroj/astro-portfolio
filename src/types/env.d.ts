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

export type BreadCrumb = {
  url: string;
  label: string;
};

export type JobPosition = {
  title: string;
  description: string;
  highlight: string;
  interval: string;
};
