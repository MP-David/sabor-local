/**
 * Regras de negócio puras do guia (sem React), fáceis de testar.
 */

/** Remove acentos e coloca em minúsculas para buscas mais tolerantes. */
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export const DEFAULT_FILTERS = {
  search: '',
  category: '',
  neighborhood: '',
  maxPrice: 4,
  minRating: 0,
};

/** Filtra restaurantes por texto, categoria, bairro, preço máximo e nota mínima. */
export function filterRestaurants(list, filters = {}) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const term = normalize(f.search);

  return list.filter((r) => {
    if (term) {
      const haystack = normalize(
        [r.name, r.category, r.neighborhood, r.description, ...(r.dishes ?? []), ...(r.tags ?? [])].join(' '),
      );
      if (!haystack.includes(term)) return false;
    }
    if (f.category && r.category !== f.category) return false;
    if (f.neighborhood && r.neighborhood !== f.neighborhood) return false;
    if (r.price > Number(f.maxPrice)) return false;
    if (r.rating < Number(f.minRating)) return false;
    return true;
  });
}

export const SORT_OPTIONS = {
  relevance: 'Relevância',
  rating: 'Melhor avaliados',
  reviews: 'Mais avaliados',
  priceAsc: 'Menor preço',
  priceDesc: 'Maior preço',
  name: 'Nome (A–Z)',
};

/** Ordena sem alterar o array original. "relevance" prioriza patrocinados e depois nota. */
export function sortRestaurants(list, criterion = 'relevance') {
  const copy = [...list];
  const byName = (a, b) => a.name.localeCompare(b.name, 'pt-BR');

  switch (criterion) {
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || byName(a, b));
    case 'reviews':
      return copy.sort((a, b) => b.reviews - a.reviews || byName(a, b));
    case 'priceAsc':
      return copy.sort((a, b) => a.price - b.price || byName(a, b));
    case 'priceDesc':
      return copy.sort((a, b) => b.price - a.price || byName(a, b));
    case 'name':
      return copy.sort(byName);
    case 'relevance':
    default:
      return copy.sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || b.rating - a.rating || byName(a, b));
  }
}

/** 1 → "$", 4 → "$$$$" (limitado entre 1 e 4). */
export function formatPrice(level) {
  const n = Math.min(4, Math.max(1, Math.round(Number(level) || 1)));
  return '$'.repeat(n);
}

/** 4.66 → "4,7" */
export function formatRating(value) {
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Iniciais para o "logo" gerado do restaurante. */
export function initials(name) {
  return String(name ?? '')
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ú]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function findRestaurant(list, id) {
  return list.find((r) => r.id === id) ?? null;
}

/** Estatísticas exibidas no topo da página inicial. */
export function summarize(list) {
  if (list.length === 0) return { total: 0, averageRating: 0, categories: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return {
    total: list.length,
    averageRating: Math.round((sum / list.length) * 10) / 10,
    categories: new Set(list.map((r) => r.category)).size,
  };
}
