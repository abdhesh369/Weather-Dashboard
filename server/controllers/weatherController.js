import axios from 'axios';
import { getCached, setCached } from '../cache.js';

const buildUrl = (base, params) => {
  const url = new URL(base);
  url.searchParams.set('appid', process.env.WEATHER_API_KEY);
  url.searchParams.set('units', 'metric');
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  return url.toString();
};

const fmtTime = (unix) => {
  if (!unix) return null;
  return new Date(unix * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const extractCurrentConditions = (data) => ({
  city:        data.name,
  country:     data.sys.country,
  temperature: data.main.temp,
  feelsLike:   data.main.feels_like,
  tempMin:     data.main.temp_min,
  tempMax:     data.main.temp_max,
  humidity:    data.main.humidity,
  pressure:    data.main.pressure,
  windSpeed:   data.wind.speed,
  windDeg:     data.wind.deg ?? 0,
  windGust:    data.wind.gust ?? null,
  condition:   data.weather[0].main,
  description: data.weather[0].description,
  icon:        data.weather[0].icon,
  visibility:  data.visibility != null ? Math.round(data.visibility / 1000) : 10,
  cloudiness:  data.clouds?.all ?? 0,
  coord:       data.coord,
  sunrise:     fmtTime(data.sys.sunrise),
  sunset:      fmtTime(data.sys.sunset),
  sunriseUnix: data.sys.sunrise,
  sunsetUnix:  data.sys.sunset,
  timezone:    data.timezone ?? 0,
  dt:          data.dt,
});

export const processForecast = (forecastList) => {
  // ── Daily ──────────────────────────────────────────
  const dailyMap = {};
  for (const item of forecastList) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        date,
        temps: [], humidity: [], windSpeeds: [],
        icons: new Set(), conditions: new Set(),
        pop: 0, precipTotal: 0,
      };
    }
    const d = dailyMap[date];
    d.temps.push(item.main.temp);
    d.humidity.push(item.main.humidity);
    d.windSpeeds.push(item.wind.speed);
    d.icons.add(item.weather[0].icon);
    d.conditions.add(item.weather[0].main);
    d.pop = Math.max(d.pop, item.pop || 0);
    d.precipTotal += (item.rain?.['3h'] ?? item.snow?.['3h'] ?? 0);
  }

  const daily = Object.values(dailyMap).map(d => ({
    day:      d.day,
    date:     d.date,
    tempHigh: Math.max(...d.temps),
    tempLow:  Math.min(...d.temps),
    humidity: Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length),
    wind:     Math.round(d.windSpeeds.reduce((a, b) => a + b, 0) / d.windSpeeds.length * 10) / 10,
    icon:     d.icons.values().next().value,
    condition: [...d.conditions][0],
    pop:      Math.round(d.pop * 100),
    precipMm: Math.round(d.precipTotal * 10) / 10,
  })).slice(0, 7);

  // ── Hourly (up to 24 slots = 72 h) ────────────────
  const hourly = forecastList.slice(0, 24).map(item => ({
    time:       new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    dt:         item.dt,
    temp:       item.main.temp,
    feelsLike:  item.main.feels_like,
    humidity:   item.main.humidity,
    windSpeed:  item.wind.speed,
    windDeg:    item.wind.deg ?? 0,
    condition:  item.weather[0].main,
    description:item.weather[0].description,
    icon:       item.weather[0].icon,
    pop:        Math.round((item.pop || 0) * 100),
    precipMm:   (item.rain?.['3h'] ?? item.snow?.['3h'] ?? 0),
    cloudiness: item.clouds?.all ?? 0,
  }));

  return { daily, hourly };
};

// ── Try OWM One Call for alerts + UV (free tier may not support) ───
const tryOneCall = async (lat, lon) => {
  try {
    const url = buildUrl('https://api.openweathermap.org/data/3.0/onecall', {
      lat, lon, exclude: 'minutely,hourly,daily',
    });
    const res = await axios.get(url, { timeout: 4000 });
    return {
      uvi:    res.data.current?.uvi ?? null,
      alerts: (res.data.alerts ?? []).map(a => ({
        event:       a.event,
        start:       a.start,
        end:         a.end,
        description: a.description,
        sender_name: a.sender_name,
        severity:    null,
      })),
    };
  } catch {
    return null;
  }
};

// ── Legacy UV endpoint (v2.5, deprecated but still works on many keys) ─
const tryLegacyUV = async (lat, lon) => {
  try {
    const url = buildUrl('https://api.openweathermap.org/data/2.5/uvi', { lat, lon });
    const res = await axios.get(url, { timeout: 3000 });
    return res.data?.value ?? null;
  } catch {
    return null;
  }
};

export const getWeatherData = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'City or coordinates are required' });
    }

    const params   = city ? { q: city } : { lat, lon };
    const cacheKey = city ? `city:${city.toLowerCase()}` : `coords:${lat},${lon}`;

    const cached = await getCached(cacheKey);
    if (cached) return res.json(cached);

    // Fetch current + forecast in parallel
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(buildUrl('https://api.openweathermap.org/data/2.5/weather',   params)),
      axios.get(buildUrl('https://api.openweathermap.org/data/2.5/forecast',  params)),
    ]);

    const coords = currentRes.data.coord;

    // Fetch AQI + (One Call with alerts/UV) + legacy UV — all in parallel
    const [aqiRes, oneCall, legacyUV] = await Promise.all([
      axios.get(buildUrl('https://api.openweathermap.org/data/2.5/air_pollution',
        { lat: coords.lat, lon: coords.lon })),
      tryOneCall(coords.lat, coords.lon),
      tryLegacyUV(coords.lat, coords.lon),
    ]);

    const current = extractCurrentConditions(currentRes.data);

    // Attach UV index (prefer One Call, fall back to legacy endpoint)
    current.uvi = oneCall?.uvi ?? legacyUV ?? null;

    const result = {
      current,
      forecast:  processForecast(forecastRes.data.list),
      aqi:       aqiRes.data.list[0] ?? null,
      alerts:    oneCall?.alerts ?? [],
      fetchedAt: Date.now(),
    };

    await setCached(cacheKey, result);
    return res.json(result);
  } catch (err) {
    console.error('[Weather]', err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'Location not found. Please try another city name.' });
    }
    res.status(500).json({ message: 'Failed to fetch weather data. Please try again.' });
  }
};

export const getGeocodeData = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });

    const url  = buildUrl('http://api.openweathermap.org/geo/1.0/direct', { q, limit: 6 });
    const resp = await axios.get(url);

    res.json(resp.data.map(item => ({
      name:    item.name,
      country: item.country,
      state:   item.state,
      lat:     item.lat,
      lon:     item.lon,
    })));
  } catch (err) {
    console.error('[Geocode]', err.message);
    res.status(500).json({ message: 'Error fetching city suggestions' });
  }
};
