import { correlateIndex } from '@/app/api/actions';
import { getBaseUrl } from '@/app/api/util';
import { CorrelationData } from '@/components/Results';

const originalFetch = global.fetch;

const data: CorrelationData = {
  aggregationPeriod: 'daily',
  correlationMetric: 'pearson',
  data: [
    {
      title: 'Dataset1',
      input_data: [],
      dates: [],
      pearson_value: 0,
      p_value: 0,
      lag: 0,
      dataset_data: [],
    },
  ],
};

describe('correlateIndex', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should call fetch with correct url and config', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: 'mockedData' }),
    });

    const values = { percentages: ['10', '20'] };

    const checkedRows = new Set([0]);

    await correlateIndex(values, data, checkedRows);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${getBaseUrl()}/correlateindex/?aggregation_period=daily&correlation_metric=pearson`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          index_percentages: ['10', '20'],
          index_datasets: ['Dataset1'],
          input_data: [],
          dates: [],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    );
  });

  it('should handle fetch response correctly', async () => {
    const mockResponseData = { data: 'mockedData' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponseData),
    });

    const values = { percentages: ['10', '20'] };
    const checkedRows = new Set([0]);

    const response = await correlateIndex(values, data, checkedRows);

    expect(response).toEqual(mockResponseData);
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    const values = { percentages: ['10', '20'] };
    const checkedRows = new Set([0]);

    await expect(correlateIndex(values, data, checkedRows)).rejects.toThrow(
      'Fetch failed',
    );
  });
});
