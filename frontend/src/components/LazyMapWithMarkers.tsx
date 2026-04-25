'use client';

import React from 'react';
import { useEffect, useRef } from 'react';

export default function LazyMapWithMarkers({ apiKey, booths }: { apiKey: string; booths: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !booths.length) return;

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat: booths[0].lat, lng: booths[0].lng },
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#7c93a3' }, { lightness: '-10' }],
          },
        ],
      });

      const bounds = new window.google.maps.LatLngBounds();

      booths.forEach((booth, i) => {
        if (!booth.lat || !booth.lng) return;

        const marker = new window.google.maps.Marker({
          position: { lat: booth.lat, lng: booth.lng },
          map,
          title: booth.name,
          icon:
            i === 0
              ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          animation: i === 0 ? window.google.maps.Animation.BOUNCE : null,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #1e293b; padding: 4px;"><div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${booth.name}</div><div style="font-size: 10px; opacity: 0.8;">${booth.address}</div></div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        bounds.extend(marker.getPosition());
      });

      if (booths.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }, [apiKey, booths]);

  return <div ref={mapRef} className="w-full h-full" />;
}

declare global {
  interface Window {
    google: any;
  }
}
