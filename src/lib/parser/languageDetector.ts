
export const detectLanguage = (message: string): 'es' | 'en' | 'fr' => {
  const spanishIndicators = [
    /soy|me llamo|hola|plazas?|asientos?|lugares?|desde|hasta|hacia|viajo|paro|paso/i,
    /tengo|libre|disponible|sitios?|personas?|contacto|teléfono|móvil|celular/i
  ];

  const frenchIndicators = [
    /je\s+(?:suis|m'appelle)|bonjour|salut|place[s]?|siège[s]?|depuis|vers|jusqu'à/i,
    /arrêt|voyage|personne[s]?|contact|téléphone|portable|numéro/i
  ];

  const spanishMatches = spanishIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  const frenchMatches = frenchIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  if (spanishMatches > frenchMatches) return 'es';
  if (frenchMatches > 0) return 'fr';
  return 'en';
};
