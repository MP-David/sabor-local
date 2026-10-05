import AdSlot from '../components/AdSlot.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { findRestaurant, formatPrice, formatRating, initials } from '../utils/restaurants.js';
import { routes } from '../utils/router.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function DetailPage({ id, restaurants, isFavorite, onToggleFavorite }) {
  const r = findRestaurant(restaurants, id);
  if (!r) return <NotFoundPage message="Restaurante não encontrado." />;

  const similar = restaurants.filter((x) => x.category === r.category && x.id !== r.id).slice(0, 3);

  return (
    <div className="container detail">
      <a href={routes.home()} className="back">
        ← Voltar para a lista
      </a>

      <div className="detail-layout">
        <article className="detail-main">
          <div className={`detail-cover cover-${r.category.length % 6}`} aria-hidden="true">
            <span>{initials(r.name)}</span>
          </div>
          <div className="detail-title">
            <h1>{r.name}</h1>
            <FavoriteButton active={isFavorite(r.id)} name={r.name} onToggle={() => onToggleFavorite(r.id)} />
          </div>
          <p className="meta">
            <span className="chip">{r.category}</span>
            {r.sponsored && <span className="chip chip-sponsored">Patrocinado</span>}
            <span className="rating">★ {formatRating(r.rating)}</span>
            <span>({r.reviews} avaliações)</span>
            <span>{formatPrice(r.price)}</span>
          </p>
          <p>{r.description}</p>

          <h2>Pratos em destaque</h2>
          <ul className="dishes">
            {r.dishes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <dl className="info">
            <dt>Endereço</dt>
            <dd>
              {r.address} — {r.neighborhood}
            </dd>
            <dt>Horário</dt>
            <dd>{r.hours}</dd>
            <dt>Telefone</dt>
            <dd>{r.phone}</dd>
          </dl>
        </article>

        <aside className="detail-side">
          <AdSlot variant="sidebar" label="Anúncio lateral (300×250)" />
          {similar.length > 0 && (
            <section>
              <h2>Parecidos</h2>
              <ul className="similar">
                {similar.map((s) => (
                  <li key={s.id}>
                    <a href={routes.detail(s.id)}>{s.name}</a> <small>★ {formatRating(s.rating)}</small>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
