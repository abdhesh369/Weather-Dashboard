import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Hooks
import { useWeather } from './hooks/useWeather';
import { useToast } from './hooks/useToast';
import { useWeatherBackground } from './hooks/useWeatherBackground';
import { AuthContext } from './context/AuthContext';
import api from './lib/api';

// Components
import Navbar from './components/Navbar';
import PageLayout from './components/layout/PageLayout';
import SearchBar from './components/SearchBar';
import HeroCard from './components/HeroCard';
import StatsGrid from './components/StatsGrid';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherChart from './components/WeatherChart';
import FavoritesList from './components/FavoritesList';
import { ToastContainer } from './components/ToastContainer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { convertTemp } from './utils/converters';


// Contexts
export const ToastContext = createContext(null);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="text-sm opacity-80">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {

  const [units, setUnits] = useState(localStorage.getItem('units') || 'metric');
  const { weatherData, loading, error, searchHistory, fetchWeather, fetchByGeolocation } = useWeather();
  const { toasts, addToast, removeToast } = useToast();
  const { isAuthenticated, token } = React.useContext(AuthContext);

  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const bgClass = useWeatherBackground(weatherData?.current?.condition);

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, token]);

  const fetchFavorites = async () => {
    setFavLoading(true);
    try {
      const response = await api.get('/api/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddFavorite = async (city) => {
    if (!isAuthenticated) {
      addToast('Please log in to save favorites', 'info');
      return;
    }
    try {
      const response = await api.post('/api/favorites', { city });
      setFavorites(response.data);
      addToast(`${city} added to favorites!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add favorite', 'error');
    }
  };

  const handleRemoveFavorite = async (city) => {
    try {
      const response = await api.delete('/api/favorites', { data: { city } });
      setFavorites(response.data);
      addToast(`${city} removed from favorites`, 'success');
    } catch (err) {
      addToast('Failed to remove favorite', 'error');
    }
  };

  const isFavorite = (cityName) => {
    if (!weatherData) return false;
    return favorites.some(fav => fav.toLowerCase().includes(weatherData.current.city.toLowerCase()));
  };

  return (
    <ToastContext.Provider value={addToast}>
      <div className={`app-wrapper ${bgClass}`}>
        <Navbar units={units} setUnits={setUnits} />
        
        <Routes>
          <Route
            path="/"
            element={
              <PageLayout
                left={
                  <div className="flex flex-col gap-8">
                    {/* Search Section */}
                    <SearchBar 
                      onSearch={(city) => fetchWeather({ city })}
                      onLocate={fetchByGeolocation}
                      searchHistory={searchHistory}
                      favorites={favorites}
                    />

                    {/* Main Content */}
                    <AnimatePresence mode="wait">
                      {loading && (
                        <div className="p-12 text-center text-white/50 animate-pulse">
                          Fetching current conditions...
                        </div>
                      )}
                      {error && !loading && (
                        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                          {error}
                        </div>
                      )}
                      {weatherData && !loading && !error && (
                        <ErrorBoundary>
                          <div className="anim-fade-up flex flex-col gap-6">
                            <HeroCard 
                              weatherData={weatherData}
                              units={units}
                              onAddFavorite={handleAddFavorite}
                              isFavorite={isFavorite(weatherData.current.city)}
                            />

                            <HourlyForecast 
                              hourlyData={weatherData.forecast?.hourly} 
                              units={units} 
                            />

                            <WeatherChart 
                              data={weatherData.forecast?.daily?.map(d => ({
                                name: d.day,
                                temperature: convertTemp(d.tempHigh, units)
                              }))} 
                            />

                            <StatsGrid 
                              weatherData={weatherData} 
                              units={units} 
                            />

                          </div>
                        </ErrorBoundary>
                      )}
                    </AnimatePresence>

                  </div>
                }
                right={
                  <div className="flex flex-col gap-6">
                    {weatherData && (
                      <DailyForecast 
                        dailyData={weatherData.forecast?.daily} 
                        units={units} 
                      />
                    )}
                    <FavoritesList 
                      favorites={favorites} 
                      loading={favLoading}
                      onCityClick={(city) => fetchWeather({ city })}
                      onRemoveFavorite={handleRemoveFavorite}
                    />
                  </div>
                }
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export default App;