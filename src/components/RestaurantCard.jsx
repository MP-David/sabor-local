import { formatPrice, formatRating, initials } from '../utils/restaurants.js';
import { routes } from '../utils/router.js';
import FavoriteButton from './FavoriteButton.jsx';

export default function RestaurantCard({ restaurant, isFavorite, onToggleFavorite }) {
  const r = restaurant;
  return (
    <article className="card" data-testid="restaurant-card">
      <div className={`card-cover cover-${r.category.length % 6}`} aria-hidden="true">
        <span>{initials(r.name)}</span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="chip">{r.category}</span>
          {r.sponsored && <span className="chip chip-sponsored">Patrocinado</span>}
          <FavoriteButton active={isFavorite} name={r.name} onToggle={() => onToggleFavorite(r.id)} />
        </div>
        <h3>
          <a href={routes.detail(r.id)}>{r.name}</a>
        </h3>
        <p className="meta">
          <span className="rating" aria-label={`Nota ${formatRating(r.rating)}`}>
            ★ {formatRating(r.rating)}
          </span>
          <span>({r.reviews} avaliações)</span>
          <span aria-label={`Preço ${r.price} de 4`}>{formatPrice(r.price)}</span>
          <span>{r.neighborhood}</span>
        </p>
        <p className="desc">{r.description}</p>
      </div>
    </article>
  );
}
