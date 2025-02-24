
import React from 'react';

type TranslationKey = 'name' | 'availableSpots' | 'route' | 'transport' | 'taxiSharing' | 'contact' | 'claimedBy' | 'actions' | 'title' | 'subtitle' | 'diet';

const translations: Record<'en' | 'es', Record<TranslationKey, string>> = {
  en: {
    name: 'NAME\nNOMBRE',
    availableSpots: 'AVAILABLE SPOTS\nPLAZAS',
    route: 'ROUTE\nRUTA',
    transport: 'TRANSPORT\nTRANSPORTE',
    contact: 'CONTACT\nCONTACTO',
    claimedBy: 'CLAIMED BY\nRESERVADO POR',
    actions: 'ACTIONS\nACCIONES',
    title: 'Share Your Travel Plan  Comparte tu plan de viaje',
    subtitle: 'Coordinate your journey  Coordina tu viaje',
    diet: 'DIET/ALLERGIES\nDIETAS/ALERGIAS'
  },
  es: {
    name: 'NOMBRE\nNAME',
    availableSpots: 'PLAZAS\nAVAILABLE SPOTS',
    route: 'RUTA\nROUTE',
    transport: 'TRANSPORTE\nTRANSPORT',
    contact: 'CONTACTO\nCONTACT',
    claimedBy: 'RESERVADO POR\nCLAIMED BY',
    actions: 'ACCIONES\nACTIONS',
    title: 'Comparte tu plan de viaje  Share Your Travel Plan',
    subtitle: 'Coordina tu viaje  Coordinate your journey',
    diet: 'DIETAS/ALERGIAS\nDIET/ALLERGIES'
  }
};

const splitTranslation = (text: string): React.JSX.Element => {
  if (text.includes('\n')) {
    const [primary, secondary] = text.split('\n');
    return (
      <div className="text-center">
        <div className="text-foreground">{primary}</div>
        <div className="text-muted-foreground text-sm">{secondary}</div>
      </div>
    );
  }
  
  const [primary, secondary] = text.split('  ');
  return (
    <React.Fragment>
      <span className="text-foreground">{primary}</span>
      <span className="text-muted-foreground text-sm ml-1">{secondary}</span>
    </React.Fragment>
  );
};

export const getTranslation = (key: TranslationKey, language: 'en' | 'es' = 'en'): React.JSX.Element => {
  return splitTranslation(translations[language][key]);
};
