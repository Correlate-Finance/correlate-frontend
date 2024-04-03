export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL === undefined
    ? 'http://api.correlatefinance.com'
    : process.env.NEXT_PUBLIC_CORRELATE_BACKEND_URL;
}

export function getCorrelationEngineUrl() {
  return process.env.NEXT_PUBLIC_CORRELATION_ENGINE_URL === undefined
    ? 'http://api2.correlatefinance.com'
    : process.env.NEXT_PUBLIC_CORRELATION_ENGINE_URL;
}
