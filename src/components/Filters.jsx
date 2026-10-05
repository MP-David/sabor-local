import { CATEGORIES, NEIGHBORHOODS } from '../data/restaurants.js';
import { SORT_OPTIONS, formatPrice } from '../utils/restaurants.js';

export default function Filters({ filters, sort, onChange, onSortChange, onReset }) {
  const set = (field) => (event) => onChange({ ...filters, [field]: event.target.value });

  return (
    <section className="filters" aria-label="Filtros">
      <div className="field field-search">
        <label htmlFor="search">Buscar</label>
        <input
          id="search"
          type="search"
          placeholder="Nome, prato, bairro…"
          value={filters.search}
          onChange={set('search')}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select id="category" value={filters.category} onChange={set('category')}>
          <option value="">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="neighborhood">Bairro</label>
        <select id="neighborhood" value={filters.neighborhood} onChange={set('neighborhood')}>
          <option value="">Todos</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="maxPrice">Preço até</label>
        <select id="maxPrice" value={filters.maxPrice} onChange={set('maxPrice')}>
          {[1, 2, 3, 4].map((p) => (
            <option key={p} value={p}>
              {formatPrice(p)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="minRating">Nota mínima</label>
        <select id="minRating" value={filters.minRating} onChange={set('minRating')}>
          <option value={0}>Qualquer</option>
          <option value={4}>4,0+</option>
          <option value={4.5}>4,5+</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Ordenar por</label>
        <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="btn btn-ghost" onClick={onReset}>
        Limpar filtros
      </button>
    </section>
  );
}
