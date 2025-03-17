
export const useFormPlaceholders = (language: "en" | "es") => {
  const placeholders = {
    en: {
      name: "Your name",
      route: "Write your route (add any comment)",
      availableSpots: "Number of available spots",
      transport: "Type of transport (car, bus, taxi, etc.)",
      dateTime: "Date and approx hour",
      contact: "Preferably WhatsApp",
      dietaryRestrictions: "Diet/allergies (optional)"
    },
    es: {
      name: "Tu nombre",
      route: "Escribe tu ruta (añade cualquier comentario)",
      availableSpots: "Número de plazas disponibles",
      transport: "Tipo de transporte (coche, autobús, taxi, etc.)",
      dateTime: "Fecha y hora aproximada",
      contact: "Preferiblemente WhatsApp",
      dietaryRestrictions: "Dieta/alergias (opcional)"
    }
  };
  
  return (field: keyof typeof placeholders.en) => placeholders[language][field];
};
