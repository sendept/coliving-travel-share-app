
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TravelTableRow } from "./TravelTableRow";
import { getTranslation } from "@/lib/translations";
import type { TravelEntry, TravelTableProps } from "./types";

export type { TravelEntry } from "./types";
export const TravelTable = ({ entries, onClaimSpot }: TravelTableProps) => {
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

    const { error } = await supabase
      .from('travel_entries')
      .update({
        ...editForm,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', editingEntry);

    if (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    });

    setEditingEntry(null);
    setEditForm({});
  };

  // Use the language of the first entry, or default to English
  const language: 'en' | 'es' = entries[0]?.language || 'en';

  return (
    <div className="relative min-h-[calc(100vh-400px)]">
      <div>
        <div className="text-left mt-5 mb-5">
          <p className="text-[9px] text-gray-500">Scroll to the right to edit your text</p>
          <p className="text-[9px] text-gray-500">Desliza hacia derecha para editar tu texto</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="w-[150px]">{getTranslation('name', language)}</TableHead>
              <TableHead className="w-[120px]">{getTranslation('availableSpots', language)}</TableHead>
              <TableHead className="min-w-[400px]">{getTranslation('route', language)}</TableHead>
              <TableHead className="w-[120px]">{getTranslation('transport', language)}</TableHead>
              <TableHead className="w-[150px]">{getTranslation('contact', language)}</TableHead>
              <TableHead className="w-[200px]">{getTranslation('claimedBy', language)}</TableHead>
              <TableHead className="w-[150px]">Diet/Allergies</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TravelTableRow
                key={entry.id}
                entry={entry}
                editingEntry={editingEntry}
                editForm={editForm}
                setEditForm={setEditForm}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onStartEdit={handleStartEdit}
                onClaimSpot={onClaimSpot}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4 mt-[90px] bg-white">
        <span className="inline-flex items-center">
          Feel free to use it. Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1">
            <img 
              src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" 
              alt="Sende" 
              className="h-6"
            />
          </a>
        </span>
      </footer>
    </div>
  );
};
