
import { TravelTable } from "@/components/travel-table/TravelTable";
import { PageHeader } from "@/components/PageHeader";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot, resetProjectEntries } from "@/services/travelEntryService";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to delete all entries? This cannot be undone.")) {
      const { error } = await resetProjectEntries('default');
      
      if (error) {
        console.error('Error resetting entries:', error);
        toast({
          title: "Error resetting entries",
          description: "Could not reset the entries",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset successful",
        description: "All entries have been deleted",
      });
    }
  };

  return (
    <div className="product-hunt-container">
      <div className="product-hunt-header">
        <PageHeader />
      </div>
      <div className="py-8 space-y-8">
        <div className="flex justify-end px-6">
          <Button 
            variant="destructive" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Reset All Entries
          </Button>
        </div>
        <TravelForm />
        <div className="relative">
          <div className="product-hunt-card p-6">
            <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
