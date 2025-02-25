
import { PatternSet } from './types';

export const spanishPatterns: PatternSet = {
  name: /(?:soy|me llamo)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:con|y|,)/i,
  spots: /(\d+)\s+(?:plazas?|asientos?|lugares?|sitios?|personas?)/i,
  route: /(?:desde|de|para|a|hacia|por)\s+([^,]+?)(?:\s+(?:a|hasta|hacia)\s+([^,]+?))?(?:\s+(?:y\s+)?(?:paro\s+en|paso\s+por|parando\s+en)\s+([^,]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:alerg[ií]as?|dieta|no\s+(?:como|puedo\s+comer)|vegetariano?a?|vegano?a?|halal|sin\s+(?:gluten|lactosa)|celiaco?a?)\s*(?:a|:)?\s*([^,.]+)|(?:soy|como)\s+(?:vegetariano?a?|vegano?a?)/i,
  contact: /(?:contacto|teléfono|tel|móvil|celular|número)(?:\s*(?:es|:))?\s*([0-9+\s]+)/i
};

export const englishPatterns: PatternSet = {
  name: /(?:I(?:'|')?m|I\s+am|name(?:'s|\s+is)?:?)\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:here|and|,)/i,
  spots: /(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i,
  route: /(?:from|via)\s+([^,]+?)(?:\s+(?:to|towards)\s+([^,]+?))?(?:\s+(?:and\s+)?(?:stop(?:ping)?\s+in|via|through)\s+([^,.]+))?/i,
  taxi: /taxi|cab/i,
  dietary: /(?:allerg(?:y|ic)\s+to|diet|cannot\s+eat|don'?t\s+eat|vegetarian|vegan|halal|gluten[\s-]free|dairy[\s-]free|celiac)\s*([^,.]+)|(?:I\s+am|I'?m)\s+(?:vegetarian|vegan)/i,
  contact: /(?:contact|phone|tel|mobile|cell|number)(?:\s*(?:is|:))?\s*([0-9+\s]+)/i
};

export const frenchPatterns: PatternSet = {
  name: /(?:je\s+(?:suis|m'appelle))\s+([A-Za-zÀ-ÿ]+)|([A-Za-zÀ-ÿ]+)\s+(?:et|,)/i,
  spots: /(\d+)\s+(?:place(?:s)?|siège(?:s)?|personne(?:s)?)/i,
  route: /(?:de|depuis|par)\s+([^,]+?)(?:\s+(?:à|vers|jusqu'à)\s+([^,]+?))?(?:\s+(?:et\s+)?(?:arrêt\s+à|via|par)\s+([^,.]+))?/i,
  taxi: /taxi/i,
  dietary: /(?:allergie[s]?|régime|ne\s+(?:mange|peut)\s+pas|végétarien(?:ne)?|végan(?:e)?|halal|sans\s+(?:gluten|lactose)|coeliaque)\s*(?:à|:)?\s*([^,.]+)|(?:je\s+suis)\s+(?:végétarien(?:ne)?|végan(?:e)?)/i,
  contact: /(?:contact|téléphone|tél|portable|numéro)(?:\s*(?:est|:))?\s*([0-9+\s]+)/i
};
