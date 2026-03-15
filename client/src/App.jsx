// client/src/App.jsx

import React, { useState, useEffect, useMemo, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import DemoPage from './pages/DemoPage';
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
      <div className={`app-wrapper transition-all duration-700 ${getBackgroundClass()}`}>
        <Navbar />
        <div className="App overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-content"
                >
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
                    <AnimatePresence mode="wait">
                      {loading && (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="loading-container glass-card"
                        >
                          <p className="loading-message">Fetching current conditions...</p>
                        </motion.div>
                      )}
                      {error && !loading && (
                        <motion.div 
                          key="error"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="error-container glass-card"
                        >
                          <p className="error-message">{error}</p>
                        </motion.div>
                      )}
                      {weatherData && !loading && !error && (
                        <motion.div 
                          key="weather-grid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="weather-grid"
                        >
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
                          <motion.div 
                            className="chart-section glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <WeatherChart data={chartData} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </main>
                </motion.div>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/demo" element={<DemoPage />} />
          </Routes>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export default App;