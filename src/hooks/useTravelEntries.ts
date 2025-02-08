
import { useState, useEffect } from "react";
import { TravelEntry } from "@/components/travel-table/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTravelEntries = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const { toast } = useToast();

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

  return entries;
};
