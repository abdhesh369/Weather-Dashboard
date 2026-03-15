import React, { useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../App';

function FavoritesList({ onCityClick }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, token } = useContext(AuthContext);
    const addToast = useContext(ToastContext);

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [isAuthenticated, token]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/favorites');
            setFavorites(response.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (city, e) => {
        e.stopPropagation();
        try {
            const response = await api.delete('/api/favorites', {
                data: { city }
            });
            setFavorites(response.data);
            addToast(`${city} removed from favorites`, 'success');
        } catch (err) {
            console.error('Error removing favorite:', err);
            addToast('Failed to remove favorite', 'error');
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="favorites-list">
            <h3>Your Favorite Cities</h3>
            {loading && <p>Loading favorites...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && favorites.length === 0 && <p>No favorite cities added yet.</p>}
            <ul className="history-list">
                {favorites.map((city) => (
                    <li
                        key={city}
                        role="button"
                        tabIndex={0}
                        className="history-item favorite-item"
                        onClick={() => onCityClick(city)}
                        onKeyDown={(e) => e.key === 'Enter' && onCityClick(city)}
                    >
                        {city}
                        <button
                            className="btn-remove-favorite"
                            onClick={(e) => handleRemoveFavorite(city, e)}
                            aria-label={`Remove ${city} from favorites`}
                            title="Remove from favorites"
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FavoritesList;

