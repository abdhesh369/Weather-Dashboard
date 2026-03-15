// client/src/App.jsx

import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './lib/api';
import { Toaster, toast } from 'react-hot-toast';

import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherChart from './components/WeatherChart';
import FavoritesList from './components/FavoritesList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnitToggle from './components/UnitToggle';

import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [units, setUnits] = useState(localStorage.getItem('units') || 'metric');

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
    const defaultCity = localStorage.getItem('defaultCity');
    if (defaultCity) {
      fetchWeather({ city: defaultCity });
    }
  }, []);

  const convertTemp = (tempInCelsius) => {
    if (units === 'metric') return Math.round(tempInCelsius);
    return Math.round((tempInCelsius * 9 / 5) + 32);
  };

  const chartData = useMemo(() => {
    if (!weatherData) return [];
    return weatherData.forecast.map(day => ({
      name: day.day,
      temperature: convertTemp(day.tempHigh),
    }));
  }, [weatherData, units]);

  const handleSetDefault = (city) => {
    localStorage.setItem('defaultCity', city);
    toast.success(`${city} set as default city!`);
  };

  const fetchWeather = async (params) => {
    if (!params || (!params.city && (!params.lat || !params.lon))) {
      console.warn('fetchWeather called with insufficient parameters');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = '/api/weather';
      if (params.city) {
        url += `?city=${encodeURIComponent(params.city)}`;
      } else if (params.lat && params.lon) {
        url = `/api/weather/coords?lat=${params.lat}&lon=${params.lon}`;
      }

      const response = await api.get(url);
      const data = response.data;
      setWeatherData(data);

      const cityName = `${data.current.city}, ${data.current.country}`;
      const updatedHistory = [cityName, ...searchHistory.filter(item => item !== cityName)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setError("Unable to retrieve your location");
      }
    );
  };

  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-default';
    const condition = weatherData.current.condition.toLowerCase();
    if (condition.includes('clear')) return 'bg-clear';
    if (condition.includes('cloud')) return 'bg-clouds';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-rain';
    if (condition.includes('snow')) return 'bg-snow';
    return 'bg-default';
  };

  return (
    <div className={`app-wrapper ${getBackgroundClass()}`}>
      <Toaster position="top-right" />
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="dashboard-content animate-stagger">
                <header>
                  <div className="header-top">
                    <h1>SkyCast</h1>
                    <UnitToggle units={units} setUnits={setUnits} />
                  </div>
                  <div className="search-container glass-card">
                    <SearchForm onSearch={(city) => fetchWeather({ city })} />
                    <button className="btn-location" onClick={handleUseMyLocation} title="Use my current location">
                      Use My Location
                    </button>
                  </div>

                  <div className="dashboard-extras">
                    {searchHistory.length > 0 && (
                      <div className="search-history-section">
                        <ul className="history-list">
                          {searchHistory.map(city => (
                            <li
                              key={city}
                              role="button"
                              tabIndex={0}
                              className="history-item"
                              onClick={() => fetchWeather({ city })}
                              onKeyDown={(e) => e.key === 'Enter' && fetchWeather({ city })}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FavoritesList onCityClick={(city) => fetchWeather({ city })} />
                  </div>
                </header>

                <main>
                  {loading && (
                    <div className="loading-container glass-card animate-fade">
                      <p className="loading-message">Fetching current conditions...</p>
                    </div>
                  )}
                  {error && !loading && (
                    <div className="error-container glass-card animate-fade">
                      <p className="error-message">{error}</p>
                    </div>
                  )}
                  {weatherData && !loading && !error && (
                    <div className="weather-grid">
                      <CurrentWeather
                        weatherData={weatherData.current}
                        onSetDefault={handleSetDefault}
                        convertTemp={convertTemp}
                        units={units}
                      />
                      <Forecast
                        forecastData={weatherData.forecast}
                        convertTemp={convertTemp}
                        units={units}
                      />
                      <div className="chart-section glass-card animate-fade">
                        <WeatherChart data={chartData} />
                      </div>
                    </div>
                  )}
                </main>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;