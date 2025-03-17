
// Function to extract date/time information from the message
export const extractDateTime = (message: string): string => {
  // Common date patterns
  const datePatterns = [
    // Match date formats with time
    /(?:date|fecha|time|hora|on|el|día)[:s]?\s*([\d.\/\-]+\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)/i,
    
    // Match date patterns without time
    /(?:date|fecha|time|hora|on|el|día)[:s]?\s*([\d.\/\-]+)/i,
    
    // Match specific date format from the text
    /\b(\d{1,2}[.\/]\d{1,2}(?:[.\/]\d{2,4})?(?:\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)?)\b/,
    
    // Match time patterns
    /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))\b/i,
    
    // Match dates with month names
    /\b(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+\d{2,4})?(?:\s*(?:at|a las|around|sobre las|sobre|hacia)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)?)\b/i
  ];

  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return "";
};
