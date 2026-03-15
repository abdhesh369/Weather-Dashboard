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
    <div className="current-weather-card glass-card animate-fade">
      <div className="weather-info-main">
        <h2>{city}, {country}</h2>
        <div className="temp-large">{convertTemp(temperature)}{unitLabel}</div>
        <p className="weather-description">{description}</p>

        <div className="weather-actions">
          <button onClick={() => onSetDefault(city)} className="btn-set-default">
            Make Default
          </button>
          {isAuthenticated && (
            <button onClick={handleAddToFavorites} className="btn-add-favorite search-button">
              Save Favorite
            </button>
          )}
        </div>
      </div>

      <div className="weather-stats-column">
        <div className="weather-icon-large">
          {getWeatherIcon(condition)}
        </div>

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
    </div>
  );
}

export default CurrentWeather;

