
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

export interface PatternSet {
  name: RegExp;
  spots: RegExp;
  route: RegExp;
  taxi: RegExp;
  dietary: RegExp;
  contact: RegExp;
}
