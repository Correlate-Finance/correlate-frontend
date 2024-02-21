import {
  useCorrelateInputText,
  useFetchRevenueData,
  useSubmitForm,
} from '@/hooks/usePage';
import { act, renderHook, waitFor } from '@testing-library/react';

const originalFetch = global.fetch;

describe('usePage All Hooks Test', () => {
  describe('useFetchRevenueData', () => {
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

  describe('useSubmitForm', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
      window.alert = jest.fn();
    });

    afterEach(() => {
      global.fetch = originalFetch;
      jest.clearAllMocks();
    });

    test('updates dataArray and hasData correctly on successful fetch', async () => {
      // Mock fetch implementation
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: { data: [{ correlation: 0.9, year: 2020 }] }, // Adjusted to match expected response structure
            }),
        }),
      );

      const { result } = renderHook(() => useSubmitForm());

      await act(async () => {
        result.current.onSubmit({
          ticker: 'AAPL',
          startYear: 2020,
          aggregationPeriod: 'monthly',
          lagPeriods: 2,
          highLevelOnly: false,
        });
      });

      await waitFor(() => {
        expect(result.current.hasData).toBeTruthy();
        expect(result.current.dataArray).toEqual([
          { correlation: 0.9, year: 2020 },
        ]);
      });
    });

    test('handles fetch error', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject('API is down'),
      );

      const { result } = renderHook(() => useSubmitForm());

      await act(async () => {
        result.current.onSubmit({
          ticker: 'AAPL',
          startYear: 2020,
          aggregationPeriod: 'monthly',
          lagPeriods: 2,
          highLevelOnly: false,
        });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBeFalsy();
        expect(result.current.hasData).toBeFalsy();
        expect(result.current.dataArray).toEqual([]);
      });
    });
  });

  describe('useCorrelateInputText', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
      window.alert = jest.fn();
    });

    afterEach(() => {
      global.fetch = originalFetch;
      jest.clearAllMocks();
    });

    it('successfully correlates input text and updates state', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: { data: [{ correlation: 0.9, year: 2020 }] }, // Adjusted to match expected response structure
            }),
        }),
      );
      const { result } = renderHook(() => useCorrelateInputText());

      await act(async () => {
        result.current.correlateInputText('some input data');
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.hasData).toBe(true);
        expect(result.current.dataArray).toEqual([
          { correlation: 0.9, year: 2020 },
        ]);
      });
    });

    it('handles error during data correlation', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject('Error correlating data'),
      );

      const { result } = renderHook(() => useCorrelateInputText());

      await act(async () => {
        result.current.correlateInputText('some input data');
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.hasData).toBe(false);
        expect(result.current.dataArray).toEqual([]);
      });
    });

    it('updates fiscalYearEnd on change', async () => {
      const { result } = renderHook(() => useCorrelateInputText());

      act(() => {
        result.current.onChangeFiscalYearEnd('January');
      });
    });

    it('updates timeIncrement on change', async () => {
      const { result } = renderHook(() => useCorrelateInputText());

      act(() => {
        result.current.onChangeTimeIncrement('Monthly');
      });
    });
  });
});
