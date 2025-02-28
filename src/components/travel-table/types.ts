
export interface TravelEntry {
  id: string;
  name: string;
  available_spots: number;
  route: string;
  created_at: string;
  updated_at: string;
  claimed_by: string[];
  transport: string;
  taxi_sharing: boolean;
  contact: string;
  language: 'en' | 'es';
  dietary_restrictions: string | null;
  date_time?: string;
  project_id?: string;
  last_edited_at?: string;
  last_edited_by?: string;
}

export interface TravelTableProps {
  entries: TravelEntry[];
  onClaimSpot: (id: string, name: string) => void;
}
