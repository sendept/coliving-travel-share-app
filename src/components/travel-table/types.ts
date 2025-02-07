
export interface TravelEntry {
  id: string;
  name: string;
  available_spots: number;
  route: string;
  transport: string;
  taxi_sharing: boolean;
  contact: string;
  claimed_by: string[];
  created_at?: string;
  updated_at?: string;
  last_edited_by?: string;
  last_edited_at?: string;
  language?: string;
}

export interface TravelTableProps {
  entries: TravelEntry[];
  onClaimSpot: (id: string, name: string) => void;
}
