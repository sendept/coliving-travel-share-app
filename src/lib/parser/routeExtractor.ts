
export const extractMultipleStops = (message: string): string[] => {
  // Pre-process the message to normalize spaces and punctuation
  const normalizedMessage = message
    .replace(/\s+/g, ' ')
    .replace(/([.,])\s*/g, ' $1 ')
    .trim();

  const allStops: string[] = [];
  let startCity: string | null = null;
  let endCity: string | null = null;
  
  // Extract start and end cities
  const mainRoutePatterns = [
    // English
    /(?:from|starting\s+(?:from|in))\s+([A-Za-zÀ-ÿ\s]+?)\s+(?:to|towards|until|destination)\s+([A-Za-zÀ-ÿ\s]+)/i,
    // Spanish
    /(?:desde|de|saliendo\s+de)\s+([A-Za-zÀ-ÿ\s]+?)\s+(?:hasta|hacia|a)\s+([A-Za-zÀ-ÿ\s]+)/i,
    // French
    /(?:de|depuis|partant\s+de)\s+([A-Za-zÀ-ÿ\s]+?)\s+(?:à|vers|jusqu'à)\s+([A-Za-zÀ-ÿ\s]+)/i
  ];

  // Try to find start and end cities
  for (const pattern of mainRoutePatterns) {
    const match = normalizedMessage.match(pattern);
    if (match && match[1] && match[2]) {
      startCity = match[1].trim();
      endCity = match[2].trim();
      break;
    }
  }

  // Extract intermediate stops
  const intermediateStops: string[] = [];
  const stopPatterns = [
    // English patterns
    /(?:stop(?:ping)?\s+(?:at|in)|via|through|by)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:and|,|$|to))/gi,
    // Spanish patterns
    /(?:par(?:o|ando)\s+(?:en|por)|via|pasando\s+por)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:y|,|$|hasta))/gi,
    // French patterns
    /(?:arrêt(?:er)?\s+(?:à|en)|via|par|passant\s+par)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:et|,|$|vers))/gi,
  ];

  stopPatterns.forEach(pattern => {
    const matches = [...normalizedMessage.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1]) {
        const city = match[1].trim();
        if (!intermediateStops.includes(city) && 
            !/^(and|y|et|to|a|vers|hasta|jusqu'à|from|desde|de|par|by|through)$/i.test(city)) {
          intermediateStops.push(city);
        }
      }
    });
  });

  // Construct the final route in the correct order
  if (startCity) allStops.push(startCity);
  allStops.push(...intermediateStops);
  if (endCity) allStops.push(endCity);

  // Remove duplicates while preserving order
  const uniqueStops = [...new Set(allStops)];

  // Filter out invalid stops
  return uniqueStops.filter(stop => 
    stop.length > 1 && // Ensure stop is more than one character
    !/^\d+$/.test(stop) && // Filter out numbers
    !/^(and|y|et|to|a|vers)$/i.test(stop) // Filter out conjunctions
  );
};

