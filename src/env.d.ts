export {};

declare global {
  interface Window {
    google: typeof google;
  }
}

export type Theme = "light" | "dark" | "system";