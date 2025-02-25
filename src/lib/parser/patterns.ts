
import { PatternSet } from './types';

// Helper function to convert written numbers to digits
const convertWrittenNumber = (text: string): string => {
  const numberMap: { [key: string]: string } = {
    // Spanish
    'un': '1', 'uno': '1', 'una': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5',
    'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10',
    // English
    'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
    // French
    'un': '1', 'une': '1', 'deux': '2', 'trois': '3', 'quatre': '4', 'cinq': '5',
    'six': '6', 'sept': '7', 'huit': '8', 'neuf': '9', 'dix': '10'
  };

  const lowercaseText = text.toLowerCase();
  return numberMap[lowercaseText] || text;
};

export const spanishPatterns: PatternSet = {
  name: /(?:soy|me llamo)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:con|y|,)/i,
  spots: /(?:busco|necesito)\s+(un[oa]|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+(?:plazas?|asientos?|lugares?|sitios?|personas?)|(\d+|un[oa]|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:plazas?|asientos?|lugares?|sitios?|personas?)/i,
  route: /(?:desde|de|para|a|hacia|por)\s+([^,]+?)(?:\s+(?:a|hasta|hacia)\s+([^,]+?))?(?:\s+(?:y\s+)?(?:paro\s+en|paso\s+por|parando\s+en)\s+([^,]+))?/i,
  taxi: /(?:taxi|cab|compartir\s+(?:taxi|coche|viaje|transporte))/i,
  dietary: /(?:alerg[ií]as?|dieta|no\s+(?:como|puedo\s+comer)|vegetariano?a?|vegano?a?|halal|sin\s+(?:gluten|lactosa)|celiaco?a?)\s*(?:a|:)?\s*([^,.]+)|(?:soy|como)\s+(?:vegetariano?a?|vegano?a?)/i,
  contact: /(?:contacto|teléfono|tel|móvil|celular|número)(?:\s*(?:es|:))?\s*([0-9+\s]+)/i
};

export const englishPatterns: PatternSet = {
  name: /(?:I(?:'|')?m|I\s+am|name(?:'s|\s+is)?:?)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:here|and|,)/i,
  spots: /(?:need|looking\s+for|have|take)\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)|(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/i,
  route: /(?:from|via)\s+([^,]+?)(?:\s+(?:to|towards)\s+([^,]+?))?(?:\s+(?:and\s+)?(?:stop(?:ping)?\s+in|via|through)\s+([^,.]+))?/i,
  taxi: /(?:taxi|cab|share(?:\s+a)?\s+(?:taxi|ride|car|transport)|looking\s+to\s+share)/i,
  dietary: /(?:allerg(?:y|ic)\s+to|diet|cannot\s+eat|don'?t\s+eat|vegetarian|vegan|halal|gluten[\s-]free|dairy[\s-]free|celiac)\s*([^,.]+)|(?:I\s+am|I'?m)\s+(?:vegetarian|vegan)/i,
  contact: /(?:contact|phone|tel|mobile|cell|number)(?:\s*(?:is|:))?\s*([0-9+\s]+)/i
};

export const frenchPatterns: PatternSet = {
  name: /(?:je\s+(?:suis|m'appelle))\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:et|,)/i,
  spots: /(?:cherche|besoin\s+de)\s+(un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|\d+)|(\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+(?:place(?:s)?|siège(?:s)?|personne(?:s)?)/i,
  route: /(?:de|depuis|par)\s+([^,]+?)(?:\s+(?:à|vers|jusqu'à)\s+([^,]+?))?(?:\s+(?:et\s+)?(?:arrêt\s+à|via|par)\s+([^,.]+))?/i,
  taxi: /(?:taxi|partager?\s+(?:un\s+)?(?:taxi|voiture|transport))/i,
  dietary: /(?:allergie[s]?|régime|ne\s+(?:mange|peut)\s+pas|végétarien(?:ne)?|végan(?:e)?|halal|sans\s+(?:gluten|lactose)|coeliaque)\s*(?:à|:)?\s*([^,.]+)|(?:je\s+suis)\s+(?:végétarien(?:ne)?|végan(?:e)?)/i,
  contact: /(?:contact|téléphone|tél|portable|numéro)(?:\s*(?:est|:))?\s*([0-9+\s]+)/i
};

