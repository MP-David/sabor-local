import { describe, expect, it } from 'vitest';
import {
  filterRestaurants,
  findRestaurant,
  formatPrice,
  formatRating,
  initials,
  normalize,
  sortRestaurants,
  summarize,
} from './restaurants.js';

const list = [
  { id: 'a', name: 'Bistrô Ávila', category: 'Brasileira', neighborhood: 'Centro', price: 2, rating: 4.5, reviews: 10, sponsored: false, description: 'Feijoada', dishes: ['Feijoada'], tags: ['almoço'] },
  { id: 'b', name: 'Zen Sushi', category: 'Japonesa', neighborhood: 'Batel', price: 4, rating: 4.8, reviews: 50, sponsored: false, description: 'Peixes', dishes: ['Temaki'], tags: ['jantar'] },
  { id: 'c', name: 'Casa Pizza', category: 'Italiana', neighborhood: 'Centro', price: 1, rating: 3.9, reviews: 99, sponsored: true, description: 'Forno', dishes: ['Margherita'], tags: ['delivery'] },
];

describe('normalize', () => {
  it('remove acentos, espaços extras e caixa', () => {
    expect(normalize('  Bistrô ÁVILA ')).toBe('bistro avila');
  });
  it('trata null/undefined como texto vazio', () => {
    expect(normalize(undefined)).toBe('');
    expect(normalize(null)).toBe('');
  });
});

describe('filterRestaurants', () => {
  it('sem filtros devolve todos', () => {
    expect(filterRestaurants(list)).toHaveLength(3);
  });
  it('busca por nome ignorando acentos', () => {
    expect(filterRestaurants(list, { search: 'bistro' }).map((r) => r.id)).toEqual(['a']);
  });
  it('busca por prato e por tag', () => {
    expect(filterRestaurants(list, { search: 'temaki' }).map((r) => r.id)).toEqual(['b']);
    expect(filterRestaurants(list, { search: 'delivery' }).map((r) => r.id)).toEqual(['c']);
  });
  it('filtra por categoria e bairro', () => {
    expect(filterRestaurants(list, { category: 'Italiana' }).map((r) => r.id)).toEqual(['c']);
    expect(filterRestaurants(list, { neighborhood: 'Centro' }).map((r) => r.id)).toEqual(['a', 'c']);
  });
  it('filtra por preço máximo e nota mínima (aceita strings vindas de <select>)', () => {
    expect(filterRestaurants(list, { maxPrice: '2' }).map((r) => r.id)).toEqual(['a', 'c']);
    expect(filterRestaurants(list, { minRating: '4.5' }).map((r) => r.id)).toEqual(['a', 'b']);
  });
  it('combina filtros e pode não encontrar nada', () => {
    expect(filterRestaurants(list, { category: 'Japonesa', maxPrice: 2 })).toEqual([]);
  });
  it('lida com restaurantes sem pratos/tags', () => {
    const semExtras = [{ ...list[0], dishes: undefined, tags: undefined }];
    expect(filterRestaurants(semExtras, { search: 'centro' })).toHaveLength(1);
  });
});

describe('sortRestaurants', () => {
  const ids = (criterion) => sortRestaurants(list, criterion).map((r) => r.id);

  it('relevância: patrocinados primeiro, depois maior nota', () => {
    expect(ids('relevance')).toEqual(['c', 'b', 'a']);
    expect(ids()).toEqual(['c', 'b', 'a']);
  });
  it('por nota, avaliações, preço e nome', () => {
    expect(ids('rating')).toEqual(['b', 'a', 'c']);
    expect(ids('reviews')).toEqual(['c', 'b', 'a']);
    expect(ids('priceAsc')).toEqual(['c', 'a', 'b']);
    expect(ids('priceDesc')).toEqual(['b', 'a', 'c']);
    expect(ids('name')).toEqual(['a', 'c', 'b']);
  });
  it('desempata pelo nome', () => {
    const tie = [
      { ...list[0], id: 'y', name: 'Yara', rating: 4, reviews: 1, price: 1, sponsored: false },
      { ...list[0], id: 'x', name: 'Xica', rating: 4, reviews: 1, price: 1, sponsored: false },
    ];
    for (const c of ['rating', 'reviews', 'priceAsc', 'priceDesc', 'relevance']) {
      expect(sortRestaurants(tie, c).map((r) => r.id)).toEqual(['x', 'y']);
    }
  });
  it('não altera o array original', () => {
    const copy = [...list];
    sortRestaurants(list, 'name');
    expect(list).toEqual(copy);
  });
});

describe('formatadores', () => {
  it('formatPrice limita entre 1 e 4', () => {
    expect(formatPrice(1)).toBe('$');
    expect(formatPrice(3)).toBe('$$$');
    expect(formatPrice(9)).toBe('$$$$');
    expect(formatPrice(0)).toBe('$');
    expect(formatPrice('abc')).toBe('$');
  });
  it('formatRating usa vírgula e 1 casa', () => {
    expect(formatRating(4.66)).toBe('4,7');
    expect(formatRating(4)).toBe('4,0');
  });
  it('initials pega até duas iniciais significativas', () => {
    expect(initials('Trattoria della Nonna')).toBe('TD');
    expect(initials('Café Pinhão')).toBe('CP');
    expect(initials('')).toBe('');
  });
});

describe('findRestaurant e summarize', () => {
  it('encontra por id ou devolve null', () => {
    expect(findRestaurant(list, 'b').name).toBe('Zen Sushi');
    expect(findRestaurant(list, 'zzz')).toBeNull();
  });
  it('resume a lista', () => {
    expect(summarize(list)).toEqual({ total: 3, averageRating: 4.4, categories: 3 });
    expect(summarize([])).toEqual({ total: 0, averageRating: 0, categories: 0 });
  });
});
