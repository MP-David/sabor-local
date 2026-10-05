/** Espaço reservado para anúncios (monetização prevista, não implementada). */
export default function AdSlot({ variant = 'banner', label = 'Espaço publicitário' }) {
  return (
    <aside className={`ad-slot ad-${variant}`} aria-label={label} data-testid="ad-slot">
      <span className="ad-tag">Publicidade</span>
      <p>{label}</p>
      <small>Anuncie seu restaurante aqui</small>
    </aside>
  );
}
