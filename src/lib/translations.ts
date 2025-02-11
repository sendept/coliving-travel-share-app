
type TranslationKey = 'name' | 'availableSpots' | 'route' | 'transport' | 'taxiSharing' | 'contact' | 'claimedBy' | 'actions';

const translations: Record<'en' | 'es', Record<TranslationKey, string>> = {
  en: {
    name: 'Name',
    availableSpots: 'Available Spots',
    route: 'Route',
    transport: 'Transport',
    taxiSharing: 'Taxi Sharing',
    contact: 'Contact',
    claimedBy: 'Claimed By',
    actions: 'Actions'
  },
  es: {
    name: 'Nombre',
    availableSpots: 'Plazas Disponibles',
    route: 'Ruta',
    transport: 'Transporte',
    taxiSharing: 'Compartir Taxi',
    contact: 'Contacto',
    claimedBy: 'Reservado Por',
    actions: 'Acciones'
  }
};

export const getTranslation = (key: TranslationKey, language: 'en' | 'es' = 'en'): string => {
  return translations[language][key];
};
