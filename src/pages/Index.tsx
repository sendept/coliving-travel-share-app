
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";

const Index = () => {
  const entries = useTravelEntries();
  const { toast } = useToast();

  const handleClaimSpot = async (id: string, name: string) => {
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
  };

  return <div className="product-hunt-container relative pb-20">
      <div>
        <PageHeader />
      </div>
      <div className="py-8 space-y-8">
        <TravelForm />
        <div className="relative">
          <div className="product-hunt-card px-0 py-0">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-4 text-sm text-gray-500 pb-2">
        <a 
          href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          Report a bug or suggest changes
        </a>
      </div>
    </div>;
};

export default Index;
