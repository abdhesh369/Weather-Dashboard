// ── Cache module ─────────────────────────────────────────────────────────────
// Supports Redis (via ioredis) with in-memory fallback.
// Memory cache performs periodic eviction of stale entries.

let ioredisClient = null;

export let redis = null;

const MEM_TTL  = Number(process.env.CACHE_TTL_SECONDS  || 600) * 1000; // default 10 min
const REDIS_TTL = Number(process.env.CACHE_TTL_SECONDS  || 600);

if (process.env.REDIS_URL) {
  try {
    const ioredis = await import('ioredis');
    const Redis   = ioredis.default || ioredis.Redis;
    ioredisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: true,
    });
    redis = ioredisClient;

    await ioredisClient.connect().catch(() => {}); // lazy
    ioredisClient.on('connect',  ()  => console.log('[Cache] Redis connected'));
    ioredisClient.on('error',    (e) => console.warn('[Cache] Redis error:', e.message));
  } catch (e) {
    console.warn('[Cache] ioredis init failed, using memory cache:', e.message);
    ioredisClient = null;
  }
}

// ── In-memory store ───────────────────────────────────────────────────────────
const memCache  = new Map();
let   cacheHits = 0;
let   cacheMiss = 0;

// Evict expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  let evicted = 0;
  for (const [k, v] of memCache) {
    if (now - v.ts > MEM_TTL) { memCache.delete(k); evicted++; }
  }
  if (evicted > 0) console.log(`[Cache] Evicted ${evicted} expired entries`);
}, 5 * 60 * 1000);

// ── Public API ────────────────────────────────────────────────────────────────
export async function getCached(key) {
  if (ioredisClient?.status === 'ready') {
    try {
      const val = await ioredisClient.get(key);
      if (val) { cacheHits++; return JSON.parse(val); }
      cacheMiss++;
      return null;
    } catch { /* fall through to memory */ }
  }

  const entry = memCache.get(key);
  if (!entry)                             { cacheMiss++; return null; }
  if (Date.now() - entry.ts > MEM_TTL)   { memCache.delete(key); cacheMiss++; return null; }
  cacheHits++;
  return entry.data;
}

export async function setCached(key, data) {
  if (ioredisClient?.status === 'ready') {
    try {
      await ioredisClient.set(key, JSON.stringify(data), 'EX', REDIS_TTL);
      return;
    } catch (e) {
      console.warn('[Cache] Redis set failed, writing to memory:', e.message);
    }
  }
  memCache.set(key, { data, ts: Date.now() });
}

export async function deleteCached(key) {
  if (ioredisClient?.status === 'ready') {
    try { await ioredisClient.del(key); } catch { /* ignore */ }
  }
  memCache.delete(key);
}

export function getCacheStats() {
  return {
    backend:   ioredisClient?.status === 'ready' ? 'redis' : 'memory',
    memSize:   memCache.size,
    hits:      cacheHits,
    misses:    cacheMiss,
    hitRate:   cacheHits + cacheMiss > 0
      ? `${Math.round((cacheHits / (cacheHits + cacheMiss)) * 100)}%`
      : 'n/a',
  };
}
