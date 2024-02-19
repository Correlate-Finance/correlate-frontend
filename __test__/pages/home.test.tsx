import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Page from '../../app/page';

describe('Page', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  test('renders Page component without crashing', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders Manual and Automatic tabs', () => {
    render(<Page />);
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
  });

  test('renders form fields in Automatic tab', async () => {
    render(<Page />);
    userEvent.click(screen.getByText('Automatic'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('AAPL')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('2010')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('automatic-lag-periods'));
    await waitFor(() => {
      expect(screen.getAllByText('0')).toHaveLength(2);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
    const clickedLagPeriods = userEvent.click(screen.getByText('2'));
    expect(clickedLagPeriods).toBeTruthy();
  });

  test('renders input fields in Manual tab', async () => {
    render(<Page />);
    userEvent.click(screen.getByText('Manual'));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Paste excel data here'),
      ).toBeInTheDocument();
    });

    // Test for Select Fiscal Year End
    userEvent.click(screen.getByTestId('fiscal-year-end'));
    await waitFor(() => {
      expect(screen.getByText('January')).toBeInTheDocument();
      expect(screen.getByText('February')).toBeInTheDocument();
      expect(screen.getByText('March')).toBeInTheDocument();
      expect(screen.getByText('April')).toBeInTheDocument();
      expect(screen.getByText('May')).toBeInTheDocument();
      expect(screen.getByText('June')).toBeInTheDocument();
      expect(screen.getByText('July')).toBeInTheDocument();
      expect(screen.getByText('August')).toBeInTheDocument();
      expect(screen.getByText('September')).toBeInTheDocument();
      expect(screen.getByText('October')).toBeInTheDocument();
      expect(screen.getByText('November')).toBeInTheDocument();
      expect(screen.getAllByText('December')).toHaveLength(2);
    });
    const clickedNovember = userEvent.click(screen.getByText('November'));
    expect(clickedNovember).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByTestId('fiscal-year-end')).toHaveTextContent(
        'November',
      );
    });

    // Test for Select Time Seasonality
    userEvent.click(screen.getByTestId('quarterly'));
    await waitFor(() => {
      expect(screen.getAllByText('Quarterly')).toHaveLength(2);
      expect(screen.getByText('Annually')).toBeInTheDocument();
    });
    const clickedAnnually = userEvent.click(screen.getByText('Annually'));
    expect(clickedAnnually).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByTestId('quarterly')).toHaveTextContent('Annually');
    });

    // Test for Select Lag Periods
    userEvent.click(screen.getByTestId('lag-periods'));
    await waitFor(() => {
      expect(screen.getAllByText('0')).toHaveLength(2);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
    const clickedLagPeriods = userEvent.click(screen.getByText('2'));
    expect(clickedLagPeriods).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByTestId('lag-periods')).toHaveTextContent('2');
    });

    userEvent.click(screen.getByTestId('manual-correlate-button'));
  });
});
