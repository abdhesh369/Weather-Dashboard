const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
鼓
