
import { ChatInput } from "@/components/ChatInput";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/hooks/use-toast";
import { createTravelEntry } from "@/services/travelEntryService";

export const TravelForm = () => {
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
      project_id: 'default'
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
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Share Your Travel Plan
        <span className="text-sm font-normal text-muted-foreground ml-2">
          Comparte tu plan de viaje
        </span>
      </h2>
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
};
