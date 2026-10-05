import { describe, expect, it } from 'vitest';
import { parseHash, routes } from './router.js';

describe('parseHash', () => {
  it.each([
    ['', 'home'],
    ['#', 'home'],
    ['#/', 'home'],
    ['#/favoritos', 'favorites'],
    ['#/favoritos/', 'favorites'],
    ['#/sobre', 'about'],
    ['#/qualquer', 'notFound'],
    ['#/restaurante', 'notFound'],
  ])('%s → %s', (hash, name) => {
    expect(parseHash(hash).name).toBe(name);
  });

  it('extrai o id do restaurante', () => {
    expect(parseHash('#/restaurante/sakura-sushi')).toEqual({ name: 'detail', params: { id: 'sakura-sushi' } });
  });

  it('aceita undefined', () => {
    expect(parseHash(undefined).name).toBe('home');
  });
});

describe('routes', () => {
  it('gera os links e faz ida e volta com parseHash', () => {
    expect(routes.home()).toBe('#/');
    expect(routes.favorites()).toBe('#/favoritos');
    expect(routes.about()).toBe('#/sobre');
    expect(parseHash(routes.detail('café pinhão')).params.id).toBe('café pinhão');
  });
});
