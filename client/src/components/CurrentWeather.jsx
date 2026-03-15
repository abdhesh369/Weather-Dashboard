import { useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../App';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiDayCloudy,
  WiHumidity,
  WiStrongWind,
  WiThermometer
} from "react-icons/wi";

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <WiDaySunny />;
    case "clouds":
      return <WiCloudy />;
    case "rain":
    case "drizzle":
      return <WiRain />;
    case "snow":
      return <WiSnow />;
    case "thunderstorm":
      return <WiThunderstorm />;
    case "fog":
    case "mist":
    case "haze":
      return <WiFog />;
    default:
      return <WiDayCloudy />;
  }
};

import { motion } from 'framer-motion';
import { LiquidGlassCard } from './ui/liquid-weather-glass';

function CurrentWeather({ weatherData, onSetDefault, convertTemp, convertWind, units }) {
  const { isAuthenticated } = useContext(AuthContext);
  const addToast = useContext(ToastContext);

  const {
    city,
    country,
    temperature,
    description,
    condition,
    humidity,
    windSpeed,
    feelsLike,
  } = weatherData;

  const handleAddToFavorites = async () => {
    try {
      await api.post("/api/favorites", { city: `${city}, ${country}` });
      addToast(`${city} added to favorites!`, 'success');
    } catch (error) {
      console.error("Error adding to favorites:", error);
      addToast("Failed to add city to favorites.", 'error');
    }
  };

  const unitLabel = units === 'metric' ? '°C' : '°F';

  return (
    <LiquidGlassCard 
      className="current-weather-card"
      borderRadius="2rem"
      shadowIntensity="md"
      glowIntensity="sm"
    >
      <div className="weather-info-main">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {city}, {country}
        </motion.h2>
        <motion.div 
          className="temp-large"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
        >
          {convertTemp(temperature)}{unitLabel}
        </motion.div>
        <p className="weather-description">{description}</p>

        <div className="weather-actions">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSetDefault(city)} 
            className="btn-set-default"
          >
            Make Default
          </motion.button>
          {isAuthenticated && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToFavorites} 
              className="btn-add-favorite search-button"
            >
              Save Favorite
            </motion.button>
          )}
        </div>
      </div>

      <div className="weather-stats-column">
        <motion.div 
          className="weather-icon-large"
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {getWeatherIcon(condition)}
        </motion.div>

        <div className="weather-stats">
          <div className="stat-box">
            <WiThermometer size={24} />
            <span>Feels: {convertTemp(feelsLike)}{unitLabel}</span>
          </div>
          <div className="stat-box">
            <WiHumidity size={24} />
            <span>Hum: {humidity}%</span>
          </div>
          <div className="stat-box" style={{ gridColumn: 'span 2' }}>
            <WiStrongWind size={24} />
            <span>Wind: {convertWind(windSpeed)}</span>
          </div>
        </div>
      </div>
    </LiquidGlassCard>
  );
}

export default CurrentWeather;

