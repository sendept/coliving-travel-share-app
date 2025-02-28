
export const detectTransport = (message: string): string => {
  // First check for airplane/flight patterns
  const planePatterns = [
    /(?:fly|flight|plane|avion|vuelo|volar)/i,
  ];

  const isPlane = planePatterns.some(pattern => pattern.test(message));
  
  if (isPlane) {
    return "✈️"; // Airplane emoji
  }

  // Check for taxi patterns
  const taxiPatterns = [
    /(?:share|looking\s+for|need).+(?:taxi|cab|ride|uber|bolt)/i,  // English
    /(?:compartir|busco|necesito).+(?:taxi|coche|uber|bolt)/i,     // Spanish
    /(?:partager|cherche).+(?:taxi|voiture|uber|bolt)/i,           // French
    /taxi|cab|uber|bolt/i                                          // Generic
  ];

  const isTaxiSharing = taxiPatterns.some(pattern => pattern.test(message));
  
  if (isTaxiSharing) {
    return "🚖"; // Taxi emoji
  }

  // Check for bus or van patterns
  const busVanPatterns = [
    /\b(?:bus|autobus|van|furgoneta|shuttle)\b/i
  ];

  const isBusOrVan = busVanPatterns.some(pattern => pattern.test(message));
  
  if (isBusOrVan) {
    return "🚌"; // Bus emoji
  }

  // If not special transport, check for other transport types
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
