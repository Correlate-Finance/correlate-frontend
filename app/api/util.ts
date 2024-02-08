export function getBaseUrl() {
  return process.env.CORRELATE_BACKEND_URL === undefined
    ? 'http://localhost:8000'
    : process.env.CORRELATE_BACKEND_URL;
}
