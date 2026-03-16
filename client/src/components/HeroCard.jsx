import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Share2, Bookmark, ArrowUp, ArrowDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../App';
import api from '../lib/api';
import { convertTemp, convertWind } from '../utils/converters';

const GRADIENTS = {
  clear:        'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #0369a1 100%)',
  clouds:       'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
  rain:         'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  drizzle:      'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  snow:         'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #b8c8da 100%)',
  thunderstorm: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
  default:      'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
};

const EMOJIS = {
  clear: '☀️', clouds: '☁️', rain: '🌧️',
  drizzle: '🌦️', snow: '❄️', thunderstorm: '⛈️', default: '🌤️',
};

function getConditionKey(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear'))   return 'clear';
  if (c.includes('cloud'))   return 'clouds';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('rain'))    return 'rain';
  if (c.includes('snow'))    return 'snow';
  if (c.includes('thunder')) return 'thunderstorm';
  return 'default';
}

export default function HeroCard({ weatherData, units, onSetDefault }) {
  const { isAuthenticated } = useContext(AuthContext);
  const addToast = useContext(ToastContext);
  const [saving, setSaving] = useState(false);

  if (!weatherData?.current) return null;
  const { current, forecast } = weatherData;
  const today = forecast?.daily?.[0];
  const condKey = getConditionKey(current.condition);
  const gradient = GRADIENTS[condKey] ?? GRADIENTS.default;
  const emoji = EMOJIS[condKey] ?? EMOJIS.default;
  const unitLabel = units === 'metric' ? '°C' : '°F';

  const handleSave = async () => {
    if (!isAuthenticated) { addToast('Sign in to save favourites', 'info'); return; }
    setSaving(true);
    try {
      await api.post('/api/favorites', { city: `${current.city}, ${current.country}` });
      addToast(`${current.city} added to favourites ★`, 'success');
    } catch {
      addToast('Could not save favourite', 'error');
    } finally { setSaving(false); }
  };

  const handleShare = () => {
    const url = `${window.location.origin}?city=${encodeURIComponent(current.city)}`;
    navigator.clipboard?.writeText(url).then(() => addToast('Link copied!', 'info'));
  };

  const metaChips = [
    { icon: '💧', label: `${current.humidity}%`,                  sub: 'Humidity' },
    { icon: '💨', label: convertWind(current.windSpeed, units),    sub: 'Wind' },
    { icon: '🌡', label: `${convertTemp(current.feelsLike, units)}${unitLabel}`, sub: 'Feels like' },
    { icon: '👁', label: '10 km',                                  sub: 'Visibility' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[28px] p-8"
      style={{ border: '1px solid rgba(255,255,255,0.10)', minHeight: 260 }}
    >
      <div className="absolute inset-0 transition-all duration-700" style={{ background: gradient, opacity: 0.6 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(0,0,0,0.28) 0%,transparent 60%)' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span className="text-[22px] font-bold text-white leading-none">{current.city}</span>
              <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{current.country}</span>
            </div>

            <motion.div
              key={String(current.temperature) + units}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="text-white leading-none font-light"
              style={{ fontSize: 'clamp(64px, 10vw, 84px)', letterSpacing: '-3px' }}
            >
              {convertTemp(current.temperature, units)}
              <sup style={{ fontSize: 28, fontWeight: 400, letterSpacing: 0, verticalAlign: 'super' }}>
                {unitLabel}
              </sup>
            </motion.div>

            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium capitalize"
                style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.92)' }}
              >
                {emoji} {current.description}
              </span>
              {today && (
                <span className="flex items-center gap-2 text-[14px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <span className="flex items-center gap-0.5 text-white">
                    <ArrowUp size={12} style={{ color: '#f87171' }} />{convertTemp(today.tempHigh, units)}°
                  </span>
                  <span className="flex items-center gap-0.5" style={{ opacity: 0.55 }}>
                    <ArrowDown size={12} style={{ color: '#60a5fa' }} />{convertTemp(today.tempLow, units)}°
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span style={{ fontSize: 72, lineHeight: 1, filter: 'drop-shadow(0 4px 14px rgba(255,255,255,0.12))' }}>{emoji}</span>
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {metaChips.map(chip => (
            <div key={chip.sub} className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-[13px]"
              style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)' }}>
              <span style={{ fontSize: 14 }}>{chip.icon}</span>
              <span className="font-semibold">{chip.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11 }}>{chip.sub}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <ActionButton variant="primary" onClick={() => { localStorage.setItem('defaultCity', current.city); addToast(`${current.city} set as default`, 'success'); }}>
            <Bookmark size={13} /> Set default
          </ActionButton>
          <ActionButton variant="fav" onClick={handleSave} disabled={saving}>
            <Star size={13} /> {saving ? 'Saving…' : 'Save'}
          </ActionButton>
          <ActionButton variant="ghost" onClick={handleShare}>
            <Share2 size={13} /> Share
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ children, onClick, variant = 'ghost', disabled = false }) {
  const s = {
    primary: { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', color: '#fff' },
    fav:     { background: 'rgba(251,191,36,0.10)', borderColor: 'rgba(251,191,36,0.25)', color: 'rgba(251,191,36,0.9)' },
    ghost:   { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' },
  };
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold border cursor-pointer"
      style={{ ...s[variant], opacity: disabled ? 0.6 : 1 }}>
      {children}
    </motion.button>
  );
}
