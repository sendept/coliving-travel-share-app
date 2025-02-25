
export const extractMultipleStops = (message: string): string[] => {
  const cityPatterns = [
    // English patterns
    /(?:stop(?:ping)?\s+(?:at|in)|via|through|by)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:and|,|$))/gi,
    /(?:from|to|towards)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:to|and|,|$))/gi,
    // Spanish patterns
    /(?:par(?:o|ando)\s+(?:en|por)|via|pasando\s+por)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:y|,|$))/gi,
    /(?:desde|hasta|hacia)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:hasta|y|,|$))/gi,
    // French patterns
    /(?:arrêt(?:er)?\s+(?:à|en)|via|par|passant\s+par)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:et|,|$))/gi,
    /(?:de|depuis|vers|jusqu'à)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:vers|et|,|$))/gi
  ];

  const allStops: string[] = [];
  
  cityPatterns.forEach(pattern => {
    const matches = [...message.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1]) {
        const city = match[1].trim();
        if (!allStops.includes(city) && 
            !/^(and|y|et|to|a|vers|hasta|jusqu'à)$/i.test(city)) {
          allStops.push(city);
        }
      }
    });
  });

  return [...new Set(allStops)];
};
