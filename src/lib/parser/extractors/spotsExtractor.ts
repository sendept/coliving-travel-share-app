
import { convertWrittenToNumber } from '../utils/numberConverter';

// Function to extract available spots
export const extractAvailableSpots = (message: string, spotsPattern: RegExp): number => {
  const spotsParts = message.match(spotsPattern);
  let availableSpots = 0;
  
  if (spotsParts) {
    const numberText = spotsParts[1] || spotsParts[2] || spotsParts[3];
    if (numberText) {
      availableSpots = convertWrittenToNumber(numberText);
    }
  }
  
  return availableSpots;
};

// Function to determine default spots based on context
export const determineDefaultSpots = (
  explicitSpots: number, 
  taxiSharing: boolean, 
  taxiServices: string[], 
  transport: string, 
  publicTransit: boolean,
  isSharingWithOthers: boolean
): number => {
  if (explicitSpots !== 0) {
    return explicitSpots; // Use explicit spots if provided
  }
  
  if (taxiSharing || taxiServices.length > 0 || 
      transport.toLowerCase().includes('taxi') || 
      transport.toLowerCase().includes('cab') || 
      transport.toLowerCase().includes('uber') || 
      transport.toLowerCase().includes('bolt') || 
      publicTransit) {
    // For taxis, cabs, Uber, Bolt or public transportation
    return 3;
  } else if (isSharingWithOthers) {
    // If sharing with another person (2 people total)
    return 2;
  } else {
    // Default
    return 1;
  }
};
