export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transportFrom: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
}

export const parseMessage = (message: string): ParsedTravel | null => {
  try {
    // Enhanced name parsing logic
    const nameParts = message.match(/I(?:'|')?m\s+([A-Za-z]+)|([A-Za-z]+)\s+here/i);
    const name = nameParts ? (nameParts[1] || nameParts[2]) : "";
    
    if (!name) {
      return null;
    }

    const spotsParts = message.match(/(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)/i);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2]) : 0;

    const routeParts = message.match(/(?:from|via|to)\s+([A-Za-z\s,&]+)(?=\s|$)/gi);
    const route = routeParts 
      ? routeParts.map(part => part.replace(/(?:from|via|to)\s+/i, "")).join(" → ")
      : "Unknown route";

    // Extract the first location as transportFrom
    const locations = route.split(" → ");
    const transportFrom = locations[0] || "Unknown location";

    // Detect transport type
    const transportTypes = message.match(/\b(car|bus|train)\b/i);
    const transport = transportTypes ? transportTypes[1].charAt(0).toUpperCase() + transportTypes[1].slice(1).toLowerCase() : "Car";

    const taxiParts = message.match(/taxi|cab/i);
    const taxiSharing = !!taxiParts;

    const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
    const contact = contactParts ? contactParts[0] : "";

    return {
      name,
      availableSpots,
      route,
      transportFrom,
      transport,
      taxiSharing,
      contact,
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};