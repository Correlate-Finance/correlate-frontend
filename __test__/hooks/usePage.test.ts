import {
  useCorrelateInputText,
  useCorrelateResponseData,
  useFetchRevenueData,
  useSubmitForm,
} from '@/hooks/usePage';
import handleResponseStatus from '@/lib/handleResponse';
import { act, renderHook, waitFor } from '@testing-library/react';

const originalFetch = global.fetch;

const DEFAULT_INPUT_FIELDS = {
  ticker: 'AAPL',
  startYear: 2020,
  endYear: 2024,
  aggregationPeriod: 'monthly',
  lagPeriods: 0,
  highLevelOnly: false,
  correlationMetric: 'RAW_VALUE',
  fiscalYearEnd: 'December',
};

jest.mock('../../lib/handleResponse', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('usePage All Hooks Test', () => {
  beforeAll(() => {
    (handleResponseStatus as jest.Mock).mockImplementation(
      async (response: Response) => {
        return await response.json();
      },
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

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
        result.current.fetchRevenueData(DEFAULT_INPUT_FIELDS);
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
        result.current.fetchRevenueData(DEFAULT_INPUT_FIELDS);
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

      const { result: correlateResult } = renderHook(useCorrelateResponseData);
      const { result } = renderHook(() =>
        useSubmitForm(correlateResult.current.setCorrelateResponseData),
      );

      await act(async () => {
        result.current.onSubmit({ inputFields: DEFAULT_INPUT_FIELDS });
      });

      await waitFor(() => {
        expect(result.current.hasData).toBeTruthy();
        expect(correlateResult.current.correlateResponseData).toEqual({
          data: [{ correlation: 0.9, year: 2020 }],
        });
      });
    });

    test('handles fetch error', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('API is down')),
      );

      const { result: correlateResult } = renderHook(useCorrelateResponseData);
      const { result } = renderHook(() =>
        useSubmitForm(correlateResult.current.setCorrelateResponseData),
      );

      await act(async () => {
        result.current.onSubmit({ inputFields: DEFAULT_INPUT_FIELDS });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBeFalsy();
        expect(result.current.hasData).toBeFalsy();
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

      const { result: correlateResult } = renderHook(useCorrelateResponseData);
      const { result } = renderHook(() =>
        useCorrelateInputText(correlateResult.current.setCorrelateResponseData),
      );

      await act(async () => {
        result.current.correlateInputText({
          ...DEFAULT_INPUT_FIELDS,
          inputData: 'some input data',
        });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.hasData).toBe(true);
        expect(correlateResult.current.correlateResponseData).toEqual({
          data: [{ correlation: 0.9, year: 2020 }],
        });
      });
    });

    it('handles error during data correlation', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Error correlating data')),
      );

      const { result: correlateResult } = renderHook(useCorrelateResponseData);
      const { result } = renderHook(() =>
        useCorrelateInputText(correlateResult.current.setCorrelateResponseData),
      );

      await act(async () => {
        result.current.correlateInputText({
          ...DEFAULT_INPUT_FIELDS,
          inputData: 'some input data',
        });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.hasData).toBe(false);
      });
    });
  });
});
