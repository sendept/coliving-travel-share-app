
export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
  dietary_restrictions?: string;
}

const spanishPatterns = {
  name: /(?:soy|me llamo)\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:con|y|,)/i,
  spots: /(\d+)\s+(?:plazas?|asientos?|lugares?)/i,
  route: /(?:desde|de|para|a|hacia|por)\s+([^,]+?)(?:\s+(?:a|hasta|hacia)\s+([^,]+?))?(?:\s+(?:y\s+)?(?:paro\s+en|paso\s+por)\s+([^,]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:alerg[ií]as?|dieta|no\s+puedo\s+comer)\s*(?:a|:)?\s*([^,.]+)/i
};

const englishPatterns = {
  name: /I(?:'|')?m\s+([A-Za-z]+)|I\s+am\s+([A-Za-z]+)|([A-Za-z]+)\s+here|name(?:'s|:)?\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:and|,)/i,
  spots: /(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i,
  route: /(?:from|via)\s+([^,]+?)(?:\s+(?:to|towards)\s+([^,]+?))?(?:\s+(?:and\s+)?(?:stop(?:ping)?\s+in|via|through)\s+([^,.]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:allerg(?:y|ic)\s+to|diet|cannot\s+eat)\s*([^,.]+)/i
};

const detectLanguage = (message: string): 'es' | 'en' => {
  // Spanish indicators
  const spanishIndicators = [
    /soy|me llamo|hola|plazas?|asientos?|lugares?|desde|hasta|hacia/i
  ];

  // Count Spanish matches
  const spanishMatches = spanishIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  return spanishMatches >= 1 ? 'es' : 'en';
};

const extractMultipleStops = (message: string): string[] => {
  // This function extracts all cities/stops mentioned in the message
  const cityPattern = /(?:stop\s+in|via|through|and)\s+([A-Za-z\s]+?)(?=\s+(?:and|,|$))/gi;
  const matches = [...message.matchAll(cityPattern)];
  return matches.map(match => match[1].trim());
};

export const parseMessage = (message: string): (ParsedTravel & { language: 'en' | 'es' }) | null => {
  try {
    const language = detectLanguage(message);
    const patterns = language === 'es' ? spanishPatterns : englishPatterns;
    
    const nameParts = message.match(patterns.name);
    const name = nameParts 
      ? (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4] || nameParts[5])
      : message.split(/[\s,!.]+/).find(word => /^[A-Z][a-z]+$/.test(word)) || "";
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    const spotsParts = message.match(patterns.spots);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2] || spotsParts[3]) : 0;

    // Enhanced route parsing with multiple stops
    const routeMatch = message.match(patterns.route);
    let route = "";
    if (routeMatch) {
      const from = routeMatch[1]?.trim();
      const to = routeMatch[2]?.trim();
      
      // Get additional stops
      const additionalStops = extractMultipleStops(message);
      
      // Combine all parts of the route
      const routeParts = [from];
      if (to) routeParts.push(to);
      routeParts.push(...additionalStops);
      
      // Remove duplicates and filter out empty/undefined values
      const uniqueStops = [...new Set(routeParts.filter(Boolean))];
      route = uniqueStops.join(" → ");
    } else {
      route = "Unknown route";
    }

    // Detect transport type and convert to emoji
    const transportTypes = message.match(/\b(car|coche|auto|bus|autobus|train|tren|plane|avion|van|furgoneta)\b/i);
    let transport = "🚗";  // Default to car emoji
    if (transportTypes) {
      const match = transportTypes[1].toLowerCase();
      switch (match) {
        case 'bus':
        case 'autobus': transport = "🚌"; break;
        case 'train':
        case 'tren': transport = "🚂"; break;
        case 'plane':
        case 'avion': transport = "✈️"; break;
        case 'van':
        case 'furgoneta': transport = "🚐"; break;
      }
    }

    const taxiSharing = patterns.taxi.test(message);

    const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
    const contact = contactParts ? contactParts[0] : "";

    // Parse dietary restrictions with improved pattern matching
    const dietaryMatch = message.match(patterns.dietary);
    const dietary_restrictions = dietaryMatch ? dietaryMatch[1].trim() : null;

    console.log("Parsed travel data:", { name, availableSpots, route, transport, taxiSharing, contact, language, dietary_restrictions });

    return {
      name,
      availableSpots,
      route,
      transport,
      taxiSharing,
      contact,
      language,
      dietary_restrictions
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};
