import { useState, useRef } from 'react';
import { Search, LocateFixed, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({
  onSearch,
  onLocate,
  searchHistory = [],
  favorites = [],
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setValue('');
    }
  };

  const handleTagClick = (city) => {
    onSearch(city);
    inputRef.current?.blur();
  };

  return (
    <div className="flex flex-col gap-4">

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
            onBlur={() => setFocused(false)}
            placeholder="Search city, airport or ZIP…"
            className="glass w-full h-[56px] pl-12 pr-12 text-[15px] rounded-[22px] transition-all duration-300 text-white placeholder:text-white/30 outline-none focus:border-brand-primary/40 focus:bg-white/5"
          />
          {value && (
            <button
              type="button"
              onClick={() => { setValue(''); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer border-none"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-[56px] px-8 rounded-[22px] text-[15px] font-bold text-white bg-brand-primary shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all border-none cursor-pointer shrink-0"
        >
          Search
        </motion.button>

        {/* Location button */}
        <motion.button
          type="button"
          onClick={onLocate}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          title="Use my location"
          className="glass w-[56px] h-[56px] rounded-[22px] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 cursor-pointer transition-all duration-300"
        >
          <LocateFixed size={20} />
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
