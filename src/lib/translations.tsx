
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
  },
  inviteOthers: {
    en: "Invite others to travel with you",
    es: "Invita a otros a viajar contigo",
    fr: "Invitez d'autres personnes à voyager avec vous"
  },
  spotsRemaining: {
    en: "spots remaining",
    es: "Queda",
    fr: "places restantes"
  },
  shareYourCarTaxi: {
    en: "Share your car, taxi or bus",
    es: "Comparte tu coche, taxi o bus",
    fr: "Partagez votre voiture, taxi ou bus"
  },
  formExplanation: {
    en: "When you fill this form, your answers will be added up in the table",
    es: "Al rellenar este formulario, tus respuestas se añadirán a la tabla",
    fr: "Lorsque vous remplissez ce formulaire, vos réponses seront ajoutées au tableau"
  }
};

export const getTranslation = (key: string, lang: 'en' | 'es' | 'fr' = 'en'): string => {
  // Check if key exists in translations
  if (!translations[key]) {
    return key; // Return the key itself as fallback
  }
  
  // Now we can safely access the language-specific translation
  const translation = translations[key];
  
  // Return the translation in the requested language or fall back to English or key
  return translation[lang] || translation.en || key;
};
