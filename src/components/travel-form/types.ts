
export interface TravelFormValues {
  name: string;
  route: string;
  availableSpots: number;
  transport: string;
  dateTime: string;
  contact: string;
}

export interface TravelFormProps {
  projectId: string | undefined;
}
