import RestaurantList from '../components/RestaurantList.jsx';

export default function FavoritesPage({ restaurants, favorites, isFavorite, onToggleFavorite }) {
  const items = restaurants.filter((r) => favorites.includes(r.id));
  return (
    <div className="container page">
      <h1>Meus favoritos</h1>
      <RestaurantList
        items={items}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        emptyMessage="Você ainda não favoritou nenhum restaurante. Toque no ♡ para salvar."
      />
    </div>
  );
}
