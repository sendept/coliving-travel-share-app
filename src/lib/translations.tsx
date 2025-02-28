
// We need to add French translations to complement the English and Spanish ones

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
  };
}

const translations: Translations = {
  travelTogether: {
    en: "Travel together",
    es: "Viajar juntos",
    fr: "Voyager ensemble"
  },
  route: {
    en: "Route",
    es: "Ruta",
    fr: "Itinéraire"
  },
  dateTime: {
    en: "Date/Hour",
    es: "Fecha/Hora",
    fr: "Date/Heure"
  },
  contact: {
    en: "Contact",
    es: "Contacto",
    fr: "Contact"
  },
  diet: {
    en: "Diet",
    es: "Dieta",
    fr: "Régime"
  },
  edit: {
    en: "Edit",
    es: "Editar",
    fr: "Modifier"
  },
  claimSpot: {
    en: "Claim a spot",
    es: "Reservar un lugar",
    fr: "Réserver une place"
  },
  save: {
    en: "Save",
    es: "Guardar",
    fr: "Enregistrer"
  },
  cancel: {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler"
  },
  someoneClaimed: {
    en: "Someone claimed a spot",
    es: "Alguien reservó un lugar",
    fr: "Quelqu'un a réservé une place"
  },
  yourName: {
    en: "Your name",
    es: "Tu nombre",
    fr: "Votre nom"
  }
};

export const getTranslation = (key: string, lang: 'en' | 'es' | 'fr' = 'en'): string => {
  const translation = translations[key] || {};
  return translation[lang] || translation.en || key;
};
