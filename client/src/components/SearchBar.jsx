import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, LocateFixed, Star, X, MapPin, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function SearchBar({
  onSearch,
  onLocate,
  onClearHistory,
  searchHistory = [],
  favorites     = [],
}) {
  const [value,       setValue]       = useState('');
  const [focused,     setFocused]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const inputRef = useRef(null);

  // Debounced geocode suggestions
  useEffect(() => {
    if (value.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/weather/geocode?q=${encodeURIComponent(value)}`);
        setSuggestions(data);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => clearTimeout(timer);
  }, [value]);

  const submit = useCallback((city) => {
    if (!city?.trim()) return;
    onSearch(city.trim());
    setValue('');
    setSuggestions([]);
    inputRef.current?.blur();
  }, [onSearch]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const s = suggestions[activeIdx];
      submit(`${s.name}, ${s.country}`);
    }
    if (e.key === 'Escape') { setSuggestions([]); setActiveIdx(-1); }
  };

  const dropdownOpen = focused && (suggestions.length > 0 || (searchHistory.length > 0 && value.length < 2));

  return (
    <div className="flex flex-col gap-3 relative">
      <form onSubmit={e => { e.preventDefault(); submit(value); }} className="flex gap-3 items-center flex-nowrap">

        {/* Search input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-[22px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 z-10"
            style={{ color: focused ? 'var(--brand-primary)' : 'rgba(255,255,255,0.35)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setActiveIdx(-1); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, airport or ZIP… (Press /)"
            aria-label="Search for a city"
            aria-autocomplete="list"
            aria-expanded={dropdownOpen}
            className="glass glass-interactive w-full h-[58px] pl-16 pr-12 text-[15px] rounded-[24px] transition-all duration-300 text-white placeholder:text-white/40 outline-none focus:border-brand-primary/50 focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-primary"
            autoComplete="off"
          />
          {/* Spinner / clear */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,0.15)', borderTopColor: 'var(--brand-primary)' }}
              />
            ) : value ? (
              <button
                type="button"
                onClick={() => { setValue(''); setSuggestions([]); inputRef.current?.focus(); }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer border-none"
              >
                <X size={13} />
              </button>
            ) : null}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-[20px] z-[100] border border-white/10 shadow-2xl"
                role="listbox"
              >
                {/* Geocode suggestions */}
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.name}-${s.country}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={i === activeIdx}
                    onClick={() => submit(`${s.name}, ${s.country}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left transition-colors group border-none cursor-pointer"
                    style={{ background: i === activeIdx ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors shrink-0">
                      <MapPin size={13} style={{ color: i === activeIdx ? 'var(--brand-primary)' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-white leading-tight truncate">{s.name}</span>
                      <span className="text-[11px] text-white/38 font-medium">
                        {s.state ? `${s.state}, ` : ''}{s.country}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Recent searches (when input is empty) */}
                {value.length < 2 && searchHistory.length > 0 && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between px-4 pt-2 pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Recent
                      </span>
                      {onClearHistory && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); onClearHistory(); }}
                          className="flex items-center gap-1 text-[10px] font-medium cursor-pointer border-none bg-transparent transition-colors"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                        >
                          <Trash2 size={9} /> Clear
                        </button>
                      )}
                    </div>
                    {searchHistory.slice(0, 5).map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => submit(city)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-left transition-colors border-none cursor-pointer hover:bg-white/6"
                      >
                        <div className="w-7 h-7 rounded-full bg-white/4 flex items-center justify-center shrink-0">
                          <Clock size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
                        </div>
                        <span className="text-[13px] font-semibold text-white/70">{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.97 }}
          className="h-[58px] px-10 rounded-[24px] text-[15px] font-extrabold text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all border-none cursor-pointer shrink-0 whitespace-nowrap min-w-[130px]"
          style={{ background: 'var(--brand-primary)' }}
        >
          Search
        </motion.button>

        {/* Location button */}
        <motion.button
          type="button"
          onClick={onLocate}
          whileHover={{ scale: 1.06, rotate: 5, translateY: -2 }}
          whileTap={{ scale: 0.94 }}
          title="Use my location (G)"
          className="glass glass-interactive w-[58px] h-[58px] rounded-[24px] flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-all duration-300 border-none shrink-0"
        >
          <LocateFixed size={20} />
        </motion.button>
      </form>

      {/* Favourite tags row */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Saved
          </span>
          {favorites.map(city => (
            <Tag key={city} label={city} icon={<Star size={10} />} variant="fav" onClick={() => submit(city)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ label, onClick, icon, variant = 'default' }) {
  const isFav = variant === 'fav';
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium cursor-pointer border transition-all duration-200 ${
        isFav
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-500/90 hover:bg-amber-500/20'
          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
