# SkyCast Weather Dashboard

A production-ready full-stack MERN weather application with a premium glassmorphic UI.

## ✨ Features

- **Real-time weather** — current conditions + 5-day forecast via OpenWeatherMap
- **Hourly forecast** — 6-slot 18-hour view with rain probability
- **Interactive charts** — dual high/low temperature trend (Recharts AreaChart)
- **Dynamic backgrounds** — gradient shifts based on weather condition
- **Stat cards** — humidity, wind, pressure, visibility with animated progress bars
- **Sun arc widget** — live SVG arc showing today's sunrise/sunset position
- **UV index gauge** — colour-banded needle indicator
- **User auth** — JWT (HttpOnly cookie) + refresh token + CSRF protection
- **Favourites** — add/remove cities, persisted per account (max 20)
- **Unit toggle** — metric ↔ imperial, persisted to account
- **Geolocation** — one-click "use my location"
- **Skeleton loading** — smooth pulse placeholders while data loads
- **Toast notifications** — animated success/error/info toasts

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, TailwindCSS v4, Framer Motion |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB (Atlas or local) |
| Cache | Redis (ioredis) with in-memory fallback |
| Auth | JWT (access + refresh tokens), bcryptjs, csurf |
| Security | Helmet.js, express-rate-limit, express-validator |
| Weather API | OpenWeatherMap (current + forecast) |

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)
- OpenWeatherMap API key — [get one free](https://openweathermap.org/api)

### 1. Install dependencies
```bash
# From project root
npm run build   # installs both client and server deps + builds client
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env — fill in MONGO_URI, JWT_SECRET, REFRESH_TOKEN_SECRET, WEATHER_API_KEY
```

### 3. Run in development
```bash
# From project root — starts server (port 5000) + client (port 5173) concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run in production
```bash
npm run build          # builds client into client/dist
NODE_ENV=production npm start   # serves API + static files on PORT
```

## 📁 Project Structure

```
skycast/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── widgets/      # SunCard, UVCard
│       │   ├── layout/       # PageLayout (two-column grid)
│       │   ├── HeroCard.jsx  # Main weather card with gradient bg
│       │   ├── StatsGrid.jsx # 4-col stat cards with progress bars
│       │   ├── HourlyForecast.jsx
│       │   ├── DailyForecast.jsx  # Range bars (blue→amber)
│       │   ├── WeatherChart.jsx   # Dual High/Low area chart
│       │   ├── FavoritesList.jsx
│       │   ├── SearchBar.jsx
│       │   ├── Navbar.jsx
│       │   └── ToastContainer.jsx
│       ├── pages/            # LoginPage, RegisterPage, NotFoundPage
│       ├── context/          # AuthContext
│       ├── hooks/            # useWeather, useToast, useWeatherBackground
│       ├── lib/              # api.js (Axios instance + CSRF)
│       ├── styles/           # tokens.css (design tokens)
│       └── utils/            # converters.js, weather.js
│
└── server/                   # Express API
    ├── controllers/          # auth, weather, favorites, user
    ├── middleware/            # authMiddleware, validate
    ├── models/               # User (Mongoose schema)
    ├── routes/               # auth, weather, favorites, user
    ├── cache.js              # Redis + memory fallback
    └── index.js              # App entry, middleware stack
```

## 🔑 Environment Variables

See `server/.env.example` for full documentation.

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Access token secret (min 32 chars) |
| `REFRESH_TOKEN_SECRET` | ✅ | Refresh token secret (different from JWT_SECRET) |
| `WEATHER_API_KEY` | ✅ | OpenWeatherMap API key |
| `PORT` | | Server port (default: 5000) |
| `NODE_ENV` | | `development` or `production` |
| `ALLOWED_ORIGIN` | | CORS origins, comma-separated |
| `REDIS_URL` | | Redis URL (falls back to memory if absent) |
| `SENTRY_DSN` | | Sentry project DSN (disabled if absent) |

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check |
| `GET` | `/api/csrf-token` | Public | CSRF token |
| `POST` | `/api/auth/register` | Public | Create account |
| `POST` | `/api/auth/login` | Public | Sign in |
| `POST` | `/api/auth/logout` | Public | Sign out |
| `POST` | `/api/auth/refresh` | Public | Refresh access token |
| `GET` | `/api/user/me` | 🔒 | Current user profile |
| `PATCH` | `/api/user/preferences` | 🔒 | Update unit preference |
| `GET` | `/api/weather?city=` | Public | Weather by city name |
| `GET` | `/api/weather/coords?lat=&lon=` | Public | Weather by GPS |
| `GET` | `/api/favorites` | 🔒 | List favourites |
| `POST` | `/api/favorites` | 🔒 | Add favourite |
| `DELETE` | `/api/favorites` | 🔒 | Remove favourite |

## 🧪 Tests

```bash
cd server && npm test
```

Covers: auth registration/login, weather data processing, forecast parsing.
