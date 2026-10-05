import { useMemo, useState } from 'react';
import Filters from '../components/Filters.jsx';
import RestaurantList from '../components/RestaurantList.jsx';
import AdSlot from '../components/AdSlot.jsx';
import { DEFAULT_FILTERS, filterRestaurants, formatRating, sortRestaurants, summarize } from '../utils/restaurants.js';

export default function HomePage({ restaurants, isFavorite, onToggleFavorite }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('relevance');

  const results = useMemo(
    () => sortRestaurants(filterRestaurants(restaurants, filters), sort),
    [restaurants, filters, sort],
  );
  const stats = summarize(restaurants);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Descubra onde comer bem perto de você</h1>
          <p>
            {stats.total} restaurantes · {stats.categories} categorias · nota média {formatRating(stats.averageRating)}
          </p>
        </div>
      </section>

      <div className="container">
        <AdSlot variant="banner" label="Banner patrocinado (728×90)" />
        <Filters
          filters={filters}
          sort={sort}
          onChange={setFilters}
          onSortChange={setSort}
          onReset={() => {
            setFilters(DEFAULT_FILTERS);
            setSort('relevance');
          }}
        />
        <p className="result-count" role="status" aria-live="polite">
          {results.length === 1 ? '1 restaurante encontrado' : `${results.length} restaurantes encontrados`}
        </p>
        <RestaurantList
          items={results}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          emptyMessage="Nenhum restaurante encontrado com esses filtros."
        />
      </div>
    </>
  );
}
