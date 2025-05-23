import { useCallback, useEffect } from "preact/hooks";
import { GOOGLE_MAPS_API_KEY } from "astro:env/client";
import { useStore } from "@nanostores/preact";

import "../styles/google-map.css";
import mapDarkStyles from "../assets/map-themes/dark.ts";
import mapLightStyles from "../assets/map-themes/light.ts";
import { activeTheme } from "../stores/activeThemeStore.ts";

export default function VenezuelaToArgentinaMap() {
  const theme = useStore(activeTheme); // Subscribes to the theme state

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

  // Function to get the corresponding map styles based on the theme
  const getMapStyles = useCallback(() => {
    if (typeof window === "undefined") return mapDarkStyles;
    let activeTheme = theme;
    if (theme === "system") {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = prefersDarkMode ? "dark" : "light";
    }
    return activeTheme === "dark" ? mapDarkStyles : mapLightStyles;
  }, [theme]);

  // Function to initialize the map
  const initMap = useCallback(() => {
    const points = [
      { lat: 10.49158, lng: -66.85092 },
      { lat: 7.74957, lng: -72.23547 },
      { lat: 7.92802, lng: -72.507 },
      { lat: 4.70118, lng: -74.14588 },
      { lat: -34.51491, lng: -58.47647 },
    ];

    const mapElement = document.getElementById("venezuela-to-argentina-map");
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      zoom: 4,
      center: { lat: -12.5, lng: -65.0 },
      styles: getMapStyles(), // Get current styles based on a theme
    });

    // Create Markers with custom icons
    points.forEach((point, index) => {
      let iconUrl;
      if (index === 0) {
        // Starting point (Venezuela)
        iconUrl = "/images/map/start-marker.svg";
      } else if (index === points.length - 1) {
        // End point (Argentina)
        iconUrl = "/images/map/end-marker.svg";
      } else {
        // Transit points
        iconUrl = "/images/map/transit-marker.svg";
      }

      new google.maps.Marker({
        position: point,
        map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
      });
    });

    // Create Poly lines between points
    const createPolyline = (path: google.maps.LatLngLiteral[]) => {
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#8e4ace",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      polyline.setMap(map);
    };

    for (let i = 0; i < points.length - 1; i++) {
      createPolyline([points[i], points[i + 1]]);
    }
  }, [getMapStyles]);

  // Load a Google Maps script and initialize the map
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadScript = () => {
        const existingScript = document.querySelector(
          `script[src^="https://maps.googleapis.com/maps/api/js?key="]`,
        );

        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
          script.async = true;
          script.defer = true;

          script.onload = () => {
            if (window.google) {
              initMap();
            }
          };

          document.head.appendChild(script);

          // Cleanup if the component unmounts
          return () => {
            document.head.removeChild(script);
          };
        }

        // Already loaded
        if (window.google && window.google.maps) {
          initMap();
        }

        return undefined;
      };

      loadScript();
    }
  }, [initMap]);

  // Reload a map when theme changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      initMap();
    }
  }, [theme, initMap]);

  return <div id="venezuela-to-argentina-map" class="google-map" />;
}
