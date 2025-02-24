
export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
  dietary_restrictions?: string;
  language: 'en' | 'es' | 'fr';
}

interface PatternSet {
  name: RegExp;
  spots: RegExp;
  route: RegExp;
  taxi: RegExp;
  dietary: RegExp;
  contact: RegExp;
}

const spanishPatterns: PatternSet = {
  name: /(?:soy|me llamo)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:con|y|,)/i,
  spots: /(\d+)\s+(?:plazas?|asientos?|lugares?|sitios?|personas?)/i,
  route: /(?:desde|de|para|a|hacia|por)\s+([^,]+?)(?:\s+(?:a|hasta|hacia)\s+([^,]+?))?(?:\s+(?:y\s+)?(?:paro\s+en|paso\s+por|parando\s+en)\s+([^,]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:alerg[ií]as?|dieta|no\s+puedo\s+comer|vegetariano?|vegano?|halal)\s*(?:a|:)?\s*([^,.]+)/i,
  contact: /(?:contacto|teléfono|tel|móvil|celular|número)(?:\s*(?:es|:))?\s*([0-9+\s]+)/i
};

const englishPatterns: PatternSet = {
  name: /(?:I(?:'|')?m|I\s+am|name(?:'s|\s+is)?:?)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:here|and|,)/i,
  spots: /(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i,
  route: /(?:from|via)\s+([^,]+?)(?:\s+(?:to|towards)\s+([^,]+?))?(?:\s+(?:and\s+)?(?:stop(?:ping)?\s+in|via|through)\s+([^,.]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:allerg(?:y|ic)\s+to|diet|cannot\s+eat|vegetarian|vegan|halal)\s*([^,.]+)/i,
  contact: /(?:contact|phone|tel|mobile|cell|number)(?:\s*(?:is|:))?\s*([0-9+\s]+)/i
};

const frenchPatterns: PatternSet = {
  name: /(?:je\s+(?:suis|m'appelle))\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:et|,)/i,
  spots: /(\d+)\s+(?:place(?:s)?|siège(?:s)?|personne(?:s)?)/i,
  route: /(?:de|depuis|par)\s+([^,]+?)(?:\s+(?:à|vers|jusqu'à)\s+([^,]+?))?(?:\s+(?:et\s+)?(?:arrêt\s+à|via|par)\s+([^,.]+))?/i,
  taxi: /taxi/i,
  dietary: /(?:allergie[s]?|régime|ne\s+(?:mange|peut)\s+pas|végétarien(?:ne)?|végan(?:e)?|halal)\s*(?:à|:)?\s*([^,.]+)/i,
  contact: /(?:contact|téléphone|tél|portable|numéro)(?:\s*(?:est|:))?\s*([0-9+\s]+)/i
};

const detectLanguage = (message: string): 'es' | 'en' | 'fr' => {
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

const extractMultipleStops = (message: string): string[] => {
  // Match patterns for cities in the route for all three languages
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
        // Only add if it's not already in the array and is not a conjunction word
        if (!allStops.includes(city) && 
            !/^(and|y|et|to|a|vers|hasta|jusqu'à)$/i.test(city)) {
          allStops.push(city);
        }
      }
    });
  });

  return [...new Set(allStops)]; // Remove duplicates while preserving order
};

export const parseMessage = (message: string): ParsedTravel | null => {
  try {
    const language = detectLanguage(message);
    let patterns: PatternSet;
    
    switch (language) {
      case 'es':
        patterns = spanishPatterns;
        break;
      case 'fr':
        patterns = frenchPatterns;
        break;
      default:
        patterns = englishPatterns;
    }
    
    // Extract name
    const nameParts = message.match(patterns.name);
    const name = nameParts 
      ? (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4] || nameParts[5])
      : message.split(/[\s,!.]+/).find(word => /^[A-ZÀ-Ÿ][a-zà-ÿ]+$/.test(word)) || "";
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    // Extract available spots
    const spotsParts = message.match(patterns.spots);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2] || spotsParts[3]) : 0;

    // Extract route with multiple stops
    const allStops = extractMultipleStops(message);
    const route = allStops.length > 0 ? allStops.join(" → ") : "Unknown route";

    // Detect transport type
    const transportTypes = message.match(/\b(car|coche|auto|bus|autobus|train|tren|plane|avion|van|furgoneta|voiture|train|avion|van)\b/i);
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

    // Extract taxi sharing preference
    const taxiSharing = patterns.taxi.test(message);

    // Extract contact information
    let contact = "";
    const contactMatch = message.match(patterns.contact);
    if (contactMatch) {
      contact = contactMatch[1]?.trim() || "";
    } else {
      const numberMatch = message.match(/(?:\+\d{1,3}\s?)?\d{9,}/);
      contact = numberMatch ? numberMatch[0] : "";
    }

    // Extract dietary restrictions
    const dietaryMatch = message.match(patterns.dietary);
    let dietary_restrictions = "";
    
    if (dietaryMatch) {
      dietary_restrictions = dietaryMatch[1]?.trim() || "";
    }

    console.log("Parsed travel data:", {
      name,
      availableSpots,
      route,
      transport,
      taxiSharing,
      contact,
      language,
      dietary_restrictions
    });

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
