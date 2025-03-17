
// Function to convert written numbers to numeric values
export const convertWrittenToNumber = (text: string): number => {
  const numberMap: { [key: string]: number } = {
    // Spanish
    'uno': 1, 'una': 1,
    'dos': 2,
    'tres': 3,
    'cuatro': 4,
    'cinco': 5,
    'seis': 6,
    'siete': 7,
    'ocho': 8,
    'nueve': 9,
    'diez': 10,
    
    // English
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    
    // French
    'un': 1, 'une': 1,
    'deux': 2,
    'trois': 3,
    'quatre': 4,
    'cinq': 5,
    'sept': 7,
    'huit': 8,
    'neuf': 9,
    'dix': 10
  };

  const cleanText = text.toLowerCase().trim();
  return numberMap[cleanText] || parseInt(cleanText);
};
