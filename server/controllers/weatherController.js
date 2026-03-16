import axios from 'axios';
import { getCached, setCached } from '../cache.js';

const buildWeatherUrl = (base, params) => {
  const url = new URL(base);
  url.searchParams.set('appid', process.env.WEATHER_API_KEY);
  url.searchParams.set('units', 'metric');
  if (params.city) url.searchParams.set('q', params.city);
  if (params.lat)  url.searchParams.set('lat', params.lat);
  if (params.lon)  url.searchParams.set('lon', params.lon);
  return url.toString();
};

export const extractCurrentConditions = (data) => ({
  city: data.name,
  country: data.sys.country,
  temperature: data.main.temp,
  feelsLike: data.main.feels_like,
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  windSpeed: data.wind.speed,
  windDeg: data.wind.deg,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  coord: data.coord,
});

export const processForecast = (forecastList) => {
  const dailyMap = {};
  for (const item of forecastList) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!dailyMap[date]) {
      dailyMap[date] = {
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        icons: new Set(),
        conditions: new Set(),
        pop: 0,
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].icons.add(item.weather[0].icon);
    dailyMap[date].conditions.add(item.weather[0].main);
    dailyMap[date].pop = Math.max(dailyMap[date].pop, item.pop || 0);
  }
  
  return {
    daily: Object.values(dailyMap).map((d) => ({
      day: d.day,
      tempHigh: Math.max(...d.temps),
      tempLow: Math.min(...d.temps),
      icon: d.icons.values().next().value,
      condition: d.conditions.values().next().value,
      pop: Math.round(d.pop * 100),
    })).slice(0, 5),
    hourly: forecastList.slice(0, 8).map((item) => {
      return {
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp: item.main.temp,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        pop: Math.round((item.pop || 0) * 100),
      };
    })
  };
};

export const getWeatherData = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'City or coordinates are required' });
    }

    const params = city ? { city } : { lat, lon };
    const cacheKey = city
      ? `city:${city.toLowerCase()}`
      : `coords:${lat},${lon}`;

    const cached = await getCached(cacheKey);
    if (cached) return res.json(cached);

    // Initial weather & forecast fetch
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(buildWeatherUrl('https://api.openweathermap.org/data/2.5/weather', params)),
      axios.get(buildWeatherUrl('https://api.openweathermap.org/data/2.5/forecast', params)),
    ]);

    const coords = currentRes.data.coord;
    
    // Fetch AQI using coordinates from the first response
    const aqiRes = await axios.get(buildWeatherUrl('https://api.openweathermap.org/data/2.5/air_pollution', { lat: coords.lat, lon: coords.lon }));

    const result = {
      current: extractCurrentConditions(currentRes.data),
      forecast: processForecast(forecastRes.data.list),
      aqi: aqiRes.data.list[0],
    };

    await setCached(cacheKey, result);
    return res.json(result);
  } catch (error) {
    console.error('Weather Controller Error:', error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(500).json({ message: 'An error occurred while fetching weather data.' });
  }
};
