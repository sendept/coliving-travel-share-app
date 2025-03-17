
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";
import { useCallback, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTranslation } from "@/lib/translations";

const Index = () => {
  const entries = useTravelEntries();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleClaimSpot = useCallback(async (id: string, name: string, contact?: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    const { error } = await claimTravelSpot(entry, name, contact);
    
    if (error) {
      console.error('Error updating entry:', error);
      toast({
        title: "Error claiming spot",
        description: "Could not claim the spot",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Spot claimed!",
      description: `${name} has successfully claimed a spot.`
    });
  }, [entries, toast]);

  const headerComponent = useMemo(() => <PageHeader />, []);

  return (
    <div className="product-hunt-container relative pb-32">
      <div>
        {headerComponent}
      </div>
      <div className="py-8 space-y-12">
        <div className="relative">
          <div className="product-hunt-card px-0 py-0 lg:w-screen lg:max-w-none lg:left-1/2 lg:right-1/2 lg:ml-[-50vw] lg:mr-[-50vw] lg:relative">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
        
        <div className="mt-32 text-center mb-32">
          <h2 className={`text-3xl md:text-4xl font-medium mb-10 ${isMobile ? 'mx-auto text-center w-full' : ''}`}>
            <span>{getTranslation("inviteOthers", "en")}</span>
            <br />
            <span className="text-gray-500">{getTranslation("shareYourCarTaxi", "es")}</span>
          </h2>
          <p className="mb-8 text-gray-600">
            {getTranslation("formExplanation", "en")}
            <br />
            {getTranslation("formExplanation", "es")}
          </p>
          <TravelForm />
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-2 bg-white">
        <span className="inline-flex items-center gap-1 mx-0">
          <a href="https://sende.co/share-app" target="_blank" rel="noopener noreferrer">
            Feel free to use this app at your space
          </a>
          Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="px-0">
            <img 
              src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" 
              alt="Sende" 
              className="h-6" 
              loading="lazy"
            />
          </a>
        </span>
      </footer>
    </div>
  );
};

export default Index;
