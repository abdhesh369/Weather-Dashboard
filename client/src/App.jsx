import React, { useState, useEffect, createContext, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useWeather }           from './hooks/useWeather';
import { useToast }             from './hooks/useToast';
import { useWeatherBackground } from './hooks/useWeatherBackground';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AuthContext }          from './context/AuthContext';
import api                      from './lib/api';

import Navbar              from './components/Navbar';
import PageLayout          from './components/layout/PageLayout';
import SearchBar           from './components/SearchBar';
import HeroCard            from './components/HeroCard';
import StatsGrid           from './components/StatsGrid';
import HourlyForecast      from './components/HourlyForecast';
import DailyForecast       from './components/DailyForecast';
import WeatherChart        from './components/WeatherChart';
import FavoritesList       from './components/FavoritesList';
import LoadingSkeleton     from './components/LoadingSkeleton';
import SunCard             from './components/widgets/SunCard';
import UVCard              from './components/widgets/UVCard';
import AQICard             from './components/widgets/AQICard';
import WindCard            from './components/widgets/WindCard';
import AlertsBanner        from './components/AlertsBanner';
import { ToastContainer }  from './components/ToastContainer';
import WidgetErrorBoundary from './components/WidgetErrorBoundary';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import NotFoundPage        from './pages/NotFoundPage';
import MobileBottomTab     from './components/layout/MobileBottomTab';
import WeatherBackground   from './components/layout/WeatherBackground';
import { CloudSun, RefreshCw } from 'lucide-react';

export const ToastContext = createContext(null);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="p-8 rounded-[20px] text-center"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <p className="text-[15px] font-semibold" style={{ color: '#f87171' }}>Something went wrong</p>
        <p className="text-[13px] mt-1 opacity-60">{this.state.error?.message}</p>
      </div>
    );
    return this.props.children;
  }
}

function LastUpdatedBadge({ ts }) {
  if (!ts) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center gap-1.5 text-[11px] font-medium"
      style={{ color: 'rgba(255,255,255,0.22)' }}>
      <RefreshCw size={10} />
      Updated {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </motion.div>
  );
}

