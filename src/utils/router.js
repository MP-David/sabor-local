/**
 * Roteamento por hash (#/rota). Funciona em hospedagem estática (GitHub Pages, nginx)
 * sem configuração de fallback no servidor.
 */
export function parseHash(hash) {
  const path = String(hash ?? '').replace(/^#/, '').replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home', params: {} };
  if (parts[0] === 'restaurante' && parts[1]) return { name: 'detail', params: { id: decodeURIComponent(parts[1]) } };
  if (parts[0] === 'favoritos' && parts.length === 1) return { name: 'favorites', params: {} };
  if (parts[0] === 'sobre' && parts.length === 1) return { name: 'about', params: {} };
  return { name: 'notFound', params: {} };
}

export const routes = {
  home: () => '#/',
  detail: (id) => `#/restaurante/${encodeURIComponent(id)}`,
  favorites: () => '#/favoritos',
  about: () => '#/sobre',
};
