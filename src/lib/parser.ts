export interface ParsedTravel {
  name: string;
  travelersWith: number;
  availableSpots: number;
  route: string;
  transportFrom: string;
  taxiSharing: boolean;
  contact: string;
}

export const parseMessage = (message: string): ParsedTravel | null => {
  try {
    // Basic parsing logic - this can be enhanced with more sophisticated NLP
    const nameParts = message.match(/I['']m\s+([A-Za-z]+)|([A-Za-z]+)\s+here/i);
    const name = nameParts ? (nameParts[1] || nameParts[2]) : "Anonymous";

    const spotsParts = message.match(/(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)/i);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2]) : 0;

    const routeParts = message.match(/(?:from|via|to)\s+([A-Za-z\s,&]+)(?=\s|$)/gi);
    const route = routeParts 
      ? routeParts.map(part => part.replace(/(?:from|via|to)\s+/i, "")).join(" → ")
      : "Unknown route";

    const taxiParts = message.match(/taxi|cab/i);
    const taxiSharing = !!taxiParts;

    const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
    const contact = contactParts ? contactParts[0] : "";

    return {
      name,
      travelersWith: 1,
      availableSpots,
      route,
      transportFrom: "Car",
      taxiSharing,
      contact,
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};