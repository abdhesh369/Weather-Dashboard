import { useContext, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { MapPin, Star, Share2, Bookmark, ArrowUp, ArrowDown, Navigation, Wind, Droplets, Thermometer, Clock } from 'lucide-react';
import { getWeatherIcon } from '../lib/weatherIcons';
import AnimatedCounter from './ui/AnimatedCounter';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../App';
import api from '../lib/api';
import { convertTemp, convertWind } from '../utils/converters';
import WeatherParticles from './ui/WeatherParticles';

const GRADIENTS = {
  clear:        'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #0369a1 100%)',
  clouds:       'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
  rain:         'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  drizzle:      'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)',
  snow:         'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #b8c8da 100%)',
  thunderstorm: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
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
    { icon: '🌡', label: `${convertTemp(current.feelsLike, units)}${unitLabel}`, sub: 'Feels' },
  ];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
       initial={{ opacity: 0, scale: 0.98 }}
       animate={{ opacity: 1, scale: 1 }}
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
       className="glass glass-interactive shimmer-active relative overflow-hidden rounded-[32px] group"
       style={{ 
         padding: '56px',
         rotateX,
         rotateY,
         transformStyle: 'preserve-3d',
         perspective: 1000
       }}
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105" 
           style={{ background: gradient, opacity: 0.7 }} />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)' }} />

      <WeatherParticles condition={current.condition} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <motion.div 
               initial={{ x: -10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-2 mb-4 bg-black/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/10"
            >
              <MapPin size={12} className="text-white/60" />
              <span className="text-[14px] font-semibold text-white tracking-wide uppercase">
                {current.city}, {current.country}
              </span>
            </motion.div>

            <div className="flex items-center gap-6">
              <motion.div
                key={String(current.temperature) + units}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                className="text-white leading-none font-bold tracking-tight"
                style={{ fontSize: 'clamp(72px, 10vw, 104px)', textShadow: 'var(--text-shadow-md)' }}
              >
                <AnimatedCounter value={Number(convertTemp(current.temperature, units))} />
                <span className="text-[20px] font-medium opacity-60 ml-1 align-top mt-2 inline-block">
                  {unitLabel}
                </span>
                <div 
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ml-4 align-middle"
                  style={{ 
                    background: current.feelsLike > current.temperature ? 'rgba(244,63,94,0.15)' : 'rgba(56,189,248,0.15)',
                    color: current.feelsLike > current.temperature ? '#fb7185' : '#38bdf8',
                    border: `1px solid ${current.feelsLike > current.temperature ? 'rgba(244,63,94,0.2)' : 'rgba(56,189,248,0.2)'}`
                  }}
                >
                  <span className="opacity-60">Feels like</span> <AnimatedCounter value={Number(convertTemp(current.feelsLike, units))} />°
                </div>
              </motion.div>
              
              <div className="h-20 w-[1px] bg-white/10 hidden md:block" />

              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[24px] md:text-[32px] font-bold text-white capitalize leading-tight tracking-tight" style={{ textShadow: 'var(--text-shadow-sm)' }}>
                   {current.description}
                </span>
                {today && (
                  <div className="flex items-center gap-3 text-[15px] font-medium text-white/70">
                    <span className="flex items-center gap-1">
                      <ArrowUp size={14} className="text-rose-400" /><AnimatedCounter value={Number(convertTemp(today.tempHigh, units))} />°
                    </span>
                    <span className="flex items-center gap-1 opacity-60">
                      <ArrowDown size={14} className="text-blue-400" /><AnimatedCounter value={Number(convertTemp(today.tempLow, units))} />°
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-white drop-shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <div className="relative filter saturate-[1.2]">
                {getWeatherIcon(current.condition, 72)}
              </div>
            </motion.div>
            <span className="text-[14px] font-medium text-white/50 tracking-wider uppercase">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            {metaChips.map(chip => (
              <div key={chip.sub} className="flex flex-col gap-1 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-[18px] border border-white/5 transition-colors hover:bg-white/10 group/chip">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">{chip.sub}</span>
                <div className="flex items-center gap-2 font-bold text-white text-[17px]">
                  <span className="text-brand-primary/80 group-hover/chip:scale-110 transition-transform">{chip.icon}</span>
                  {chip.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton variant="primary" onClick={() => { localStorage.setItem('defaultCity', current.city); addToast(`${current.city} set as default`, 'success'); }}>
              <Bookmark size={13} />
            </ActionButton>
            <ActionButton variant="fav" onClick={handleSave} disabled={saving}>
              <Star size={13} />
            </ActionButton>
            <ActionButton variant="ghost" onClick={handleShare}>
              <Share2 size={13} />
            </ActionButton>
          </div>
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
