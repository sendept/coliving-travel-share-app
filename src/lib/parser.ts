export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
  dietary_restrictions?: string;
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
  name: /I(?:'|')?m\s+([A-Za-z]+)|I\s+am\s+([A-Za-z]+)|([A-Za-z]+)\s+here|name(?:'s|:)?\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:and|,)/i,
  spots: /(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i,
  route: /(?:from|via)\s+([^,]+?)(?:\s+(?:to|towards)\s+([^,]+?))?(?:\s+(?:and\s+)?(?:stop(?:ping)?\s+in|via|through)\s+([^,.]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:allerg(?:y|ic)\s+to|diet|cannot\s+eat|vegetarian|vegan|halal)\s*([^,.]+)/i,
  contact: /(?:contact|phone|tel|mobile|cell|number)(?:\s*(?:is|:))?\s*([0-9+\s]+)/i
};

const detectLanguage = (message: string): 'es' | 'en' => {
  const spanishIndicators = [
    /soy|me llamo|hola|plazas?|asientos?|lugares?|desde|hasta|hacia|viajo|paro|paso/i,
    /tengo|libre|disponible|sitios?|personas?|contacto|teléfono|móvil|celular/i
  ];

  const spanishMatches = spanishIndicators.reduce(
    (count, pattern) => count + (pattern.test(message) ? 1 : 0),
    0
  );

  return spanishMatches >= 1 ? 'es' : 'en';
};

const extractMultipleStops = (message: string): string[] => {
  const cityPattern = /(?:stop\s+in|via|through|and|paro\s+en|paso\s+por|parando\s+en)\s+([A-Za-zÀ-ÿ\s]+?)(?=\s+(?:and|,|$|y))/gi;
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
      : message.split(/[\s,!.]+/).find(word => /^[A-ZÀ-Ÿ][a-zà-ÿ]+$/.test(word)) || "";
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    const spotsParts = message.match(patterns.spots);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2] || spotsParts[3]) : 0;

    const routeMatch = message.match(patterns.route);
    let route = "";
    if (routeMatch) {
      const from = routeMatch[1]?.trim();
      const to = routeMatch[2]?.trim();
      
      const additionalStops = extractMultipleStops(message);
      
      const routeParts = [from];
      if (to) routeParts.push(to);
      routeParts.push(...additionalStops);
      
      const uniqueStops = [...new Set(routeParts.filter(Boolean))];
      route = uniqueStops.join(" → ");
    } else {
      route = "Unknown route";
    }

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

    let contact = "";
    if (language === 'es') {
      const contactMatch = message.match(patterns.contact);
      if (contactMatch) {
        contact = contactMatch[1]?.trim() || "";
      } else {
        const numberMatch = message.match(/(?:\+\d{1,3}\s?)?\d{9,}/);
        contact = numberMatch ? numberMatch[0] : "";
      }
    } else {
      const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
      contact = contactParts ? contactParts[0] : "";
    }

    const dietaryMatch = message.match(patterns.dietary);
    let dietary_restrictions = "";
    
    if (dietaryMatch) {
      const dietText = dietaryMatch[1]?.trim().toLowerCase() || "";
      if (dietText.includes('vegan') || dietText.includes('vegano')) {
        dietary_restrictions = "Vegan";
      } else if (dietText.includes('vegetarian') || dietText.includes('vegetariano')) {
        dietary_restrictions = "Vegetarian";
      } else if (dietText.includes('halal')) {
        dietary_restrictions = "Halal";
      } else {
        dietary_restrictions = dietaryMatch[1].trim();
      }
    }

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
