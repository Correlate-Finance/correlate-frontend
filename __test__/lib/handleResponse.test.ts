import { toast } from '@/components/ui/use-toast';
import handleResponseStatus from '@/lib/handleResponse';
import Cookies from 'js-cookie';

// Mock dependencies
jest.mock('../../components/ui/use-toast', () => ({
  toast: jest.fn(),
}));
jest.mock('js-cookie', () => ({
  remove: jest.fn(),
}));

describe('handleResponseStatus', () => {
  beforeEach(() => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({ href: '' } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle 401 status by showing toast, removing cookie, and redirecting to login', async () => {
    const mockResponse = {
      status: 401,
      statusText: 'Unauthorized',
      ok: false,
      json: jest.fn(),
    };

    await handleResponseStatus(mockResponse as unknown as Response);

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Unauthorized',
        description:
          'Your credentials are invalid. Please login again to access this feature',
      }),
    );

    const lastCallArguments = (toast as jest.Mock).mock.calls[
      (toast as jest.Mock).mock.calls.length - 1
    ]?.[0];
    const actionElement = lastCallArguments.action;

    actionElement.props.onClick();
    expect(Cookies.remove).toHaveBeenCalledWith('session');
    expect(window.location.href).toEqual('/login');
  });

  it('should handle non-200 and non-401 status by showing error toast', async () => {
    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      ok: false,
      json: jest.fn(),
    };

    const result = await handleResponseStatus(
      mockResponse as unknown as Response,
    );

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Internal Server Error',
        description: 'An error occurred',
      }),
    );
    expect(result).toBeNull();
  });

  it('should return JSON response for 200 OK status', async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'some data' }),
    };

    const result = await handleResponseStatus(
      mockResponse as unknown as Response,
    );

    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({ data: 'some data' });
  });
});
