
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";

const Index = () => {
  const entries = useTravelEntries();
  const {
    toast
  } = useToast();
  const handleClaimSpot = async (id: string, name: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    const {
      error
    } = await claimTravelSpot(entry, name);
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
  };
  return <div className="product-hunt-container relative pb-20">
      <div>
        <PageHeader />
      </div>
      <div className="py-8 space-y-8">
        <TravelForm />
        <div className="relative">
          <div className="text-center my-4">
            <div className="mt-4 mb-5 text-sm text-gray-500 flex items-center justify-center gap-2 font-medium">
              <span className="mt-4 mb-5">View or join other shared rides / Baja para ver o unirte a otros viajes</span>
              <img src="/lovable-uploads/7b37375b-3bd2-4a96-b1a3-2e2a6a7bcbbb.png" alt="Scroll down" className="h-6 w-6 object-contain" />
            </div>
          </div>
          <div className="product-hunt-card px-0 py-0">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-4 text-[9px] text-gray-500 pb-2">
        <a href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 underline text-[9px]">
          Report a bug or suggest changes
        </a>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4 bg-white">
        <span className="inline-flex items-center gap-1 mx-0">
          Feel free to use it. Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="px-0">
            <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
          </a>
        </span>
      </footer>
    </div>;
};
export default Index;
