import { routes } from '../utils/router.js';

export default function NotFoundPage({ message = 'Página não encontrada.' }) {
  return (
    <div className="container page">
      <h1>Ops!</h1>
      <p>{message}</p>
      <a className="btn" href={routes.home()}>
        Ir para a página inicial
      </a>
    </div>
  );
}
