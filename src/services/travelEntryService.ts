
import { supabase } from "@/integrations/supabase/client";
import type { TravelEntry } from "@/components/travel-table/types";

export const createTravelEntry = async (newEntry: Omit<TravelEntry, 'id' | 'created_at' | 'updated_at'>) => {
  const { error } = await supabase
    .from('travel_entries')
    .insert([newEntry]);
  return { error };
};

export const claimTravelSpot = async (entry: TravelEntry, name: string) => {
  const { error } = await supabase
    .from('travel_entries')
    .update({
      available_spots: entry.available_spots - 1,
      claimed_by: [...entry.claimed_by, name],
    })
    .eq('id', entry.id);
  return { error };
};

export const resetProjectEntries = async (projectId: string) => {
  const { error } = await supabase
    .from('travel_entries')
    .delete()
    .eq('project_id', projectId);
  return { error };
};

export const createProject = async (name: string, description?: string) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      id: crypto.randomUUID(), // Generate UUID for the project
      name,
      description
    }])
    .select('*')
    .single();
  return { data, error };
};
