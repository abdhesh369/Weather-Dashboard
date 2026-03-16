import { Trash2 } from 'lucide-react';

/**
 * Controlled favorites list component.
 */
function FavoritesList({ favorites = [], loading, onCityClick, onRemoveFavorite }) {
  if (favorites.length === 0 && !loading) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
        <p className="text-sm text-white/40">No favorite cities yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">
        Your Favorites
      </h3>
      
      <div className="flex flex-col gap-2">
        {loading && <div className="p-4 text-center text-white/30 animate-pulse">Loading...</div>}
        
        {favorites.map((city) => (
          <div
            key={city}
            onClick={() => onCityClick(city)}
            className="group flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-primary/30 transition-all cursor-pointer"
          >
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
              {city}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(city);
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
              title="Remove from favorites"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;


