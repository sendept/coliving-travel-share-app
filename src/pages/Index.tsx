
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";
import { ArrowRight } from "lucide-react";

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
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Spot claimed!",
      description: `${name} has successfully claimed a spot.`,
    });
  };

  return (
    <div className="product-hunt-container">
      <div className="product-hunt-header">
        <PageHeader />
      </div>
      <div className="py-8 space-y-8">
        <TravelForm />
        <div className="relative">
          <div className="absolute -top-8 left-0 w-full">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-[3cm] h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Scroll to the right to edit your text</p>
          </div>
          <div className="product-hunt-card p-6">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
