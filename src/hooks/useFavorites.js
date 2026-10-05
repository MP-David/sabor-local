import { useCallback, useEffect, useState } from 'react';
import { loadFavorites, saveFavorites, toggleFavorite } from '../utils/favorites.js';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggle = useCallback((id) => setFavorites((current) => toggleFavorite(current, id)), []);
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
