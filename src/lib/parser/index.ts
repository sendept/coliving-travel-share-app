
import type { ParsedTravel, PatternSet } from './types';
import { spanishPatterns, englishPatterns, frenchPatterns } from './patterns';
import { detectLanguage } from './languageDetector';
import { extractMultipleStops } from './routeExtractor';
import { detectTransport } from './transportDetector';

export type { ParsedTravel } from './types';

const convertWrittenToNumber = (text: string): number => {
  const numberMap: { [key: string]: number } = {
    // Spanish
    'uno': 1, 'una': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
    'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
    // English
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    // French
    'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5,
    'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10
  };

  const cleanText = text.toLowerCase().trim();
  return numberMap[cleanText] || parseInt(cleanText);
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

    // Extract available spots with written number support
    const spotsParts = message.match(patterns.spots);
    let availableSpots = 0;
    if (spotsParts) {
      const numberText = spotsParts[1] || spotsParts[2] || spotsParts[3];
      if (numberText) {
        availableSpots = convertWrittenToNumber(numberText);
      }
    }

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

    // Extract dietary restrictions and allergies
    const dietaryMatch = message.match(patterns.dietary);
    let dietary_restrictions = "";
    
    if (dietaryMatch) {
      const allergy = dietaryMatch[1]?.trim() || dietaryMatch[2]?.trim() || "";
      if (allergy) {
        dietary_restrictions = `Allergic to: ${allergy}`;
      } else if (dietaryMatch[0].toLowerCase().includes('vegetarian')) {
        dietary_restrictions = 'Vegetarian';
      } else if (dietaryMatch[0].toLowerCase().includes('vegan')) {
        dietary_restrictions = 'Vegan';
      } else if (dietaryMatch[0].toLowerCase().includes('halal')) {
        dietary_restrictions = 'Halal';
      }
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
