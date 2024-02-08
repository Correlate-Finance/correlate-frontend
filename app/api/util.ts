export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL === undefined
    ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL;
}
