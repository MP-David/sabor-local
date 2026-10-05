import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, loadFavorites, saveFavorites, toggleFavorite } from './favorites.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    data,
  };
}

describe('favoritos', () => {
  it('toggleFavorite adiciona e remove sem mutar', () => {
    const ids = ['a'];
    expect(toggleFavorite(ids, 'b')).toEqual(['a', 'b']);
    expect(toggleFavorite(ids, 'a')).toEqual([]);
    expect(ids).toEqual(['a']);
  });

  it('salva e carrega do storage', () => {
    const storage = memoryStorage();
    expect(saveFavorites(['x', 'y'], storage)).toBe(true);
    expect(storage.data[STORAGE_KEY]).toBe('["x","y"]');
    expect(loadFavorites(storage)).toEqual(['x', 'y']);
  });

  it('devolve [] quando vazio, corrompido ou com formato inválido', () => {
    expect(loadFavorites(memoryStorage())).toEqual([]);
    expect(loadFavorites(memoryStorage({ [STORAGE_KEY]: '{oops' }))).toEqual([]);
    expect(loadFavorites(memoryStorage({ [STORAGE_KEY]: '{"a":1}' }))).toEqual([]);
    expect(loadFavorites(memoryStorage({ [STORAGE_KEY]: '["ok", 3]' }))).toEqual(['ok']);
  });

  it('não quebra quando o storage lança erro (modo privado)', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadFavorites(broken)).toEqual([]);
    expect(saveFavorites(['a'], broken)).toBe(false);
  });

  it('usa o localStorage global por padrão', () => {
    saveFavorites(['g']);
    expect(loadFavorites()).toEqual(['g']);
  });
});
