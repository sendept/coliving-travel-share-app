
export interface ParsedTravel {
  name: string;
  availableSpots: number;
  route: string;
  transport: string;
  taxiSharing: boolean;
  contact: string;
}

export const parseMessage = (message: string): ParsedTravel | null => {
  try {
    // Enhanced name parsing logic with more patterns and better priority
    const nameParts = message.match(/I(?:'|')?m\s+([A-Za-z]+)|I\s+am\s+([A-Za-z]+)|([A-Za-z]+)\s+here|name(?:'s|:)?\s+([A-Za-z]+)|([A-Za-z]+)\s+(?:and|,)/i);
    const name = nameParts 
      ? (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4] || nameParts[5])
      : message.split(/[\s,!.]+/).find(word => /^[A-Z][a-z]+$/.test(word)) || "";
    
    if (!name) {
      console.log("Could not find a name in the message");
      return null;
    }

    const spotsParts = message.match(/(\d+)\s+(?:free\s+)?spots?|(?:free\s+)?spots?:?\s+(\d+)|(?:take|have)\s+(\d+)/i);
    const availableSpots = spotsParts ? parseInt(spotsParts[1] || spotsParts[2] || spotsParts[3]) : 0;

    // Enhanced route parsing to handle "from X to Y" pattern
    const fromToPattern = /(?:from\s+([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+))/i;
    const fromToMatch = message.match(fromToPattern);
    
    let route;
    if (fromToMatch) {
      route = `${fromToMatch[1].trim()} → ${fromToMatch[2].trim()}`;
    } else {
      const routeParts = message.match(/(?:from|via|to|through)\s+([A-Za-z\s,&]+)(?=\s|$)/gi);
      route = routeParts 
        ? routeParts.map(part => part.replace(/(?:from|via|to|through)\s+/i, "")).join(" → ")
        : "Unknown route";
    }

    // Detect transport type and convert to emoji
    const transportTypes = message.match(/\b(car|bus|train|plane|van)\b/i);
    let transport = "🚗";  // Default to car emoji
    if (transportTypes) {
      const match = transportTypes[1].toLowerCase();
      switch (match) {
        case 'bus': transport = "🚌"; break;
        case 'train': transport = "🚂"; break;
        case 'plane': transport = "✈️"; break;
        case 'van': transport = "🚐"; break;
      }
    }

    const taxiParts = message.match(/taxi|cab/i);
    const taxiSharing = !!taxiParts;

    const contactParts = message.match(/[@\w.-]+@[\w.-]+\.\w+|@\w+|(?:\+\d{1,3}\s?)?\d{9,}/);
    const contact = contactParts ? contactParts[0] : "";

    console.log("Parsed travel data:", { name, availableSpots, route, transport, taxiSharing, contact });

    return {
      name,
      availableSpots,
      route,
      transport,
      taxiSharing,
      contact,
    };
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
};
