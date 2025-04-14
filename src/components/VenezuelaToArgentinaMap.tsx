import { useEffect, useCallback, useState } from "preact/hooks";
import { GOOGLE_MAPS_API_KEY } from "astro:env/client";
import "../styles/google-map.css";

import mapDarkStyles from "../assets/dark";
import mapLightStyles from "../assets/light";

export default function VenezuelaToArgentinaMap() {
  const [theme, setTheme] = useState<string | null>("system");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme("system");
      }
    }
  }, []);

  const adjustMapHeight = useCallback((): void => {
    if (typeof window !== "undefined") {
      const wrapper = document.querySelector(".wrapper") as HTMLElement;
      const header = document.querySelector("header") as HTMLElement;
      const footer = document.querySelector("footer") as HTMLElement;
      const map = document.querySelector(
        "#venezuela-to-argentina-map",
      ) as HTMLElement;

      if (wrapper && header && footer && map) {
        const wrapperHeight = wrapper.offsetHeight;
        const headerHeight = header.offsetHeight;
        const footerHeight = footer.offsetHeight;

        let calculatedMapHeight =
          wrapperHeight - headerHeight - footerHeight - 80;
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

  // Return map styles based on theme
  const getMapStyles = useCallback(() => {
    if (typeof window === "undefined") return mapLightStyles;

    let activeTheme = theme;
    if (theme === "system") {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = prefersDarkMode ? "dark" : "light";
    }
    return activeTheme === "dark" ? mapDarkStyles : mapLightStyles;
  }, [theme]);

  // Initialize map after Google Maps script loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initMap = () => {
        const points = [
          { lat: 10.49158, lng: -66.85092 },
          { lat: 7.74957, lng: -72.23547 },
          { lat: 7.92802, lng: -72.507 },
          { lat: 4.70118, lng: -74.14588 },
          { lat: -34.51491, lng: -58.47647 },
        ];

        const mapElement = document.getElementById(
          "venezuela-to-argentina-map",
        );
        if (!mapElement) return;

        const map = new google.maps.Map(mapElement, {
          zoom: 4,
          center: { lat: -12.5, lng: -65.0 },
          styles: getMapStyles(),
        });

        // Create Markers
        points.forEach((point) => {
          new google.maps.Marker({ position: point, map });
        });

        // Create Poly lines between points
        const createPolyline = (path: google.maps.LatLngLiteral[]) => {
          const polyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: "#6087cf",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          polyline.setMap(map);
        };

        for (let i = 0; i < points.length - 1; i++) {
          createPolyline([points[i], points[i + 1]]);
        }
      };

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
  }, [getMapStyles]);

  return <div id="venezuela-to-argentina-map" class="google-map" />;
}
