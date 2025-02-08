
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
      language: 'en',
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
    <div className="max-w-2xl mx-auto space-y-4">
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
};
