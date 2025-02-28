
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
  
  // Memoize the handler to prevent unnecessary re-renders
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

  // Memoize the rendered components to prevent unnecessary re-renders
  const headerComponent = useMemo(() => <PageHeader />, []);
  const formComponent = useMemo(() => <TravelForm />, []);
  
  return (
    <div className="product-hunt-container relative pb-20">
      <div>
        {headerComponent}
      </div>
      <div className="py-8 space-y-8">
        {formComponent}
        <div className="relative">
          <div className="text-center my-4">
            <div className="mt-4 mb-5 text-sm text-gray-500 flex items-center justify-center gap-2 font-medium">
              <span className="mt-4 mb-5">View or join other shared rides / Baja para ver o unirte a otros viajes</span>
              <img 
                src="/lovable-uploads/7b37375b-3bd2-4a96-b1a3-2e2a6a7bcbbb.png" 
                alt="Scroll down" 
                className="h-8 w-8 object-contain" 
                loading="lazy" // Optimize image loading
              />
            </div>
          </div>
          <div className="product-hunt-card px-0 py-0 lg:w-screen lg:max-w-none lg:left-1/2 lg:right-1/2 lg:ml-[-50vw] lg:mr-[-50vw] lg:relative">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4 bg-white">
        <span className="inline-flex items-center gap-1 mx-0">
          Feel free to use it. Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="px-0">
            <img 
              src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" 
              alt="Sende" 
              className="h-6" 
              loading="lazy" // Optimize image loading
            />
          </a>
        </span>
      </footer>
    </div>
  );
};

export default Index;
