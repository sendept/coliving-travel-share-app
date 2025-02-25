import React from 'react';
type TranslationKey = 'name' | 'availableSpots' | 'route' | 'transport' | 'taxiSharing' | 'contact' | 'claimedBy' | 'actions' | 'title' | 'subtitle' | 'diet';
const translations: Record<'en' | 'es', Record<TranslationKey, string>> = {
  en: {
    name: 'Name\nNombre',
    availableSpots: 'Available Spots\nPlazas',
    route: 'Route\nRuta',
    transport: 'Transport\nTransporte',
    taxiSharing: 'Taxi Sharing\nCompartir Taxi',
    contact: 'Contact\nContacto',
    claimedBy: 'Claimed By\nReservado Por',
    actions: 'Actions\nAcciones',
    title: 'Share Your Travel Plan  Comparte tu plan de viaje',
    subtitle: 'Coordinate your journey  Coordina tu viaje',
    diet: 'Diet/Allergies\nDietas/Alergias'
  },
  es: {
    name: 'Nombre\nName',
    availableSpots: 'Plazas\nAvailable Spots',
    route: 'Ruta\nRoute',
    transport: 'Transporte\nTransport',
    taxiSharing: 'Compartir Taxi\nTaxi Sharing',
    contact: 'Contacto\nContact',
    claimedBy: 'Reservado Por\nClaimed By',
    actions: 'Acciones\nActions',
    title: 'Comparte tu plan de viaje  Share Your Travel Plan',
    subtitle: 'Coordina tu viaje  Coordinate your journey',
    diet: 'Dietas/Alergias\nDiet/Allergies'
  }
};
const splitTranslation = (text: string): React.JSX.Element => {
  if (text.includes('\n')) {
    const [primary, secondary] = text.split('\n');
    return <div className="text-center">
        <div className="text-foreground mx-0 py-0 my-0">{primary}</div>
        <div className="text-muted-foreground text-sm py-0 my-0">{secondary}</div>
      </div>;
  }
  const [primary, secondary] = text.split('  ');
  return <React.Fragment>
      <span className="text-foreground">{primary}</span>
      <span className="text-muted-foreground text-sm ml-1">{secondary}</span>
    </React.Fragment>;
};
export const getTranslation = (key: TranslationKey, language: 'en' | 'es' = 'en'): React.JSX.Element => {
  return splitTranslation(translations[language][key]);
};