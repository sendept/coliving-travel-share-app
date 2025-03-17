
// Function to extract dietary restrictions and allergies
export const extractDietaryRestrictions = (message: string, dietaryPattern: RegExp): string => {
  const dietaryMatch = message.match(dietaryPattern);
  let dietary_restrictions = "";
  
  if (dietaryMatch) {
    const allergy = dietaryMatch[1]?.trim() || dietaryMatch[2]?.trim() || dietaryMatch[3]?.trim() || dietaryMatch[4]?.trim() || "";
    if (allergy) {
      dietary_restrictions = `Allergic to: ${allergy}`;
    } else if (dietaryMatch[0].toLowerCase().includes('vegetarian')) {
      dietary_restrictions = 'Vegetarian';
    } else if (dietaryMatch[0].toLowerCase().includes('vegan')) {
      dietary_restrictions = 'Vegan';
    } else if (dietaryMatch[0].toLowerCase().includes('halal')) {
      dietary_restrictions = 'Halal';
    } else if (dietaryMatch[0].toLowerCase().includes('don\'t eat') || dietaryMatch[0].toLowerCase().includes('do not eat')) {
      const restriction = dietaryMatch[0].match(/don'?t\s+eat\s+([^,.]+)|do\s+not\s+eat\s+([^,.]+)/i);
      if (restriction) {
        const food = restriction[1] || restriction[2];
        dietary_restrictions = `Does not eat: ${food}`;
      }
    }
  }
  
  return dietary_restrictions;
};
