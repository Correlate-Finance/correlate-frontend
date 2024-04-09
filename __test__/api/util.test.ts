import { getBaseUrl } from '@/app/api/util';

describe('getBaseUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default URL when NEXT_PUBLIC_CORRELATE_BACKEND_URL is undefined', () => {
    process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL = undefined;
    const url = getBaseUrl();
    expect(url).toBe('http://api.correlatefinance.com');
  });

  it('should return NEXT_PUBLIC_CORRELATE_BACKEND_URL when it is defined', () => {
    const mockUrl = 'http://mockedurl.com';
    process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL = mockUrl;
    const url = getBaseUrl();
    expect(url).toBe(mockUrl);
  });
});
