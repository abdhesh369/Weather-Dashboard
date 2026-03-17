import { useState, useRef, useEffect } from 'react';
import { Search, LocateFixed, Star, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function SearchBar({
  onSearch,
  onLocate,
  searchHistory = [],
  favorites = [],
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/weather/geocode?q=${encodeURIComponent(value)}`);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setValue('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (s) => {
    onSearch(`${s.name}, ${s.country}`);
    setValue('');
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleTagClick = (city) => {
    onSearch(city);
    inputRef.current?.blur();
  };

  return (
    <div className="flex flex-col gap-4 relative">

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        {/* Search input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-[22px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
            style={{ color: focused ? 'var(--brand-primary)' : 'rgba(255,255,255,0.3)' }}
          />
           <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search city, airport or ZIP… (Press /)"
            aria-label="Search for a city"
            className="glass glass-interactive w-full h-[60px] pl-12 pr-12 text-[16px] rounded-[24px] transition-all duration-300 text-white placeholder:text-white/30 outline-none focus:border-brand-primary/50 focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-primary focus:translate-y-0"
            autoComplete="off"
            style={{ boxSizing: 'border-box' }}
          />
          {value && (
            <button
              type="button"
              onClick={() => { setValue(''); setSuggestions([]); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer border-none"
            >
              <X size={14} />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {focused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-[24px] z-[100] border border-white/10 shadow-2xl overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.name}-${s.country}-${i}`}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] hover:bg-white/10 text-left transition-colors group border-none cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors">
                      <MapPin size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-white leading-tight">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-white/40 font-medium">
                        {s.state ? `${s.state}, ` : ''}{s.country}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="h-[60px] px-10 rounded-[24px] text-[15px] font-bold text-white bg-brand-primary shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all border-none cursor-pointer shrink-0"
        >
          Search
        </motion.button>

        {/* Location button */}
        <motion.button
          type="button"
          onClick={onLocate}
          whileHover={{ scale: 1.05, rotate: 5, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Use my location"
          className="glass glass-interactive w-[60px] h-[60px] rounded-[24px] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 cursor-pointer transition-all duration-300"
        >
          <LocateFixed size={22} />
        </motion.button>
      </form>

      {/* Tags row */}
      {(searchHistory.length > 0 || favorites.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          {searchHistory.length > 0 && (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 ml-1">
                Recent
              </span>
              {searchHistory.map(city => (
                <Tag key={city} label={city} onClick={() => handleTagClick(city)} />
              ))}
            </>
          )}
          {favorites.length > 0 && (
            <>
              <div className="w-[1px] h-3 bg-white/10 mx-1" />
              {favorites.map(city => (
                <Tag key={city} label={city} icon={<Star size={10} />} variant="fav" onClick={() => handleTagClick(city)} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Tag({ label, onClick, icon, variant = 'default' }) {
  const isFav = variant === 'fav';
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
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
