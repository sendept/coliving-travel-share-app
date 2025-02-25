
import type { ParsedTravel, PatternSet } from './types';
import { spanishPatterns, englishPatterns, frenchPatterns } from './patterns';
import { detectLanguage } from './languageDetector';
import { extractMultipleStops } from './routeExtractor';
import { detectTransport } from './transportDetector';

export type { ParsedTravel } from './types';

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
    const transport = detectTransport(message);

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
