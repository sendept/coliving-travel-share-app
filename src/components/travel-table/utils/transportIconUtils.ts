
/**
 * Helper function to determine the appropriate transport icon based on the transport text
 */
export const getTransportIcon = (transport: string): string => {
  const transport_lower = transport.toLowerCase();
  if (transport_lower.includes('taxi') || transport_lower.includes('uber') || transport_lower.includes('bolt')) return "🚖";
  if (transport_lower.includes('bus') || transport_lower.includes('van')) return "🚌";
  if (transport_lower.includes('train')) return "🚂";
  if (transport_lower.includes('plane') || transport_lower.includes('fly') || transport_lower === "✈️") return "✈️";
  if (transport_lower.includes('car')) return "🚗";
  if (/^\p{Emoji}/u.test(transport)) return transport;
  return "🚗";
};
