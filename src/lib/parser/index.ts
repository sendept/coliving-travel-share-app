
import type { ParsedTravel, PatternSet } from './types';
import { spanishPatterns, englishPatterns, frenchPatterns } from './patterns';
import { detectLanguage } from './languageDetector';
import { extractMultipleStops } from './routeExtractor';
import { detectTransport } from './transportDetector';

export type { ParsedTravel } from './types';

const convertWrittenToNumber = (text: string): number => {
  const numberMap: { [key: string]: number } = {
    // Spanish
    'uno': 1, 'una': 1,
    'dos': 2,
    'tres': 3,
    'cuatro': 4,
    'cinco': 5,
    'seis': 6,
    'siete': 7,
    'ocho': 8,
    'nueve': 9,
    'diez': 10,
    
    // English
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    
    // French
    'un': 1, 'une': 1,
    'deux': 2,
    'trois': 3,
    'quatre': 4,
    'cinq': 5,
    'sept': 7,
    'huit': 8,
    'neuf': 9,
    'dix': 10
  };

  const cleanText = text.toLowerCase().trim();
  return numberMap[cleanText] || parseInt(cleanText);
};

// List of common greetings to filter out from name detection
const commonGreetings = [
  'hi', 'hola', 'hello', 'hey', 'bonjour', 'oi', 'buenos dias', 'buenas', 
  'good morning', 'good afternoon', 'good evening', 'saludos', 'greetings'
];

// Function to extract date/time information from the message
const extractDateTime = (message: string): string => {
  // Common date patterns
  const datePatterns = [
    // Match date formats with time
    /(?:date|fecha|time|hora|on|el|día)[:s]?\s*([\d.\/\-]+\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)/i,
    
    // Match date patterns without time
    /(?:date|fecha|time|hora|on|el|día)[:s]?\s*([\d.\/\-]+)/i,
    
    // Match specific date format from the text
    /\b(\d{1,2}[.\/]\d{1,2}(?:[.\/]\d{2,4})?(?:\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)?)\b/,
    
    // Match time patterns
    /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))\b/i,
    
    // Match dates with month names
    /\b(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+\d{2,4})?(?:\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)?)\b/i
  ];

  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return "";
};

// Function to extract taxi service mentions
const extractTaxiServices = (message: string): string[] => {
  const taxiServices = [];
  const lowercaseMessage = message.toLowerCase();
  
  // Check for common taxi service names
  if (/\buber\b/i.test(lowercaseMessage)) {
    taxiServices.push('Uber');
  }
  if (/\bbolt\b/i.test(lowercaseMessage)) {
    taxiServices.push('Bolt');
  }
  if (/\btaxi\b/i.test(lowercaseMessage)) {
    taxiServices.push('Taxi');
  }
  if (/\bcabify\b/i.test(lowercaseMessage)) {
    taxiServices.push('Cabify');
  }
  if (/\blyft\b/i.test(lowercaseMessage)) {
    taxiServices.push('Lyft');
  }
  
  return taxiServices;
};

// Function to detect if message mentions sharing with another person
const detectSharingWithOthers = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase();
  return /\b(with|con|avec)\s+(\w+)\b/i.test(lowercaseMessage) || 
         /\b(me and|yo y|moi et)\s+(\w+)\b/i.test(lowercaseMessage) ||
         /\b(going|traveling|viajando|voyageant)\s+with\s+(\w+)\b/i.test(lowercaseMessage) ||
         /\b(we are|somos|nous sommes)\b/i.test(lowercaseMessage) ||
         /\b(two of us|nosotros dos|nous deux)\b/i.test(lowercaseMessage);
};

// Function to check if public transit (bus, train) is mentioned
const isPublicTransit = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase();
  return /\b(bus|autobus|autobús|coach|train|tren|metro|subway|underground|tube)\b/i.test(lowercaseMessage);
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
    let name = "";
    
    if (nameParts) {
      name = (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4] || nameParts[5]);
    } else {
      // Fall back to finding a word with first letter capitalized
      const words = message.split(/[\s,!.]+/);
      for (const word of words) {
        if (/^[A-ZÀ-Ÿ][a-zà-ÿ]+$/.test(word)) {
          const lowercaseWord = word.toLowerCase();
          // Check if the word is not a common greeting
          if (!commonGreetings.includes(lowercaseWord)) {
            name = word;
            break;
          }
        }
      }
    }
    
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

    // Extract date/time information
    const date_time = extractDateTime(message);

    // Extract route with multiple stops
    const allStops = extractMultipleStops(message);
    
    // Extract any taxi services mentioned
    const taxiServices = extractTaxiServices(message);
    
    // Detect if sharing with others
    const isSharingWithOthers = detectSharingWithOthers(message);
    
    // Check for public transit
    const publicTransit = isPublicTransit(message);
    
    // Construct the route, including taxi service mentions if found
    let route = allStops.length > 0 ? allStops.join(" → ") : "Unknown route";
    
    // If taxi services were mentioned but not included in the route, add them
    if (taxiServices.length > 0) {
      const servicesText = taxiServices.join("/");
      if (!route.includes(servicesText)) {
        if (route === "Unknown route") {
          route = `Travel by ${servicesText}`;
        } else {
          route = `${route} (by ${servicesText})`;
        }
      }
    }

    // Detect transport type
    const transport = detectTransport(message);

    // Extract taxi sharing preference
    const taxiSharing = patterns.taxi.test(message);

    // Auto-set available spots if not explicitly specified
    if (availableSpots === 0) {
      if (taxiSharing || taxiServices.length > 0 || transport.toLowerCase().includes('taxi') || 
          transport.toLowerCase().includes('cab') || transport.toLowerCase().includes('uber') || 
          transport.toLowerCase().includes('bolt') || publicTransit) {
        // For taxis, cabs, Uber, Bolt or public transportation
        availableSpots = 3;
      } else if (isSharingWithOthers) {
        // If sharing with another person (2 people total)
        availableSpots = 2;
      } else {
        // Default
        availableSpots = 1;
      }
    }

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
      const allergy = dietaryMatch[1]?.trim() || dietaryMatch[2]?.trim() || dietaryMatch[3]?.trim() || dietaryMatch[4]?.trim() || "";
      if (allergy) {
        dietary_restrictions = `Allergic to: ${allergy}`;
      } else if (dietaryMatch[0].toLowerCase().includes('vegetarian')) {
        dietary_restrictions = 'Vegetarian';
      } else if (dietaryMatch[0].toLowerCase().includes('vegan')) {
        dietary_restrictions = 'Vegan';
      } else if (dietaryMatch[0].toLowerCase().includes('halal')) {
        dietary_restrictions = 'Halal';
      } else if (dietaryMatch[0].toLowerCase().includes('don\'t eat') || dietaryMatch[0].toLowerCase().includes('do not eat')) {
        const restriction = dietaryMatch[0].match(/don'?t\s+eat\s+([^,.]+)|do\s+not\s+eat\s+([^,.]+)/i);
        if (restriction) {
          const food = restriction[1] || restriction[2];
          dietary_restrictions = `Does not eat: ${food}`;
        }
      }
    }

    console.log("Parsed travel data:", {
      name,
      availableSpots,
      route,
      date_time,
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
      date_time,
      dietary_restrictions
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};
