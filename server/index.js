import 'dotenv/config';
import connectDB from './db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import helmet from 'helmet';

import authRoutes     from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import userRoutes     from './routes/user.js';
import weatherRoutes  from './routes/weather.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Env validation ──────────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'WEATHER_API_KEY'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[Startup] Missing required env variable: ${key}`);
    process.exit(1);
  }
}

connectDB();

// ── Optional Sentry ─────────────────────────────────
let Sentry = null;
if (process.env.SENTRY_DSN) {
  try {
    const mod = await import('@sentry/node');
    Sentry = mod;
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 0.1,
    });
    console.log('[Sentry] Initialized');
  } catch (e) {
    console.warn('[Sentry] Failed to init:', e.message);
  }
}

// ── Optional Redis rate-limit store ─────────────────
let rateLimitStore = undefined; // falls back to in-memory
if (process.env.REDIS_URL) {
  try {
    const { redis } = await import('./cache.js');
    const { RedisStore } = await import('rate-limit-redis');
    rateLimitStore = new RedisStore({ sendCommand: (...args) => redis.call(...args) });
    console.log('[Redis] Rate-limit store connected');
  } catch (e) {
    console.warn('[Redis] Rate-limit store failed, using memory store:', e.message);
  }
}

const app = express();

// ── Security headers ────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", 'openweathermap.org', 'data:', 'blob:'],
      connectSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      fontSrc:    ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// ── CORS ────────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ── CSRF (skip health + refresh) ────────────────────
const csrfProtection = csrf({ cookie: true });
app.use((req, res, next) => {
  const skip = ['/api/health', '/api/csrf-token'];
  if (skip.includes(req.path)) return next();
  csrfProtection(req, res, next);
});

app.get('/api/csrf-token', (req, res) => {
  // Generate token by running csurf once on this request
  csrfProtection(req, res, () => res.json({ csrfToken: req.csrfToken() }));
});

// ── Rate limiting ────────────────────────────────────
const limiterBase = { windowMs: 15 * 60 * 1000, standardHeaders: true, legacyHeaders: false };

const apiLimiter = rateLimit({
  ...limiterBase, limit: 100,
  message: { message: 'Too many requests, please try again later.' },
  ...(rateLimitStore ? { store: rateLimitStore } : {}),
});

const authLimiter = rateLimit({
  ...limiterBase, limit: 20,
  message: { message: 'Too many login attempts, please try again later.' },
  ...(rateLimitStore ? { store: rateLimitStore } : {}),
});

// ── Routes ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const { getCacheStats } = await import('./cache.js');
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    Math.round(process.uptime()),
    cache:     getCacheStats(),
    memory:    process.memoryUsage().heapUsed,
  });
});

app.use('/api/auth',      authLimiter, authRoutes);
app.use('/api/weather',   apiLimiter,  weatherRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user',      userRoutes);

// ── Sentry error handler (must be after routes) ─────
if (Sentry) Sentry.setupExpressErrorHandler(app);

// ── Global error handler ─────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ── Serve client in production ───────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/(.*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
