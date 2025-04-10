import {useCallback, useEffect, useState} from 'preact/hooks';
import {GOOGLE_MAPS_API_KEY} from 'astro:env/client';

import mapDarkStyles from '../assets/dark';
import mapLightStyles from '../assets/light';

export default function VenezuelaToArgentinaMap() {
    const [theme, setTheme] = useState<string | null>('auto');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('auto');
        }
    }, []);

    const getMapStyles = useCallback(() => {
        let activeTheme = theme;
        if (theme === 'auto') {
            const prefersDarkMode =
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            activeTheme = prefersDarkMode ? 'dark' : 'light';
        }
        return activeTheme === 'dark' ? mapDarkStyles : mapLightStyles;
    }, [theme]);

    useEffect(() => {
        const initMap = () => {
            const point1 = {lat: 10.49158, lng: -66.85092};
            const point2 = {lat: 7.74957, lng: -72.23547};
            const point3 = {lat: 7.92802, lng: -72.507};
            const point4 = {lat: 4.70118, lng: -74.14588};
            const point5 = {lat: -34.51491, lng: -58.47647};

            const mapElement = document.getElementById('map');
            if (!mapElement) return;

            const map = new google.maps.Map(mapElement, {
                zoom: 4,
                center: {lat: -12.5, lng: -65.0},
                styles: getMapStyles(),
            });

            const createMarker = (position: google.maps.LatLngLiteral) => {
                new google.maps.Marker({
                    position,
                    map,
                });
            };

            [point1, point2, point3, point4, point5].forEach(createMarker);

            const createPolyline = (path: google.maps.LatLngLiteral[]) => {
                const polyline = new google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: '#6087cf',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });
                polyline.setMap(map);
            };

            createPolyline([point1, point2]);
            createPolyline([point2, point3]);
            createPolyline([point3, point4]);
            createPolyline([point4, point5]);
        };

        const loadScript = () => {
            const existingScript = document.querySelector(
                `script[src^="https://maps.googleapis.com/maps/api/js?key="]`
            );

            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    if (window.google) {
                        window.initMap = initMap;
                        initMap();
                    }
                };

                document.head.appendChild(script);

                // Cleanup
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

        return loadScript();
    }, []);

    return <div id="map" style={{"height": 700, "width": "100%"}}/>;
}
