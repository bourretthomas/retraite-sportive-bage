// Aides pour les galeries photos (aperçu + cadrage)

// Photo d'aperçu : celle cochée « couverture », sinon la première de la liste.
export function couverture(photos) {
  if (!photos || photos.length === 0) return null;
  return photos.find((p) => p.couverture) ?? photos[0];
}

// Traduit la position choisie dans l'admin en valeur CSS object-position.
const positions = {
  centre: 'center',
  haut: 'center top',
  bas: 'center bottom',
  gauche: 'left center',
  droite: 'right center',
};

export function posCss(position) {
  if (!position) return 'center';
  if (positions[position]) return positions[position];
  if (position.includes('%')) return position; // point focal "x% y%"
  return 'center';
}
