
import { supabase } from "@/integrations/supabase/client";
import type { TravelEntry } from "@/components/travel-table/types";

export const createTravelEntry = async (newEntry: Omit<TravelEntry, 'id' | 'created_at' | 'updated_at'>) => {
  console.log("Creating travel entry with data:", newEntry);
  
  // Ensure we have default values for nullable fields
  const entryWithDefaults = {
    ...newEntry,
    claimed_by: newEntry.claimed_by || [],
    dietary_restrictions: newEntry.dietary_restrictions || null,
    date_time: newEntry.date_time || null,
    project_id: newEntry.project_id || 'default',
    language: newEntry.language || 'en',
    taxi_sharing: newEntry.taxi_sharing ?? false,
  };
  
  const { data, error } = await supabase
    .from('travel_entries')
    .insert([entryWithDefaults])
    .select();
    
  return { data, error };
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
