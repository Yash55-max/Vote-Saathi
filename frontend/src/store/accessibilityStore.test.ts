import { useAccessibilityStore } from '@/store/accessibilityStore';

describe('accessibility store', () => {
  beforeEach(() => {
    useAccessibilityStore.getState().reset();
  });

  it('updates theme and font size', () => {
    useAccessibilityStore.getState().setTheme('contrast');
    useAccessibilityStore.getState().setFontSize('large');

    const state = useAccessibilityStore.getState();
    expect(state.theme).toBe('contrast');
    expect(state.fontSize).toBe('large');
  });

  it('toggles dyslexic mode and can reset', () => {
    useAccessibilityStore.getState().toggleDyslexicMode();
    expect(useAccessibilityStore.getState().dyslexicMode).toBe(true);

    useAccessibilityStore.getState().reset();
    const state = useAccessibilityStore.getState();
    expect(state.theme).toBe('light');
    expect(state.fontSize).toBe('medium');
    expect(state.dyslexicMode).toBe(false);
  });
});
