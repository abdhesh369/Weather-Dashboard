import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import { useWeather } from './hooks/useWeather';
import { useToast } from './hooks/useToast';
import { useWeatherBackground } from './hooks/useWeatherBackground';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
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
import LoadingSkeleton from './components/LoadingSkeleton';
import SunCard from './components/widgets/SunCard';
import UVCard from './components/widgets/UVCard';
import AQICard from './components/widgets/AQICard';
import AlertsBanner from './components/AlertsBanner';
import { ToastContainer } from './components/ToastContainer';
import WidgetErrorBoundary from './components/WidgetErrorBoundary';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import MobileBottomTab from './components/layout/MobileBottomTab';


export const ToastContext = createContext(null);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-[20px] text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-[15px] font-semibold" style={{ color: '#f87171' }}>Something went wrong</p>
          <p className="text-[13px] mt-1" style={{ color: 'rgba(248,113,113,0.7)' }}>{this.state.error?.message}</p>
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
  const { isAuthenticated } = React.useContext(AuthContext);

  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');

  const bgClass = useWeatherBackground(weatherData?.current?.condition);

  // Persist unit preference
  useEffect(() => { localStorage.setItem('units', units); }, [units]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => {
      const input = document.querySelector('input[placeholder*="Search"]');
      input?.focus();
    },
    onLocate: fetchByGeolocation,
    onToggleUnits: () => setUnits(u => u === 'metric' ? 'imperial' : 'metric')
  });

  // Fetch favourites when auth changes
  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
    else setFavorites([]);
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setFavLoading(true);
    try {
      const { data } = await api.get('/api/favorites');
      setFavorites(data);
    } catch { /* silent */ }
    finally { setFavLoading(false); }
  };

  const handleAddFavorite = async (city) => {
    if (!isAuthenticated) { addToast('Sign in to save favourites', 'info'); return; }
    try {
      const { data } = await api.post('/api/favorites', { city });
      setFavorites(data);
      addToast(`${city} added to favourites ★`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save favourite', 'error');
    }
  };

  const handleRemoveFavorite = async (city) => {
    try {
      const { data } = await api.delete('/api/favorites', { data: { city } });
      setFavorites(data);
      addToast(`${city} removed`, 'info');
    } catch {
      addToast('Failed to remove favourite', 'error');
    }
  };

  const currentCity = weatherData?.current?.city ?? null;

  // Derive chart data from daily forecast
  const chartData = weatherData?.forecast?.daily ?? [];

  return (
    <ToastContext.Provider value={addToast}>
      <div className={`app-wrapper ${bgClass} selection:bg-brand-primary/30 min-h-screen`}>
        <Navbar units={units} setUnits={setUnits} />

        <Routes>
          <Route
            path="/"
            element={
              <PageLayout
                left={
                  <div className="flex flex-col gap-5">
                    {/* Search */}
                    <AlertsBanner />
                    <SearchBar
                      onSearch={city => fetchWeather({ city })}
                      onLocate={fetchByGeolocation}
                      searchHistory={searchHistory}
                      favorites={favorites}
                    />

                    {/* Weather content */}
                    <AnimatePresence mode="wait">
                      {loading && (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <LoadingSkeleton />
                        </motion.div>
                      )}

                      {error && !loading && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="glass p-12 text-center rounded-[32px] border-rose-500/20"
                        >
                          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                          </div>
                          <p className="text-[18px] font-bold text-white mb-2">
                             Weather unavailable
                          </p>
                          <p className="text-[14px] text-white/40 max-w-[280px] mx-auto">
                            {error}
                          </p>
                        </motion.div>
                      )}

                      {!weatherData && !loading && !error && (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="py-32 text-center"
                        >
                          <div className="relative w-24 h-24 mx-auto mb-8">
                             <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full anim-float" />
                             <div className="relative text-[80px] leading-none opacity-80">🌤️</div>
                          </div>
                          <h2 className="text-[24px] font-bold text-white mb-3">
                            Ready to explore?
                          </h2>
                          <p className="text-[15px] text-white/40 max-w-[320px] mx-auto leading-relaxed">
                            Search for a city or use your location to get live weather updates with premium visual effects.
                          </p>
                        </motion.div>
                      )}

                      {weatherData && !loading && !error && (
                        <motion.div
                          key="weather"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex flex-col gap-4"
                        >
                          <ErrorBoundary>
                            <HeroCard
                              weatherData={weatherData}
                              units={units}
                            />

                            <HourlyForecast
                              hourlyData={weatherData.forecast?.hourly}
                              units={units}
                            />

                            <WeatherChart
                              data={chartData}
                              units={units}
                            />

                            <StatsGrid
                              weatherData={weatherData}
                              units={units}
                            />
                          </ErrorBoundary>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                }
                right={
                  <div className="flex flex-col gap-4">
                    {weatherData && (
                      <>
                        <DailyForecast
                          dailyData={weatherData.forecast?.daily}
                          units={units}
                        />
                        <SunCard sunrise="6:12" sunset="20:34" />
                        <UVCard uv={weatherData.current?.uvi ?? 4} />
                        <AQICard aqiData={weatherData.aqi} />
                      </>
                    )}

                    {isAuthenticated && (
                      <FavoritesList
                        favorites={favorites}
                        loading={favLoading}
                        onCityClick={city => fetchWeather({ city })}
                        onRemoveFavorite={handleRemoveFavorite}
                        currentCity={currentCity}
                        onAddCurrentCity={() => currentCity && handleAddFavorite(currentCity)}
                      />
                    )}
                  </div>
                }
              />
            }
          />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export default App;
