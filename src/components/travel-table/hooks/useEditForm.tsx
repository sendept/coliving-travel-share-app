
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TravelEntry } from "../types";

export const useEditForm = () => {
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TravelEntry>>({});
  const { toast } = useToast();
  
  const handleStartEdit = (entry: TravelEntry) => {
    setEditingEntry(entry.id);
    setEditForm(entry);
  };
  
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditForm({});
  };
  
  const handleSaveEdit = async () => {
    if (!editingEntry || !editForm) return;
    
    try {
      const updateData: Partial<TravelEntry> = {
        ...editForm,
        last_edited_at: new Date().toISOString()
      };
      
      if (updateData.date_time === '') {
        updateData.date_time = null;
      }
      
      if (updateData.dietary_restrictions === '') {
        updateData.dietary_restrictions = null;
      }
      
      console.log("Updating entry with data:", updateData);
      
      const { error } = await supabase
        .from('travel_entries')
        .update(updateData)
        .eq('id', editingEntry);
      
      if (error) {
        console.error('Error saving changes:', error);
        toast({
          title: "Error saving changes",
          description: error.message || "Could not save your changes",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully"
      });
      
      setEditingEntry(null);
      setEditForm({});
    } catch (err) {
      console.error("Unexpected error in handleSaveEdit:", err);
      toast({
        title: "Error saving changes",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    editingEntry,
    editForm,
    setEditForm,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit
  };
};
