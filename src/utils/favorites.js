export const STORAGE_KEY = 'sabor-local:favoritos';

/** Lê favoritos do localStorage; devolve [] se indisponível ou corrompido. */
export function loadFavorites(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

/** Adiciona ou remove um id, sem mutar a lista original. */
export function toggleFavorite(ids, id) {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
