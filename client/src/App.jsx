// client/src/App.jsx

import React, { useState, useEffect, useMemo, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useWeather } from './hooks/useWeather';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ToastContainer';

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

export const ToastContext = createContext(null);

import { convertTemp, convertWind } from './utils/converters';

function App() {
  const [units, setUnits] = useState(localStorage.getItem('units') || 'metric');
  const { weatherData, loading, error, searchHistory, fetchWeather, fetchByGeolocation } = useWeather();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  const chartData = useMemo(() => {
    if (!weatherData) return [];
    return weatherData.forecast.map(day => ({
      name: day.day,
      temperature: convertTemp(day.tempHigh),
    }));
  }, [weatherData, units]);

  const handleSetDefault = (city) => {
    localStorage.setItem('defaultCity', city);
    addToast(`${city} set as your default city`, 'success');
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
    <ToastContext.Provider value={addToast}>
      <div className={`app-wrapper ${getBackgroundClass()}`}>
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
                      <button className="btn-location" onClick={fetchByGeolocation} title="Use my current location">
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
                                className="history-item"
                                role="button"
                                tabIndex={0}
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
                          convertTemp={(t) => convertTemp(t, units)}
                          convertWind={(w) => convertWind(w, units)}
                          units={units}
                        />
                        <Forecast
                          forecastData={weatherData.forecast}
                          convertTemp={(t) => convertTemp(t, units)}
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export default App;