
import type { ParsedTravel, PatternSet } from './types';
import { spanishPatterns, englishPatterns, frenchPatterns } from './patterns';
import { detectLanguage } from './languageDetector';
import { extractMultipleStops } from './routeExtractor';
import { detectTransport } from './transportDetector';
import { extractDateTime } from './extractors/dateTimeExtractor';
import { extractTaxiServices, detectSharingWithOthers, isPublicTransit } from './extractors/taxiExtractor';
import { extractName } from './extractors/nameExtractor';
import { extractContact } from './extractors/contactExtractor';
import { extractDietaryRestrictions } from './extractors/dietaryExtractor';
import { extractAvailableSpots, determineDefaultSpots } from './extractors/spotsExtractor';

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
    const name = extractName(message, patterns.name);
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    // Extract available spots
    const explicitSpots = extractAvailableSpots(message, patterns.spots);

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

    // Auto-set available spots based on context
    const availableSpots = determineDefaultSpots(
      explicitSpots, 
      taxiSharing, 
      taxiServices, 
      transport, 
      publicTransit,
      isSharingWithOthers
    );

    // Extract contact information
    const contact = extractContact(message, patterns.contact);

    // Extract dietary restrictions
    const dietary_restrictions = extractDietaryRestrictions(message, patterns.dietary);

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
