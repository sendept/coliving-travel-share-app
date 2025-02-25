
export const detectTransport = (message: string): string => {
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
