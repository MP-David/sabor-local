import { Fragment } from 'react';
import RestaurantCard from './RestaurantCard.jsx';
import AdSlot from './AdSlot.jsx';

/** Lista em grade com um anúncio nativo a cada 6 itens. */
export default function RestaurantList({ items, isFavorite, onToggleFavorite, emptyMessage }) {
  if (items.length === 0) {
    return (
      <p className="empty" role="status">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid">
      {items.map((r, index) => (
        <Fragment key={r.id}>
          <RestaurantCard restaurant={r} isFavorite={isFavorite(r.id)} onToggleFavorite={onToggleFavorite} />
          {(index + 1) % 6 === 0 && index !== items.length - 1 && <AdSlot variant="card" label="Anúncio nativo" />}
        </Fragment>
      ))}
    </div>
  );
}
