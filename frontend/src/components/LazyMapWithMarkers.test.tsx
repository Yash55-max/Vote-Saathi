import React from 'react';
import { render, waitFor } from '@testing-library/react';

import LazyMapWithMarkers from '@/components/LazyMapWithMarkers';

describe('LazyMapWithMarkers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    (window as any).google = undefined;
  });

  it('injects Google Maps script with provided API key', async () => {
    render(
      <LazyMapWithMarkers
        apiKey="demo-key"
        booths={[{ id: '1', name: 'Booth', address: 'Address', lat: 17.3, lng: 78.4 }]}
      />
    );

    await waitFor(() => {
      const script = document.getElementById('google-maps-script') as HTMLScriptElement | null;
      expect(script).not.toBeNull();
      expect(script?.src).toContain('maps.googleapis.com/maps/api/js');
      expect(script?.src).toContain('key=demo-key');
    });
  });
});
