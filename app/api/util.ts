export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL === undefined
    ? 'http://api.correlatefinance.com'
    : process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL;
}
