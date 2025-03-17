
// Function to extract taxi service mentions
export const extractTaxiServices = (message: string): string[] => {
  const taxiServices = [];
  const lowercaseMessage = message.toLowerCase();
  
  // Check for common taxi service names
  if (/\buber\b/i.test(lowercaseMessage)) {
    taxiServices.push('Uber');
  }
  if (/\bbolt\b/i.test(lowercaseMessage)) {
    taxiServices.push('Bolt');
  }
  if (/\btaxi\b/i.test(lowercaseMessage)) {
    taxiServices.push('Taxi');
  }
  if (/\bcabify\b/i.test(lowercaseMessage)) {
    taxiServices.push('Cabify');
  }
  if (/\blyft\b/i.test(lowercaseMessage)) {
    taxiServices.push('Lyft');
  }
  
  return taxiServices;
};

// Function to detect if message mentions sharing with another person
export const detectSharingWithOthers = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase();
  return /\b(with|con|avec)\s+(\w+)\b/i.test(lowercaseMessage) || 
         /\b(me and|yo y|moi et)\s+(\w+)\b/i.test(lowercaseMessage) ||
         /\b(going|traveling|viajando|voyageant)\s+with\s+(\w+)\b/i.test(lowercaseMessage) ||
         /\b(we are|somos|nous sommes)\b/i.test(lowercaseMessage) ||
         /\b(two of us|nosotros dos|nous deux)\b/i.test(lowercaseMessage);
};

// Function to check if public transit (bus, train) is mentioned
export const isPublicTransit = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase();
  return /\b(bus|autobus|autobús|coach|train|tren|metro|subway|underground|tube)\b/i.test(lowercaseMessage);
};
