export {};

declare global {
  interface Window {
    google: typeof google;
  }
}

export type Theme = "light" | "dark" | "system";

export interface BreadCrumbProp {
  url: string;
  label: string;
}
