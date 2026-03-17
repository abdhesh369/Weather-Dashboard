import { useContext, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Star, Share2, Bookmark, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherIcon } from '../lib/weatherIcons';
import AnimatedCounter from './ui/AnimatedCounter';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../App';
import api from '../lib/api';
import { convertTemp, convertWind, degreesToCompass, dewPoint, heatIndex, windChill } from '../utils/converters';
import WeatherParticles from './ui/WeatherParticles';

const GRADIENTS = {
  clear:        'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #0369a1 100%)',
  clouds:       'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
  rain:         'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  drizzle:      'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  snow:         'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #b8c8da 100%)',
  thunderstorm: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
  mist:         'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
  fog:          'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
  default:      'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
};

function getConditionKey(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear'))   return 'clear';
  if (c.includes('cloud'))   return 'clouds';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('rain'))    return 'rain';
  if (c.includes('snow'))    return 'snow';
  if (c.includes('thunder')) return 'thunderstorm';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'fog';
  return 'default';
}

export default function HeroCard({ weatherData, units, onSetDefault }) {
  const { isAuthenticated } = useContext(AuthContext);
  const addToast             = useContext(ToastContext);
  const [saving, setSaving]  = useState(false);

  if (!weatherData?.current) return null;
  const { current, forecast } = weatherData;
  const today    = forecast?.daily?.[0];
  const condKey  = getConditionKey(current.condition);
  const gradient = GRADIENTS[condKey] ?? GRADIENTS.default;
  const unitLabel = units === 'metric' ? '°C' : '°F';

  // Computed comfort indices
  const dp = dewPoint(current.temperature, current.humidity);
  const hi = heatIndex(current.temperature, current.humidity);
  const wc = windChill(current.temperature, current.windSpeed * 3.6); // m/s → km/h
  const comfortVal = hi ?? wc;
  const comfortLabel = hi ? 'Heat index' : wc ? 'Wind chill' : null;

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
    { emoji: '💧', label: `${current.humidity}%`,                           sub: 'Humidity' },
    { emoji: '💨', label: convertWind(current.windSpeed, units),             sub: `Wind ${degreesToCompass(current.windDeg ?? 0)}` },
    { emoji: '🌡', label: `${convertTemp(current.feelsLike, units)}${unitLabel}`, sub: 'Feels like' },
    ...(current.windGust ? [{ emoji: '🌬', label: convertWind(current.windGust, units), sub: 'Gust' }] : []),
    ...(comfortLabel && comfortVal ? [{ emoji: hi ? '🥵' : '🥶', label: `${convertTemp(comfortVal, units)}${unitLabel}`, sub: comfortLabel }] : []),
    { emoji: '💦', label: `${convertTemp(dp, units)}${unitLabel}`,           sub: 'Dew point' },
  ];

  // 3D tilt
  const x = useMotionValue(0), y = useMotionValue(0);
  const xS = useSpring(x), yS = useSpring(y);
  const rotateX = useTransform(yS, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(xS, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass glass-interactive shimmer-active relative overflow-hidden rounded-[32px] group"
      style={{ padding: '48px', rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {/* Background */}
      <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
           style={{ background: gradient, opacity: 0.72 }} />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)' }} />

      <WeatherParticles condition={current.condition} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* City badge */}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 mb-4 bg-black/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/10"
            >
              <MapPin size={11} className="text-white/60" />
              <span className="text-[13px] font-semibold text-white tracking-wide uppercase">
                {current.city}, {current.country}
              </span>
            </motion.div>

            {/* Temperature */}
            <div className="flex items-center gap-5 flex-wrap">
              <motion.div
                key={String(current.temperature) + units}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                className="text-white leading-none font-bold tracking-tight"
                style={{ fontSize: 'clamp(64px, 9vw, 100px)', textShadow: 'var(--text-shadow-md)' }}
              >
                <AnimatedCounter value={Number(convertTemp(current.temperature, units))} />
                <span className="text-[18px] font-medium opacity-55 ml-1 align-top mt-3 inline-block">{unitLabel}</span>
              </motion.div>

              <div className="h-16 w-px bg-white/10 hidden md:block" />

              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[20px] md:text-[28px] font-bold text-white capitalize leading-tight tracking-tight"
                  style={{ textShadow: 'var(--text-shadow-sm)' }}>
                  {current.description}
                </span>
                {today && (
                  <div className="flex items-center gap-3 text-[14px] font-semibold text-white/65">
                    <span className="flex items-center gap-1">
                      <ArrowUp size={13} className="text-rose-400" />
                      <AnimatedCounter value={Number(convertTemp(today.tempHigh, units))} />°
                    </span>
                    <span className="flex items-center gap-1 opacity-70">
                      <ArrowDown size={13} className="text-blue-400" />
                      <AnimatedCounter value={Number(convertTemp(today.tempLow, units))} />°
                    </span>
                    <span className="text-white/30 text-[12px]">Today</span>
                  </div>
                )}
                {/* Cloudiness */}
                {current.cloudiness !== undefined && (
                  <span className="text-[12px] text-white/45 font-medium">
                    {current.cloudiness}% cloud cover
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Weather icon + date */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-white drop-shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <div className="relative filter saturate-[1.2]">
                {getWeatherIcon(current.condition, 68)}
              </div>
            </motion.div>
            <span className="text-[12px] font-medium text-white/45 tracking-wide text-right">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Bottom row — meta chips + actions */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-3">
            {metaChips.map(chip => (
              <div key={chip.sub}
                className="flex flex-col gap-0.5 bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-[16px] border border-white/8 hover:bg-black/30 transition-colors group/chip">
                <span className="text-[9px] font-bold text-white/35 uppercase tracking-[0.12em]">{chip.sub}</span>
                <div className="flex items-center gap-1.5 font-bold text-white text-[15px]">
                  <span className="group-hover/chip:scale-110 transition-transform">{chip.emoji}</span>
                  {chip.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <ActionButton variant="primary" onClick={() => {
              localStorage.setItem('defaultCity', current.city);
              addToast(`${current.city} set as default`, 'success');
            }} title="Set as default">
              <Bookmark size={13} />
            </ActionButton>
            <ActionButton variant="fav" onClick={handleSave} disabled={saving} title="Save favourite">
              <Star size={13} />
            </ActionButton>
            <ActionButton variant="ghost" onClick={handleShare} title="Copy link">
              <Share2 size={13} />
            </ActionButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ children, onClick, variant = 'ghost', disabled = false, title }) {
  const s = {
    primary: { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', color: '#fff' },
    fav:     { background: 'rgba(251,191,36,0.10)', borderColor: 'rgba(251,191,36,0.25)', color: 'rgba(251,191,36,0.9)' },
    ghost:   { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' },
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[12px] text-[13px] font-semibold border cursor-pointer transition-all"
      style={{ ...s[variant], opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </motion.button>
  );
}
