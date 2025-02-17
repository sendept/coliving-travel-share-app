
import React from 'react';

type TranslationKey = 'name' | 'availableSpots' | 'route' | 'transport' | 'taxiSharing' | 'contact' | 'claimedBy' | 'actions' | 'title' | 'subtitle';

const translations: Record<'en' | 'es', Record<TranslationKey, string>> = {
  en: {
    name: 'Name / Nombre',
    availableSpots: 'Available Spots / Plazas',
    route: 'Route / Ruta',
    transport: 'Transport / Transporte',
    taxiSharing: 'Taxi Sharing / Compartir',
    contact: 'Contact / Contacto',
    claimedBy: 'Claimed By / Reservado Por',
    actions: 'Actions / Acciones',
    title: 'Share Your Travel Plan / Comparte tu plan de viaje',
    subtitle: 'Coordinate your journey / Coordina tu viaje'
  },
  es: {
    name: 'Nombre / Name',
    availableSpots: 'Plazas / Available Spots',
    route: 'Ruta / Route',
    transport: 'Transporte / Transport',
    taxiSharing: 'Compartir / Taxi Sharing',
    contact: 'Contacto / Contact',
    claimedBy: 'Reservado Por / Claimed By',
    actions: 'Acciones / Actions',
    title: 'Comparte tu plan de viaje / Share Your Travel Plan',
    subtitle: 'Coordina tu viaje / Coordinate your journey'
  }
};

const splitTranslation = (text: string): React.JSX.Element => {
  const [primary, secondary] = text.split(' / ');
  return (
    <React.Fragment>
      <span className="text-foreground">{primary}</span>
      <span className="text-muted-foreground text-sm ml-1">/ {secondary}</span>
    </React.Fragment>
  );
};

export const getTranslation = (key: TranslationKey, language: 'en' | 'es' = 'en'): React.JSX.Element => {
  return splitTranslation(translations[language][key]);
};
