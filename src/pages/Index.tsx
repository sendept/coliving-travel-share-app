
import { useState, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { TravelTable } from "@/components/travel-table/TravelTable";
import { TravelEntry } from "@/components/travel-table/types";
import { PageHeader } from "@/components/PageHeader";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const { toast } = useToast();

  // Fetch entries
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('travel_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        toast({
          title: "Error loading entries",
          description: "Could not load travel entries",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEntries(data);
      }
    };

    fetchEntries();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:travel_entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_entries'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            setEntries((prev) => [payload.new as TravelEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries((prev) =>
              prev.map((entry) =>
                entry.id === payload.new.id ? (payload.new as TravelEntry) : entry
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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

    const { error } = await supabase
      .from('travel_entries')
      .insert([newEntry]);

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

  const handleClaimSpot = async (id: string, name: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const { error } = await supabase
      .from('travel_entries')
      .update({
        available_spots: entry.available_spots - 1,
        claimed_by: [...entry.claimed_by, name],
      })
      .eq('id', id);

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
    <div className="container py-8 space-y-8">
      <PageHeader />
      
      <div className="max-w-2xl mx-auto space-y-4">
        <ChatInput onSubmit={handleSubmit} />
      </div>

      <div className="overflow-x-auto">
        <TravelTable entries={entries} onClaimSpot={handleClaimSpot} />
      </div>
    </div>
  );
};

export default Index;
