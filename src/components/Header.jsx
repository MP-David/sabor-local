import { routes } from '../utils/router.js';

export default function Header({ current, favoritesCount }) {
  const link = (name, href, label) => (
    <a href={href} className={current === name ? 'nav-link active' : 'nav-link'} aria-current={current === name ? 'page' : undefined}>
      {label}
    </a>
  );

  return (
    <header className="header">
      <div className="container header-inner">
        <a href={routes.home()} className="brand" aria-label="Sabor Local — página inicial">
          <span className="brand-mark" aria-hidden="true">SL</span>
          <span>
            Sabor <strong>Local</strong>
          </span>
        </a>
        <nav aria-label="Principal" className="nav">
          {link('home', routes.home(), 'Restaurantes')}
          {link('favorites', routes.favorites(), `Favoritos (${favoritesCount})`)}
          {link('about', routes.about(), 'Sobre')}
        </nav>
      </div>
    </header>
  );
}
