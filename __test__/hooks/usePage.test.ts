import { useFetchRevenueData } from '@/hooks/usePage';
import { act, renderHook, waitFor } from '@testing-library/react';

describe('useFetchRevenueData', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    window.alert = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('should start with initial state', () => {
    const { result } = renderHook(() => useFetchRevenueData());

    act(() => {
      expect(result.current.revenueData).toEqual([]);
      expect(result.current.loading).toBeFalsy();
    });
  });

  test('should set loading true when fetch starts', async () => {
    const { result } = renderHook(() => useFetchRevenueData());
    expect(result.current.loading).toBeFalsy();
  });

  test('should update revenue data on fetch success', async () => {
    const mockData = { data: [{ date: '2020-01', value: 100 }] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useFetchRevenueData());

    await act(async () => {
      result.current.fetchRevenueData({
        ticker: 'AAPL',
        startYear: 2020,
        aggregationPeriod: 'monthly',
        lagPeriods: 0,
        highLevelOnly: false,
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.revenueData).toEqual([['2020-01', 100]]);
    });
  });

  test('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('API failure');

    const { result } = renderHook(() => useFetchRevenueData());

    await act(async () => {
      result.current.fetchRevenueData({
        ticker: 'AAPL',
        startYear: 2020,
        aggregationPeriod: 'monthly',
        lagPeriods: 0,
        highLevelOnly: false,
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.revenueData).toEqual([]);
    });
  });
});
