import { useState, useRef } from 'react';
import { Search, LocateFixed, Star } from 'lucide-react';
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
    <div className="flex flex-col gap-3">

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
            style={{ color: focused ? 'var(--brand-primary)' : 'var(--text-muted)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search city, airport or ZIP…"
            className="w-full py-3.5 pl-11 pr-4 text-[15px] rounded-[20px] transition-all duration-250 bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
          />
        </div>

        {/* Search button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3.5 rounded-[20px] text-[15px] font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover transition-colors border-none cursor-pointer"
        >
          Search
        </motion.button>

        {/* Location button */}
        <motion.button
          type="button"
          onClick={onLocate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Use my location"
          className="w-[52px] h-[52px] rounded-[20px] flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-200"
        >
          <LocateFixed size={18} />
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
