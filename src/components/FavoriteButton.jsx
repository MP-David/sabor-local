export default function FavoriteButton({ active, onToggle, name }) {
  return (
    <button
      type="button"
      className={active ? 'fav-btn active' : 'fav-btn'}
      aria-pressed={active}
      aria-label={active ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      onClick={onToggle}
    >
      <span aria-hidden="true">{active ? '♥' : '♡'}</span>
    </button>
  );
}
