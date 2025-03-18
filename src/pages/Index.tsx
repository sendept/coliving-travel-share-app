
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";
import { useCallback, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTranslation } from "@/lib/translations";
import { TableFooter } from "@/components/travel-table/components/TableFooter";

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
    <div className="product-hunt-container relative pb-4">
      <div>
        {headerComponent}
      </div>
      <div className="py-8 space-y-12">
        <div className="relative">
          <div className="product-hunt-card px-0 py-0 mx-auto bg-white w-full overflow-x-hidden">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
        
        <div className="mt-16 mb-8" style={{ marginTop: '60px' }}>
          <h2 className={`text-3xl md:text-4xl font-medium mb-10 ${isMobile ? 'text-left px-4' : 'text-center'}`}>
            <span>{getTranslation("inviteOthers", "en")}</span>
            <br />
            <span className="text-gray-500">{getTranslation("shareYourCarTaxi", "es")}</span>
          </h2>
          <p className={`mb-8 ${isMobile ? 'text-left px-4 text-black' : 'text-center text-gray-600'}`}>
            {getTranslation("formExplanation", "en")}
            <br />
            {getTranslation("formExplanation", "es")}
          </p>
          <TravelForm projectId={undefined} />
        </div>
      </div>
      
      <div>
        <TableFooter />
      </div>
    </div>
  );
};

export default Index;
