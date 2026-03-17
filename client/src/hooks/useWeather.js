import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';

const MAX_HISTORY = 6;
const CACHE_TTL   = 10 * 60 * 1000; // 10 min

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('searchHistory') || '[]'); }
    catch { return []; }
  });

  // Track whether we already have data so the loading flag is correct
  const hasData = useRef(false);

  const addToHistory = useCallback((cityName) => {
    setSearchHistory((prev) => {
      const updated = [cityName, ...prev.filter(c => c !== cityName)].slice(0, MAX_HISTORY);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchWeather = useCallback(async (params) => {
    if (!params?.city && !(params?.lat && params?.lon)) return;

    const cacheKey = params.city
      ? `weather_cache_${params.city.toLowerCase()}`
      : `weather_cache_coords_${params.lat}_${params.lon}`;

    // Serve stale data immediately while refreshing in background
    let servedFromCache = false;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setWeatherData(data);
          setLastUpdated(new Date(timestamp));
          hasData.current = true;
          servedFromCache = true;
        }
      }
    } catch {
      /* corrupt cache — ignore */
    }

    // Only show the loading skeleton when there's nothing to show yet
    if (!servedFromCache) {
      setLoading(true);
      hasData.current = false;
    }
    setError(null);

    try {
      const url = params.city
        ? `/api/weather?city=${encodeURIComponent(params.city)}`
        : `/api/weather/coords?lat=${params.lat}&lon=${params.lon}`;

      const response  = await api.get(url);
      const freshData = response.data;

      setWeatherData(freshData);
      setLastUpdated(new Date());
      hasData.current = true;
      addToHistory(freshData.current.city);

      localStorage.setItem(cacheKey, JSON.stringify({
        data:      freshData,
        timestamp: Date.now(),
      }));
    } catch (err) {
      // Only surface the error if we have nothing to show
      if (!servedFromCache) {
        setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => { setLoading(false); setError('Unable to retrieve your location. Please allow location access.'); }
    );
  }, [fetchWeather]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  // Load default city on mount
  useEffect(() => {
    const defaultCity = localStorage.getItem('defaultCity');
    if (defaultCity) fetchWeather({ city: defaultCity });
  }, [fetchWeather]);

  return {
    weatherData,
    loading,
    error,
    lastUpdated,
    searchHistory,
    clearHistory,
    fetchWeather,
    fetchByGeolocation,
  };
}
