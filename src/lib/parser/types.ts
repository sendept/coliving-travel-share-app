
export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
  language: 'en' | 'es' | 'fr';
  dietary_restrictions?: string;
  date_time?: string;
}

export interface PatternSet {
  name: RegExp;
  spots: RegExp;
  route: RegExp; // Added the route property
  from: RegExp;
  to: RegExp;
  via: RegExp;
  taxi: RegExp;
  contact: RegExp;
  dietary: RegExp;
}
