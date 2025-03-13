
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";
import { useCallback, useMemo } from "react";

const Index = () => {
  const entries = useTravelEntries();
  const { toast } = useToast();
  
  const handleClaimSpot = useCallback(async (id: string, name: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    const { error } = await claimTravelSpot(entry, name);
    
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
      <div className="py-8 space-y-8">
        <div className="relative">
          <div className="product-hunt-card px-0 py-0 lg:w-screen lg:max-w-none lg:left-1/2 lg:right-1/2 lg:ml-[-50vw] lg:mr-[-50vw] lg:relative">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
        
        <div className="mt-12 text-center mb-16">
          <h2 className="text-lg font-medium mb-3">
            <span>Share your Travel plan here</span>
            <br />
            <span className="text-gray-500">Comparte tu plan de viaje aquí</span>
          </h2>
          <TravelForm />
          <div className="mt-2 text-center mb-[40px]">
            <a 
              href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F97316] hover:text-[#F97316]/80 underline text-[9px]"
            >
              Report a bug or suggest changes
            </a>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-2 bg-white">
        <span className="inline-flex items-center gap-1 mx-0">
          Feel free to use it. Built by
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
