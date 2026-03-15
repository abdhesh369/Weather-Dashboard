import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (err) => {
  console.warn('[Cache] Redis connection error:', err.message);
});

export async function getCached(key) {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null; // graceful degradation — serve without cache
  }
}

export async function setCached(key, data) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', 600); // 10 minutes
  } catch (err) {
    console.warn('[Cache] Failed to set cache:', err.message);
  }
}
