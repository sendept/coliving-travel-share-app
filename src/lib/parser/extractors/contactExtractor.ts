
// Function to extract contact information
export const extractContact = (message: string, contactPattern: RegExp): string => {
  let contact = "";
  const contactMatch = message.match(contactPattern);
  
  if (contactMatch) {
    contact = contactMatch[1]?.trim() || "";
  } else {
    const numberMatch = message.match(/(?:\+\d{1,3}\s?)?\d{9,}/);
    contact = numberMatch ? numberMatch[0] : "";
  }
  
  return contact;
};
