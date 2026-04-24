'use client';

import { useState, useCallback } from 'react';

interface GeolocationResult {
  lat: number;
  lng: number;
  error?: string;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        const msg = err.code === 1
          ? 'Location permission denied.'
          : err.code === 2
          ? 'Location unavailable.'
          : 'Location request timed out.';
        setError(msg);
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: true }
    );
  }, []);

  return { position, loading, error, getLocation };
}
