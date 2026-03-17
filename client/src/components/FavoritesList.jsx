import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Plus } from 'lucide-react';

export default function FavoritesList({
  favorites = [],
  loading,
  onCityClick,
  onRemoveFavorite,
  currentCity,
  onAddCurrentCity,
}) {
  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '40px' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">
        Favourites
      </p>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton rounded-[10px]" style={{ height: 46 }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <AnimatePresence>
            {favorites.length === 0 && !currentCity && (
              <p className="text-[13px] py-2 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No favourites yet
              </p>
            )}
            {favorites.map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.04 }}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between px-4 py-3 rounded-[12px] cursor-pointer transition-all duration-300 group border-l-2 border-l-transparent"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => onCityClick(city)}
                onKeyDown={e => e.key === 'Enter' && onCityClick(city)}
                onMouseEnter={e => {
                   e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                   e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                   e.currentTarget.style.borderLeftColor = 'var(--brand-primary)';
                }}
                onMouseLeave={e => {
                   e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                   e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                   e.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Star size={13} style={{ color: 'rgba(251,191,36,0.8)', flexShrink: 0 }} fill="rgba(251,191,36,0.8)" />
                  <span className="text-[15px] font-semibold text-white truncate">{city}</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onRemoveFavorite(city); }}
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(248,113,113,0.8)' }}
                  aria-label={`Remove ${city}`}
                >
                  <X size={10} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentCity && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onAddCurrentCity}
              className="w-full py-2.5 rounded-[10px] flex items-center justify-center gap-1.5 text-[13px] font-medium mt-1 cursor-pointer transition-all duration-200 border"
              style={{
                background: 'rgba(99,102,241,0.08)',
                borderColor: 'rgba(99,102,241,0.25)',
                borderStyle: 'dashed',
                color: 'rgba(165,180,252,0.8)',
              }}
            >
              <Plus size={13} /> Add {currentCity}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
