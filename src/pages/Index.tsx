
import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { TravelTable, type TravelEntry } from "@/components/TravelTable";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const { toast } = useToast();

  const handleSubmit = (message: string) => {
    const parsed = parseMessage(message);
    if (!parsed) {
      toast({
        title: "Could not parse message",
        description: "Please try rephrasing your travel plan",
        variant: "destructive",
      });
      return;
    }

    const newEntry: TravelEntry = {
      id: crypto.randomUUID(),
      claimedBy: "",
      ...parsed,
    };

    setEntries((prev) => [newEntry, ...prev]);
    toast({
      title: "Travel plan added!",
      description: "Your travel plan has been successfully added to the list.",
    });
  };

  const handleClaimSpot = (id: string, name: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              availableSpots: entry.availableSpots - 1,
              claimedBy: name,
            }
          : entry
      )
    );
    toast({
      title: "Spot claimed!",
      description: `${name} has successfully claimed a spot.`,
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center">Travel Coordination</h1>
        <p className="text-center text-muted-foreground">
          Share your travel plans or find a ride by entering your details below
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ChatInput onSubmit={handleSubmit} />
      </div>

      <div className="overflow-x-auto">
        <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
      </div>
    </div>
  );
};

export default Index;
