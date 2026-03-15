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
import NodeCache from 'node-cache';
import userRoutes from './routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const weatherCache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/auth', authLimiter);


const buildWeatherParams = (params) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const baseParams = { appid: apiKey, units: 'metric' };
  
  if (params.city) {
    baseParams.q = params.city;
  } else if (params.lat && params.lon) {
    baseParams.lat = params.lat;
    baseParams.lon = params.lon;
  } else {
    throw new Error('Missing location parameters');
  }
  return baseParams;
};

const extractCurrentConditions = (currentData) => ({
  city: currentData.name,
  country: currentData.sys.country,
  temperature: currentData.main.temp,
  feelsLike: currentData.main.feels_like,
  humidity: currentData.main.humidity,
  windSpeed: currentData.wind.speed,
  condition: currentData.weather[0].main,
  description: currentData.weather[0].description,
  icon: currentData.weather[0].icon,
});

const processForecastData = (forecastData) => {
  const dailyForecasts = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        icons: new Set(),
        conditions: new Set(),
      };
    }

    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].icons.add(item.weather[0].icon);
    dailyForecasts[date].conditions.add(item.weather[0].main);
  });

  return Object.values(dailyForecasts).map(dayData => ({
    day: dayData.day,
    tempHigh: Math.max(...dayData.temps),
    tempLow: Math.min(...dayData.temps),
    icon: Array.from(dayData.icons)[0],
    condition: Array.from(dayData.conditions)[0],
  })).slice(0, 5);
};

const fetchWeatherData = async (params) => {
  const cacheKey = params.city ? `city:${params.city}` : `coords:${params.lat},${params.lon}`;
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) return cachedData;

  const baseParams = buildWeatherParams(params);

  const [currentRes, forecastRes] = await Promise.all([
    axios.get('https://api.openweathermap.org/data/2.5/weather', { params: baseParams }),
    axios.get('https://api.openweathermap.org/data/2.5/forecast', { params: baseParams })
  ]);

  const finalData = {
    current: extractCurrentConditions(currentRes.data),
    forecast: processForecastData(forecastRes.data)
  };

  weatherCache.set(cacheKey, finalData);
  return finalData;
};

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

app.use('/api/auth', authRoutes);
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