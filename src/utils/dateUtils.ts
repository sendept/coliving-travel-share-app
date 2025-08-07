// Date utility functions

/**
 * Parse various date formats and determine if they're in the past
 */
export const isDateInPast = (dateTimeStr: string | null): boolean => {
  if (!dateTimeStr) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  
  try {
    // Clean up the date string
    let cleanDate = dateTimeStr.toLowerCase().trim();
    
    // Handle various date formats
    const datePatterns = [
      // DD.MM or DD/MM patterns - add current year if missing
      {
        regex: /\b(\d{1,2})[\.\/](\d{1,2})(?:[\.\/](\d{2,4}))?\b/,
        parser: (match: RegExpMatchArray) => {
          const day = parseInt(match[1]);
          const month = parseInt(match[2]);
          const year = match[3] ? (match[3].length === 2 ? 2000 + parseInt(match[3]) : parseInt(match[3])) : currentYear;
          return new Date(year, month - 1, day);
        }
      },
      // Month name patterns like "28 July", "August 1st", "1 agosto"
      {
        regex: /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:de\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may(?:o)?|jun(?:e|io)?|jul(?:y|io)?|aug(?:ust)?|ago(?:sto)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(\d{2,4}))?\b/i,
        parser: (match: RegExpMatchArray) => {
          const day = parseInt(match[1]);
          const monthStr = match[2].toLowerCase();
          const year = match[3] ? parseInt(match[3]) : currentYear;
          
          const monthMap: { [key: string]: number } = {
            'jan': 0, 'january': 0, 'enero': 0,
            'feb': 1, 'february': 1, 'febrero': 1,
            'mar': 2, 'march': 2, 'marzo': 2,
            'apr': 3, 'april': 3, 'abril': 3,
            'may': 4, 'mayo': 4,
            'jun': 5, 'june': 5, 'junio': 5,
            'jul': 6, 'july': 6, 'julio': 6,
            'aug': 7, 'august': 7, 'agosto': 7,
            'sep': 8, 'september': 8, 'septiembre': 8,
            'oct': 9, 'october': 9, 'octubre': 9,
            'nov': 10, 'november': 10, 'noviembre': 10,
            'dec': 11, 'december': 11, 'diciembre': 11
          };
          
          const month = monthMap[monthStr.substring(0, 3)] ?? monthMap[monthStr];
          if (month !== undefined) {
            return new Date(year, month, day);
          }
          return null;
        }
      },
      // "YYYY-MM-DD" format
      {
        regex: /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/,
        parser: (match: RegExpMatchArray) => {
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        }
      }
    ];
    
    for (const pattern of datePatterns) {
      const match = cleanDate.match(pattern.regex);
      if (match) {
        const parsedDate = pattern.parser(match);
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          // Set time to end of day to be more lenient
          parsedDate.setHours(23, 59, 59, 999);
          return parsedDate < now;
        }
      }
    }
    
    // If no pattern matches, assume it's not in the past
    return false;
  } catch (error) {
    console.warn('Error parsing date:', dateTimeStr, error);
    return false;
  }
};