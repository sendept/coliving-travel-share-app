
import { ChatInput } from "@/components/ChatInput";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/hooks/use-toast";
import { createTravelEntry } from "@/services/travelEntryService";
import { PageSubtitle } from "@/components/PageSubtitle";

interface TravelFormProps {
  projectId?: string | null;
}

export const TravelForm = ({ projectId }: TravelFormProps) => {
  const { toast } = useToast();

  const handleSubmit = async (message: string) => {
    const parsed = parseMessage(message);
    if (!parsed) {
      toast({
        title: "Could not parse message",
        description: "Please try rephrasing your travel plan",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      name: parsed.name,
      available_spots: parsed.availableSpots,
      route: parsed.route,
      transport: parsed.transport,
      taxi_sharing: parsed.taxiSharing,
      contact: parsed.contact,
      claimed_by: [],
      language: parsed.language as 'en' | 'es',
      project_id: projectId || 'default',
      dietary_restrictions: parsed.dietary_restrictions || null
    };

    const { error } = await createTravelEntry(newEntry);

    if (error) {
      console.error('Error inserting entry:', error);
      toast({
        title: "Error adding travel plan",
        description: "Could not save your travel plan",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Travel plan added!",
      description: "Your travel plan has been successfully added to the list.",
    });
  };

  return (
    <div className="product-hunt-card p-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-1 text-gray-900">
          Share Your Travel Plan
        </h2>
        <PageSubtitle
          position="top"
          fontSize="medium"
          preset="elegant"
        >
          Comparte tu plan de viaje
        </PageSubtitle>
      </div>
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
};
