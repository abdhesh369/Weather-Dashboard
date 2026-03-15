import connectDB from './db.js';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import { getCached, setCached } from './cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'WEATHER_API_KEY'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

connectDB();

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Builds the API URL using URLSearchParams (keeps API key out of logs)
const buildWeatherUrl = (base, params) => {
  const url = new URL(base);
  url.searchParams.set('appid', process.env.WEATHER_API_KEY);
  url.searchParams.set('units', 'metric');
  if (params.city) url.searchParams.set('q', params.city);
  if (params.lat)  url.searchParams.set('lat', params.lat);
  if (params.lon)  url.searchParams.set('lon', params.lon);
  return url.toString();
};

// Shapes the /weather endpoint response
const extractCurrentConditions = (data) => ({
  city: data.name,
  country: data.sys.country,
  temperature: data.main.temp,
  feelsLike: data.main.feels_like,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
});

// Groups 3-hourly slots into daily forecasts
const processForecast = (forecastList) => {
  const dailyMap = {};
  for (const item of forecastList) {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    if (!dailyMap[date]) {
      dailyMap[date] = {
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        icons: new Set(),
        conditions: new Set(),
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].icons.add(item.weather[0].icon);
    dailyMap[date].conditions.add(item.weather[0].main);
  }
  return Object.values(dailyMap).map((d) => ({
    day: d.day,
    tempHigh: Math.max(...d.temps),
    tempLow: Math.min(...d.temps),
    icon: d.icons.values().next().value,
    condition: d.conditions.values().next().value,
  })).slice(0, 5);
};

// Orchestrator — calls both APIs in parallel
const fetchWeatherData = async (params) => {
  const cacheKey = params.city
    ? `city:${params.city.toLowerCase()}`
    : `coords:${params.lat},${params.lon}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(buildWeatherUrl('https://api.openweathermap.org/data/2.5/weather', params)),
    axios.get(buildWeatherUrl('https://api.openweathermap.org/data/2.5/forecast', params)),
  ]);

  const result = {
    current: extractCurrentConditions(currentRes.data),
    forecast: processForecast(forecastRes.data.list),
  };

  setCached(cacheKey, result);
  return result;
};

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: 'City parameter is required' });

    const data = await fetchWeatherData({ city });
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found.' });
    }
    res.status(500).json({ message: 'An error occurred while fetching weather data.' });
  }
});

app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'Latitude and longitude are required' });

    const data = await fetchWeatherData({ lat, lon });
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data by coords:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching weather data.' });
  }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});