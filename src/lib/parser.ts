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
    // Enhanced name parsing logic with more patterns
    const nameParts = message.match(/I(?:'|')?m\s+([A-Za-z]+)|([A-Za-z]+)\s+here|name(?:'s|:)?\s+([A-Za-z]+)|([A-Za-z]+)\s+from/i);
    const name = nameParts 
      ? (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4])
      : message.split(/[\s,!.]+/).find(word => /^[A-Z][a-z]+$/.test(word)) || "";
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    const spotsParts = message.match(/(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2] || spotsParts[3]) : 0;

    const routeParts = message.match(/(?:from|via|to|through)\s+([A-Za-z\s,&]+)(?=\s|$)/gi);
    const route = routeParts 
      ? routeParts.map(part => part.replace(/(?:from|via|to|through)\s+/i, "")).join(" → ")
      : "Unknown route";

    // Extract the first location as transportFrom
    const locations = route.split(" → ");
    const transportFrom = locations[0] || "Unknown location";

    // Detect transport type with more variations
    const transportTypes = message.match(/\b(car|bus|train|driving|taking\s+(?:the\s+)?(?:bus|train))\b/i);
    let transport = "Car";
    if (transportTypes) {
      const match = transportTypes[1].toLowerCase();
      if (match.includes('bus')) transport = "Bus";
      else if (match.includes('train')) transport = "Train";
      else if (match.includes('car') || match.includes('driving')) transport = "Car";
    }

    const taxiParts = message.match(/taxi|cab/i);
    const taxiSharing = !!taxiParts;

    const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
    const contact = contactParts ? contactParts[0] : "";

    console.log("Parsed travel data:", { name, availableSpots, route, transportFrom, transport, taxiSharing, contact });

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