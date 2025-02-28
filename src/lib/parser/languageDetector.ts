
export const detectLanguage = (message: string): 'es' | 'en' | 'fr' => {
  const spanishIndicators = [
    /soy|me llamo|hola|plazas?|asientos?|lugares?|desde|hasta|hacia|viajo|paro|paso/i,
    /tengo|libre|disponible|sitios?|personas?|contacto|teléfono|móvil|celular/i,
    /ruta|viaje|viajar|autobus|coche|carro|tren|salgo|salida|llego|llegada/i
  ];

  const frenchIndicators = [
    /je\s+(?:suis|m'appelle)|bonjour|salut|place[s]?|siège[s]?|depuis|vers|jusqu'à/i,
    /arrêt|voyage|personne[s]?|contact|téléphone|portable|numéro/i,
    /route|trajet|voyager|voiture|train|bus|départ|arrivée/i
  ];
  
  const englishIndicators = [
    /i am|my name|hello|seats?|spots?|from|to|towards|traveling|i'll stop|i will stop/i,
    /have|free|available|people|persons?|contact|phone|mobile|cell/i,
    /route|travel|car|bus|train|leave|leaving|arrive|arriving/i
  ];

  const spanishMatches = spanishIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  const frenchMatches = frenchIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );
  
  const englishMatches = englishIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  // Add more debug information
  console.log("Language detection scores:", {
    spanish: spanishMatches,
    french: frenchMatches,
    english: englishMatches
  });

  // Return the language with the highest score
  if (spanishMatches > englishMatches && spanishMatches > frenchMatches) {
    return 'es';
  }
  
  if (frenchMatches > spanishMatches && frenchMatches > englishMatches) {
    return 'fr';
  }
  
  return 'en'; // Default to English if no clear winner or tie
};
