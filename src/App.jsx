import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useFavorites } from './hooks/useFavorites.js';
import { restaurants as defaultRestaurants } from './data/restaurants.js';
import { APP_VERSION } from './utils/version.js';

export default function App({ restaurants = defaultRestaurants }) {
  const route = useHashRoute();
  const { favorites, toggle, isFavorite } = useFavorites();
  const shared = { restaurants, isFavorite, onToggleFavorite: toggle };

  let page;
  switch (route.name) {
    case 'home':
      page = <HomePage {...shared} />;
      break;
    case 'detail':
      page = <DetailPage id={route.params.id} {...shared} />;
      break;
    case 'favorites':
      page = <FavoritesPage favorites={favorites} {...shared} />;
      break;
    case 'about':
      page = <AboutPage />;
      break;
    default:
      page = <NotFoundPage />;
  }

  return (
    <div className="app">
      <Header current={route.name} favoritesCount={favorites.length} />
      <main id="conteudo">{page}</main>
      <Footer version={APP_VERSION} />
    </div>
  );
}
