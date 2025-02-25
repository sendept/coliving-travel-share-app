
export const detectTransport = (message: string): string => {
  // First check for taxi sharing patterns
  const taxiPatterns = [
    /(?:share|looking\s+for|need).+(?:taxi|cab|ride)/i,  // English
    /(?:compartir|busco|necesito).+(?:taxi|coche)/i,     // Spanish
    /(?:partager|cherche).+(?:taxi|voiture)/i,           // French
    /taxi|cab/i                                          // Generic
  ];

  const isTaxiSharing = taxiPatterns.some(pattern => pattern.test(message));
  
  if (isTaxiSharing) {
    return "🚖"; // Taxi emoji
  }

  // If not taxi, check for other transport types
  const transportTypes = message.match(/\b(car|coche|auto|bus|autobus|train|tren|plane|avion|van|furgoneta|voiture|train|avion|van)\b/i);
  let transport = "🚗";  // Default to car emoji
  
  if (transportTypes) {
    const match = transportTypes[1].toLowerCase();
    switch (match) {
      case 'bus':
      case 'autobus': transport = "🚌"; break;
      case 'train':
      case 'tren': transport = "🚂"; break;
      case 'plane':
      case 'avion': transport = "✈️"; break;
      case 'van':
      case 'furgoneta': transport = "🚐"; break;
    }
  }
  
  return transport;
};
