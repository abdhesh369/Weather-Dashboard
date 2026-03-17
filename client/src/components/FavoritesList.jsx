import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Plus, Trash2 } from 'lucide-react';
import api from '../lib/api';

export default function FavoritesList({
  favorites = [],
  loading,
  onCityClick,
  onRemoveFavorite,
  currentCity,
  onAddCurrentCity,
}) {
  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '36px' }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Favourites</p>
        {favorites.length > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.1)', color: 'rgba(251,191,36,0.7)' }}>
            {favorites.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton rounded-[10px]" style={{ height: 44 }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <AnimatePresence>
            {favorites.length === 0 && !currentCity && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] py-4 text-center"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                No saved cities yet
              </motion.p>
            )}

            {favorites.map((city, i) => (
              <motion.div
                key={city}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.04, layout: { type: 'spring', stiffness: 300, damping: 30 } }}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between px-4 py-2.5 rounded-[12px] cursor-pointer transition-all duration-200 group border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}
                onClick={() => onCityClick(city)}
                onKeyDown={e => e.key === 'Enter' && onCityClick(city)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                  e.currentTarget.style.borderLeftColor = 'var(--brand-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Star size={12} style={{ color: 'rgba(251,191,36,0.75)', flexShrink: 0 }} fill="rgba(251,191,36,0.75)" />
                  <span className="text-[14px] font-semibold text-white truncate">{city}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={e => { e.stopPropagation(); onRemoveFavorite(city); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150 border-none cursor-pointer"
                  style={{ background: 'rgba(239,68,68,0.12)', color: 'rgba(248,113,113,0.8)' }}
                  aria-label={`Remove ${city}`}
                >
                  <X size={10} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentCity && (
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onAddCurrentCity}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 text-[13px] font-semibold mt-0.5 cursor-pointer transition-all duration-200 border border-dashed"
              style={{
                background: 'rgba(99,102,241,0.06)',
                borderColor: 'rgba(99,102,241,0.22)',
                color: 'rgba(165,180,252,0.75)',
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
