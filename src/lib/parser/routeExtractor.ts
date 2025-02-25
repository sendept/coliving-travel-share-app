
export const extractMultipleStops = (message: string): string[] => {
  const cityPatterns = [
    // English patterns
    /(?:stop(?:ping)?\s+(?:at|in)|via|through|by)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:and|,|$|to))/gi,
    /(?:from|to|towards)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:to|and|,|$|via|through|stop))/gi,
    // Spanish patterns
    /(?:par(?:o|ando)\s+(?:en|por)|via|pasando\s+por)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:y|,|$|hasta))/gi,
    /(?:desde|hasta|hacia)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:hasta|y|,|$|via|paro|paso))/gi,
    // French patterns
    /(?:arrêt(?:er)?\s+(?:à|en)|via|par|passant\s+par)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:et|,|$|vers))/gi,
    /(?:de|depuis|vers|jusqu'à)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:vers|et|,|$|via|arrêt))/gi
  ];

  const allStops: string[] = [];
  
  // Pre-process the message to normalize spaces and punctuation
  const normalizedMessage = message
    .replace(/\s+/g, ' ')
    .replace(/([.,])\s*/g, ' $1 ')
    .trim();

  // First try to extract from structured patterns (from/to + stops)
  const mainRoutePatterns = [
    // English
    /(?:from|de|desde)\s+([A-Za-zÀ-ÿ\s]+?)\s+(?:to|hacia|à|hasta)\s+([A-Za-zÀ-ÿ\s]+)/i,
  ];

  let foundMainRoute = false;
  for (const pattern of mainRoutePatterns) {
    const match = normalizedMessage.match(pattern);
    if (match && match[1] && match[2]) {
      const fromCity = match[1].trim();
      const toCity = match[2].trim();
      if (!allStops.includes(fromCity)) allStops.push(fromCity);
      if (!allStops.includes(toCity)) allStops.push(toCity);
      foundMainRoute = true;
      break;
    }
  }

  // Then extract additional stops
  cityPatterns.forEach(pattern => {
    const matches = [...normalizedMessage.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1]) {
        const city = match[1].trim();
        // Filter out common words and conjunctions
        if (!allStops.includes(city) && 
            !/^(and|y|et|to|a|vers|hasta|jusqu'à|from|desde|de|par|by|through)$/i.test(city)) {
          allStops.push(city);
        }
      }
    });
  });

  // If still no stops found, try simpler patterns
  if (allStops.length === 0) {
    const simpleStops = normalizedMessage.match(/(?:in|at|en)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:and|y|et|,|$))/gi);
    if (simpleStops) {
      simpleStops.forEach(stop => {
        const city = stop.replace(/^(?:in|at|en)\s+/i, '').trim();
        if (!allStops.includes(city)) {
          allStops.push(city);
        }
      });
    }
  }

  return [...new Set(allStops.filter(stop => 
    stop.length > 1 && // Ensure stop is more than one character
    !/^\d+$/.test(stop) && // Filter out numbers
    !/^(and|y|et|to|a|vers)$/i.test(stop) // Filter out conjunctions
  ))];
};
