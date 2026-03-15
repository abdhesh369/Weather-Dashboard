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
import UnitToggle from './components/UnitToggle';

import './App.css';

export const ToastContext = createContext(null);

import { LiquidGlassCard } from './components/ui/liquid-weather-glass';

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
                    <LiquidGlassCard 
                      className="search-container p-4"
                      borderRadius="1.5rem"
                      shadowIntensity="sm"
                      glowIntensity="none"
                    >
                      <SearchForm onSearch={(city) => fetchWeather({ city })} />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-location" 
                        onClick={fetchByGeolocation} 
                        title="Use my current location"
                      >
                        Use My Location
                      </motion.button>
                    </LiquidGlassCard>

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
                        <LiquidGlassCard 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="loading-container p-8"
                          borderRadius="1.5rem"
                        >
                          <p className="loading-message">Fetching current conditions...</p>
                        </LiquidGlassCard>
                      )}
                      {error && !loading && (
                        <LiquidGlassCard 
                          key="error"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="error-container p-8"
                          borderRadius="1.5rem"
                        >
                          <p className="error-message">{error}</p>
                        </LiquidGlassCard>
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
                          <LiquidGlassCard 
                            className="chart-section p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            borderRadius="2rem"
                          >
                            <WeatherChart data={chartData} />
                          </LiquidGlassCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </main>
                </motion.div>
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