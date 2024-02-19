import { useLocalStorage } from '@/hooks/useLocalStorage'; // Adjust the import path as necessary
import { act, renderHook } from '@testing-library/react';

describe('useLocalStorage hook', () => {
  // Mock localStorage
  let store: Record<string, string> = {};

  beforeEach(() => {
    global.localStorage.getItem = jest.fn((key) => store[key] || null);
    global.localStorage.setItem = jest.fn((key, value) => {
      store[key] = value.toString();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with initial value if no value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('retrieves and sets value from localStorage if present', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('persists value across re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage('testKey', 'initial'),
    );
    const [, setValue] = result.current;

    act(() => {
      setValue('newValue');
    });

    rerender();

    expect(result.current[0]).toBe('newValue');
  });
});
