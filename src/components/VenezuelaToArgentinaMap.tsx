import { useCallback, useEffect, useState } from "preact/hooks";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_DARK_MAP_ID,
  GOOGLE_MAPS_LIGHT_MAP_ID,
} from "astro:env/client";
import { useStore } from "@nanostores/preact";

import "../styles/google-map.css";
import { activeTheme } from "../stores/activeThemeStore.ts";
import { getMapColorScheme } from "../utils/googleMapColorScheme.ts";
import { loadGoogleMaps } from "../utils/googleMapsLoader.ts";
import { subscribeToSystemTheme } from "../utils/systemTheme.ts";

export default function VenezuelaToArgentinaMap() {
  const theme = useStore(activeTheme); // Subscribes to the theme state
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const resolvedTheme =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;
  const mapId =
    resolvedTheme === "dark"
      ? GOOGLE_MAPS_DARK_MAP_ID
      : GOOGLE_MAPS_LIGHT_MAP_ID;

  const adjustMapHeight = useCallback((): void => {
    if (typeof window !== "undefined") {
      const nav = document.querySelector("nav") as HTMLElement;
      const footer = document.querySelector("footer") as HTMLElement;
      const footerBreadcrumb = document.querySelector(
        "footer > .left",
      ) as HTMLElement;
      const map = document.querySelector(
        "#venezuela-to-argentina-map",
      ) as HTMLElement;

      if (nav && footer && map) {
        const navHeight = nav.offsetHeight;
        const footerHeight = footer.offsetHeight;
        const footerBreadcrumbHeight = footerBreadcrumb.offsetHeight;
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const emInPixels = fontSize * 5;

        const calculatedMapHeight =
          window.innerHeight -
          navHeight -
          footerHeight -
          footerBreadcrumbHeight - emInPixels;

        map.style.height = `${calculatedMapHeight < 300 ? 300 : calculatedMapHeight}px`;
      }
    }
  }, []);

  // Attach event listeners for window resize or initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      adjustMapHeight(); // Initially set the height
      window.addEventListener("resize", adjustMapHeight);
      return () => {
        window.removeEventListener("resize", adjustMapHeight);
      };
    }
  }, [adjustMapHeight]);

  useEffect(() => {
    if (theme !== "system") return;
    return subscribeToSystemTheme(setSystemPrefersDark);
  }, [theme]);

  useEffect(() => {
    const apiKey = GOOGLE_MAPS_API_KEY;
    if (!mapId || !apiKey) return;

    const points = [
      { lat: 10.49158, lng: -66.85092 },
      { lat: 7.74957, lng: -72.23547 },
      { lat: 7.92802, lng: -72.507 },
      { lat: 4.70118, lng: -74.14588 },
      { lat: -34.51491, lng: -58.47647 },
    ];

    const mapElement = document.getElementById("venezuela-to-argentina-map");
    if (!mapElement) return;

    let disposed = false;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    const polylines: google.maps.Polyline[] = [];

    const initializeMap = async () => {
      const { maps, marker } = await loadGoogleMaps(apiKey);
      if (disposed || !mapElement.isConnected) return;

      mapElement.replaceChildren();
      const map = new maps.Map(mapElement, {
        zoom: 4,
        center: { lat: -12.5, lng: -65.0 },
        mapId,
        colorScheme: getMapColorScheme(resolvedTheme),
      });

      points.forEach((point, index) => {
        const iconUrl =
          index === 0
            ? "/images/map/start-marker.svg"
            : index === points.length - 1
              ? "/images/map/end-marker.svg"
              : "/images/map/transit-marker.svg";
        const image = document.createElement("img");
        image.src = iconUrl;
        image.width = 32;
        image.height = 32;
        image.alt = "";

        markers.push(
          new marker.AdvancedMarkerElement({
            position: point,
            map,
            content: image,
          }),
        );
      });

      for (let i = 0; i < points.length - 1; i++) {
        polylines.push(
          new maps.Polyline({
            path: [points[i], points[i + 1]],
            geodesic: true,
            strokeColor: "#8e4ace",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map,
          }),
        );
      }
    };

    void initializeMap().catch((error: unknown) => {
      if (!disposed) console.error("Unable to initialize Google Map:", error);
    });

    return () => {
      disposed = true;
      markers.forEach((marker) => (marker.map = null));
      polylines.forEach((polyline) => polyline.setMap(null));
      mapElement.replaceChildren();
    };
  }, [mapId, resolvedTheme]);

  return <div id="venezuela-to-argentina-map" class="google-map" />;
}
