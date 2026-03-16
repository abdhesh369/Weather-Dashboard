import { createClient } from 'redis';
// NOTE: Using ioredis for the exported `redis` instance (used by rate-limit-redis)
// and a simple async cache for weather data

let redisClient = null;
let ioredisClient = null;

// ── ioredis instance for rate-limit-redis ────────────
export let redis = null;

if (process.env.REDIS_URL) {
  try {
    const ioredis = await import('ioredis');
    const Redis = ioredis.default || ioredis.Redis;
    ioredisClient = new Redis(process.env.REDIS_URL);
    redis = ioredisClient;

    ioredisClient.on('connect',  () => console.log('[Redis] Connected'));
    ioredisClient.on('error',    (e) => console.warn('[Redis] Error:', e.message));
  } catch (e) {
    console.warn('[Redis] ioredis init failed, falling back to memory cache:', e.message);
  }
}

// ── In-memory fallback ───────────────────────────────
const memCache = new Map();
const MEM_TTL  = 10 * 60 * 1000; // 10 min

export async function getCached(key) {
  if (ioredisClient) {
    try {
      const val = await ioredisClient.get(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  }
  // Memory fallback
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > MEM_TTL) { memCache.delete(key); return null; }
  return entry.data;
}

export async function setCached(key, data) {
  if (ioredisClient) {
    try { await ioredisClient.set(key, JSON.stringify(data), 'EX', 600); } 
    catch (e) { console.warn('[Redis] setCached error:', e.message); }
    return;
  }
  // Memory fallback
  memCache.set(key, { data, ts: Date.now() });
}
