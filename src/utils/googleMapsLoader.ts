export type GoogleMapsLibraries = {
  maps: google.maps.MapsLibrary;
  marker: google.maps.MarkerLibrary;
};

type MapsWindow = Window & {
  __portfolioGoogleMapsReady?: () => void;
};

const callbackName = "__portfolioGoogleMapsReady";
let googleMapsPromise: Promise<GoogleMapsLibraries> | undefined;

function loadMapsApi(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mapsWindow = window as MapsWindow;
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      loading: "async",
      callback: callbackName,
    });

    mapsWindow[callbackName] = () => {
      delete mapsWindow[callbackName];
      resolve();
    };

    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      delete mapsWindow[callbackName];
      script.remove();
      reject(new Error("Unable to load Google Maps"));
    };

    document.head.append(script);
  });
}

async function importMapsLibraries(): Promise<GoogleMapsLibraries> {
  const [maps, marker] = await Promise.all([
    window.google.maps.importLibrary("maps"),
    window.google.maps.importLibrary("marker"),
  ]);

  return {
    maps: maps as google.maps.MapsLibrary,
    marker: marker as google.maps.MarkerLibrary,
  };
}

export function loadGoogleMaps(apiKey: string): Promise<GoogleMapsLibraries> {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing"));
  }

  if (!googleMapsPromise) {
    googleMapsPromise = (async () => {
      if (!window.google?.maps?.importLibrary) {
        await loadMapsApi(apiKey);
      }

      return importMapsLibraries();
    })().catch((error: unknown) => {
      googleMapsPromise = undefined;
      throw error;
    });
  }

  return googleMapsPromise;
}
