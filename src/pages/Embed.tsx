
import { useSearchParams } from "react-router-dom";
import { TravelTable } from "@/components/travel-table/TravelTable";
import { TravelForm } from "@/components/travel-form/TravelForm";
import { useTravelEntries } from "@/hooks/useTravelEntries";
import { useToast } from "@/hooks/use-toast";
import { claimTravelSpot } from "@/services/travelEntryService";
import { ProjectProvider } from "@/contexts/ProjectContext";

const Embed = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const entries = useTravelEntries(projectId);
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
    <ProjectProvider projectId={projectId}>
      <div className="p-4">
        <TravelForm projectId={projectId} />
        <div className="mt-8">
          <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default Embed;
