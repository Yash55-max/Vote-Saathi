import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { useAccessibilityStore } from '@/store/accessibilityStore';

describe('AccessibilityProvider', () => {
  beforeEach(() => {
    useAccessibilityStore.getState().reset();
    document.documentElement.className = '';
  });

  it('applies theme, font size, and dyslexia classes to root', async () => {
    useAccessibilityStore.setState({
      theme: 'contrast',
      fontSize: 'large',
      dyslexicMode: true,
    });

    render(
      <AccessibilityProvider>
        <div>content</div>
      </AccessibilityProvider>
    );

    await waitFor(() => {
      const root = document.documentElement;
      expect(root.classList.contains('theme-contrast')).toBe(true);
      expect(root.classList.contains('font-size-large')).toBe(true);
      expect(root.classList.contains('dyslexia-mode')).toBe(true);
    });
  });
});
