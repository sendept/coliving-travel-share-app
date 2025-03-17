
// List of common greetings to filter out from name detection
const commonGreetings = [
  'hi', 'hola', 'hello', 'hey', 'bonjour', 'oi', 'buenos dias', 'buenas', 
  'good morning', 'good afternoon', 'good evening', 'saludos', 'greetings'
];

export const extractName = (message: string, namePattern: RegExp): string => {
  // Extract name using the pattern
  const nameParts = message.match(namePattern);
  let name = "";
  
  if (nameParts) {
    name = (nameParts[1] || nameParts[2] || nameParts[3] || nameParts[4] || nameParts[5]);
  } else {
    // Fall back to finding a word with first letter capitalized
    const words = message.split(/[\s,!.]+/);
    for (const word of words) {
      if (/^[A-ZÀ-Ÿ][a-zà-ÿ]+$/.test(word)) {
        const lowercaseWord = word.toLowerCase();
        // Check if the word is not a common greeting
        if (!commonGreetings.includes(lowercaseWord)) {
          name = word;
          break;
        }
      }
    }
  }

  return name;
};
