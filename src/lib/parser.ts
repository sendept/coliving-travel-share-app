
export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
}

const spanishPatterns = {
  name: /(?:soy|me llamo)\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:con|y|,)/i,
  spots: /(\d+)\s+(?:plazas?|asientos?|lugares?)/i,
  route: /(?:desde|de|para|a|hacia)\s+([A-Za-z\s]+)(?:\s+(?:a|hasta|hacia)\s+([A-Za-z\s]+))?/i,
  taxi: /taxi|cab/i
};

const englishPatterns = {
  name: /I(?:'|')?m\s+([A-Za-z]+)|I\s+am\s+([A-Za-z]+)|([A-Za-z]+)\s+here|name(?:'s|:)?\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:and|,)/i,
  spots: /(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i,
  route: /(?:from|via|to|through)\s+([A-Za-z\s]+)(?:\s+(?:to|towards)\s+([A-Za-z\s]+))?/i,
  taxi: /taxi|cab/i
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

    const routeMatch = message.match(patterns.route);
    let route;
    if (routeMatch) {
      if (routeMatch[2]) {
        route = `${routeMatch[1].trim()} → ${routeMatch[2].trim()}`;
      } else {
        route = routeMatch[1].trim();
      }
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

    console.log("Parsed travel data:", { name, availableSpots, route, transport, taxiSharing, contact, language });

    return {
      name,
      availableSpots,
      route,
      transport,
      taxiSharing,
      contact,
      language
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};