function EmptyState({ onLocate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="py-28 text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full anim-float" />
        <CloudSun size={80} className="relative text-white/80 drop-shadow-2xl" />
      </div>
      <h2 className="text-[24px] font-bold text-white mb-3">Ready to explore?</h2>
      <p className="text-[15px] text-white/38 max-w-[320px] mx-auto leading-relaxed mb-8">
        Search for a city or tap below to get live weather with beautiful visuals.
      </p>
      <motion.button
        onClick={onLocate}
        whileHover={{ scale: 1.04, translateY: -2 }}
        whileTap={{ scale: 0.96 }}
        className="px-6 py-3 rounded-full text-[14px] font-bold text-white border-none cursor-pointer"
        style={{ background: 'var(--brand-primary)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}
      >
        📍 Use my location
      </motion.button>
    </motion.div>
  );
}

function App() {
  const [units, setUnits] = useState(localStorage.getItem('units') || 'metric');
  const {
    weatherData, loading, error, lastUpdated,
    searchHistory, clearHistory, fetchWeather, fetchByGeolocation,
  } = useWeather();

  const { toasts, addToast, removeToast } = useToast();
  const { isAuthenticated }               = React.useContext(AuthContext);

  const [favorites,  setFavorites]  = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [activeTab,  setActiveTab]  = useState('now');

  useWeatherBackground(weatherData?.current?.condition);

  useEffect(() => { localStorage.setItem('units', units); }, [units]);

  useKeyboardShortcuts({
    onFocusSearch:  () => document.querySelector('input[aria-label="Search for a city"]')?.focus(),
    onLocate:        fetchByGeolocation,
    onToggleUnits:   () => setUnits(u => u === 'metric' ? 'imperial' : 'metric'),
  });

  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
    else setFavorites([]);
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setFavLoading(true);
    try { const { data } = await api.get('/api/favorites'); setFavorites(data); }
    catch { /* silent */ }
    finally { setFavLoading(false); }
  };

  const handleAddFavorite = async (city) => {
    if (!isAuthenticated) { addToast('Sign in to save favourites', 'info'); return; }
    try {
      const { data } = await api.post('/api/favorites', { city });
      setFavorites(data);
      addToast(`${city} added to favourites ★`, 'success');
    } catch (err) { addToast(err.response?.data?.message || 'Failed to save favourite', 'error'); }
  };

  const handleRemoveFavorite = async (city) => {
    try {
      const { data } = await api.delete('/api/favorites', { data: { city } });
      setFavorites(data);
      addToast(`${city} removed`, 'info');
    } catch { addToast('Failed to remove favourite', 'error'); }
  };

  const current    = weatherData?.current;
  const chartData  = weatherData?.forecast?.daily ?? [];
  const alerts     = weatherData?.alerts ?? [];

  return (
    <ToastContext.Provider value={addToast}>
      <div className="app-wrapper selection:bg-brand-primary/30 min-h-screen relative">
        <WeatherBackground condition={current?.condition} />
        <Navbar units={units} setUnits={setUnits} />

        <Routes>
          <Route path="/" element={
            <PageLayout
              left={
                <div className="flex flex-col gap-5">
                  {/* Alerts banner — only when there are actual alerts */}
                  {alerts.length > 0 && <AlertsBanner alerts={alerts} />}

                  <SearchBar
                    onSearch={city => fetchWeather({ city })}
                    onLocate={fetchByGeolocation}
                    searchHistory={searchHistory}
                    onClearHistory={clearHistory}
                    favorites={favorites}
                  />

                  {lastUpdated && !loading && (
                    <div className="flex justify-end -mt-2 pr-1">
                      <LastUpdatedBadge ts={lastUpdated} />
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {loading && (
                      <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoadingSkeleton />
                      </motion.div>
                    )}

                    {error && !loading && (
                      <motion.div key="error"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="glass p-12 text-center rounded-[32px]"
                        style={{ border: '1px solid rgba(248,113,113,0.15)' }}>
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                          <span className="text-3xl">⚠️</span>
                        </div>
                        <p className="text-[18px] font-bold text-white mb-2">Weather unavailable</p>
                        <p className="text-[14px] text-white/38 max-w-[260px] mx-auto">{error}</p>
                      </motion.div>
                    )}

                    {!weatherData && !loading && !error && (
                      <EmptyState key="empty" onLocate={fetchByGeolocation} />
                    )}

                    {weatherData && !loading && !error && (
                      <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col gap-5">
                        <ErrorBoundary>
                          {/* Each section gets an ID for MobileBottomTab scroll targets */}
                          <div id="section-hero">
                            <HeroCard weatherData={weatherData} units={units}
                              onSetDefault={city => {
                                localStorage.setItem('defaultCity', city);
                                addToast(`${city} set as default`, 'success');
                              }} />
                          </div>

                          <div id="section-hourly">
                            <HourlyForecast hourlyData={weatherData.forecast?.hourly} units={units} />
                          </div>

                          <div id="section-chart">
                            <WeatherChart data={chartData} units={units} />
                          </div>

                          <div id="section-stats">
                            <StatsGrid weatherData={weatherData} units={units} />
                          </div>
                        </ErrorBoundary>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              }
              right={
                <div className="flex flex-col gap-4" id="section-sidebar">
                  {weatherData && (
                    <>
                      <WidgetErrorBoundary>
                        <DailyForecast dailyData={weatherData.forecast?.daily} units={units} />
                      </WidgetErrorBoundary>
                      <WidgetErrorBoundary>
                        <SunCard sunrise={current?.sunrise} sunset={current?.sunset} />
                      </WidgetErrorBoundary>
                      <WidgetErrorBoundary>
                        <UVCard uv={current?.uvi ?? 0} />
                      </WidgetErrorBoundary>
                      <WidgetErrorBoundary>
                        <WindCard
                          speed={current?.windSpeed}
                          deg={current?.windDeg}
                          gust={current?.windGust}
                          units={units}
                        />
                      </WidgetErrorBoundary>
                      <WidgetErrorBoundary>
                        <AQICard aqiData={weatherData.aqi} />
                      </WidgetErrorBoundary>
                    </>
                  )}
                  {isAuthenticated && (
                    <FavoritesList
                      favorites={favorites} loading={favLoading}
                      onCityClick={city => fetchWeather({ city })}
                      onRemoveFavorite={handleRemoveFavorite}
                      currentCity={current?.city ?? null}
                      onAddCurrentCity={() => current?.city && handleAddFavorite(current.city)}
                    />
                  )}
                </div>
              }
            />
          } />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*"         element={<NotFoundPage />} />
        </Routes>
      </div>

      <MobileBottomTab activeTab={activeTab} onTabChange={setActiveTab} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export default App;
