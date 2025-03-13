
/**
 * Helper function to extract date and time information from route text
 */
export const extractDateTimeInfo = (route: string): string => {
  const datePatterns = [
    /\b\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?\b/,
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*(?:\d{2,4})?\b/i,
    /\b(?:\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM)?|\d{1,2}\s*(?:am|pm|AM|PM))/,
    /\b(?:today|tomorrow|tonight|this\s+(?:morning|afternoon|evening))\b/i,
    /\b(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo),?\s+\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i,
    /\b(?:fecha|date|día|day|hora|hour|time)[:s\s]+[\w\s\d.,:\-\/]+\b/i
  ];

  for (const pattern of datePatterns) {
    const match = route.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return "";
};
