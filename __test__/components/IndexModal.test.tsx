import IndexModal from '@/components/IndexModal';
import { CorrelationData } from '@/components/Results';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

const originalFetch = global.fetch;

const mockData: CorrelationData = {
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
    {
      title: 'Dataset2',
      input_data: [],
      dates: [],
      pearson_value: 0,
      p_value: 0,
      lag: 0,
      dataset_data: [],
    },
  ],
};

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

describe('IndexModal Component', () => {
  const mockCheckedRows = new Set([0, 1]); // Example checked rows

  beforeEach(() => {
    (useForm as jest.Mock).mockImplementation(() => ({
      ...jest.requireActual('react-hook-form').useForm(),
      handleSubmit: jest.fn((fn) => (event: any) => {
        event.preventDefault();
        fn({ indexName: 'Test Index', percentages: ['0.5', '0.5'] });
      }),
      register: jest.fn(),
      formState: { errors: {} },
    }));
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('submits form and shows correlation data on success', async () => {
    render(<IndexModal data={mockData} checkedRows={mockCheckedRows} />);
    const mockResponseData = { data: 'mockedData' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponseData),
    });

    const createIndexButton = screen.getByText('Create Index');
    userEvent.click(createIndexButton);

    const correlateButton = await screen.findByText('Correlate');

    fireEvent.click(correlateButton);
  });

  it('shows error message on fetch failure', async () => {
    render(<IndexModal data={mockData} checkedRows={mockCheckedRows} />);
    (fetch as jest.Mock).mockRejectedValueOnce('API failure');

    const createIndexButton = screen.getByText('Create Index');
    userEvent.click(createIndexButton);

    const correlateButton = await screen.findByText('Correlate');

    fireEvent.click(correlateButton);
  });
});
