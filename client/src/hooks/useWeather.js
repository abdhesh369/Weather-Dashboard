import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const MAX_HISTORY = 5;

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((cityName) => {
    setSearchHistory((prev) => {
      const updated = [cityName, ...prev.filter((c) => c !== cityName)].slice(0, MAX_HISTORY);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchWeather = useCallback(async (params) => {
    if (!params?.city && !(params?.lat && params?.lon)) return;

    const cacheKey = params.city 
      ? `weather_cache_${params.city.toLowerCase()}` 
      : `weather_cache_coords_${params.lat}_${params.lon}`;

    // Try to load from cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > 10 * 60 * 1000; // 10 mins
        if (!isExpired) {
          setWeatherData(data);
          // Still fetch in background to refresh, but don't set loading if we have valid cache
          // (Wait, user wants instant load, but silent refresh is better)
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    setLoading((prevLoading) => {
      // If we don't have data, we must show loading
      // If we do have data (from cache), we don't show loading (silent refresh)
      return weatherData ? prevLoading : true;
    });
    setError(null);

    try {
      let url;
      if (params.city) {
        url = `/api/weather?city=${encodeURIComponent(params.city)}`;
      } else {
        url = `/api/weather/coords?lat=${params.lat}&lon=${params.lon}`;
      }

      const response = await api.get(url);
      setWeatherData(response.data);
      addToHistory(response.data.current.city);
      
      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError('Unable to retrieve your location.')
    );
  }, [fetchWeather]);

  useEffect(() => {
    const defaultCity = localStorage.getItem('defaultCity');
    if (defaultCity) {
      fetchWeather({ city: defaultCity });
    }
    // No silent geolocation on mount — user must click the button
  }, [fetchWeather]);

  return { weatherData, loading, error, searchHistory, fetchWeather, fetchByGeolocation };
}

