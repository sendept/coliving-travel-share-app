
import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TravelTableRow } from "./TravelTableRow";
import { getTranslation } from "@/lib/translations";
import type { TravelEntry, TravelTableProps } from "./types";
export type { TravelEntry } from "./types";

export const TravelTable = ({
  entries,
  onClaimSpot
}: TravelTableProps) => {
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TravelEntry>>({});
  const {
    toast
  } = useToast();
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
    const {
      error
    } = await supabase.from('travel_entries').update({
      ...editForm,
      last_edited_at: new Date().toISOString()
    }).eq('id', editingEntry);
    if (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes",
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
  };
  const language: 'en' | 'es' = entries[0]?.language || 'en';
  return <div className="relative min-h-[calc(100vh-400px)]">
      <div className="bg-[#F5F5F5] p-4 rounded-lg px-10">
        <div className="text-left mb-16 md:hidden flex items-center">
          <div>
            <p className="text-[9px] text-gray-500">Desliza hacia la derecha para editar o ver tu texto</p>
            <p className="text-[9px] text-gray-500">Scroll to the right to see or edit your text</p>
          </div>
          <div className="flex items-center ml-2">
            <img src="/lovable-uploads/0347ed37-e470-46cd-a263-99763613105a.png" alt="Scroll" className="h-8 w-8 object-contain" />
          </div>
        </div>
        <div className="lg:overflow-visible overflow-x-auto overflow-y-auto scrollbar-visible" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #F5F5F5',
        transform: 'rotateX(180deg)'
      }}>
          <div style={{
          transform: 'rotateX(180deg)'
        }}>
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-none bg-[#F5F5F5]">
                  <TableHead className="w-[80px] text-center align-middle border-r">
                    <div className="text-sm">Edit</div>
                    <div className="text-[10px]">Editar</div>
                  </TableHead>
                  <TableHead className="lg:w-[240px] w-[160px] text-center align-middle border-r">
                    <div className="text-sm">Travel together</div>
                    <div className="text-[10px]">Viajar juntos</div>
                  </TableHead>
                  <TableHead className="lg:w-[400px] min-w-[300px] text-center align-middle border-r">
                    <div className="text-sm">Route</div>
                    <div className="text-[10px]">Ruta</div>
                  </TableHead>
                  <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
                    <div className="text-sm whitespace-nowrap">Date/Hour</div>
                    <div className="text-[10px] whitespace-nowrap">Fecha/Hora</div>
                  </TableHead>
                  <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
                    <div className="text-sm">Contact</div>
                    <div className="text-[10px]">Contacto</div>
                  </TableHead>
                  <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
                    <div className="text-sm">Diet</div>
                    <div className="text-[10px]">Dieta</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => <TravelTableRow key={entry.id} entry={entry} editingEntry={editingEntry} editForm={editForm} setEditForm={setEditForm} onSaveEdit={handleSaveEdit} onCancelEdit={handleCancelEdit} onStartEdit={handleStartEdit} onClaimSpot={onClaimSpot} className="bg-[#F5F5F5]" />)}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Vertical bug report link */}
        <div className="absolute bottom-4 right-1 origin-bottom-right rotate-90 transform z-10">
          <a 
            href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[9px] text-[#F97316] hover:text-[#F97316]/80 underline whitespace-nowrap px-0 py-0 mx-[10px] my-0 block mt-4"
          >
            Report a bug or suggest changes
          </a>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4 mt-[90px] bg-white">
        <span className="inline-flex items-center">
          Feel free to use it. Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1">
            <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
          </a>
        </span>
      </footer>
    </div>;
};
