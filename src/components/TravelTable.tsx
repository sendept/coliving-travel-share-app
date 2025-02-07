
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Check, X } from "lucide-react";

export interface TravelEntry {
  id: string;
  name: string;
  available_spots: number;
  route: string;
  transport: string;
  taxi_sharing: boolean;
  contact: string;
  claimed_by: string[];
  created_at?: string;
  updated_at?: string;
  last_edited_by?: string;
  last_edited_at?: string;
  language?: string;
}

interface TravelTableProps {
  entries: TravelEntry[];
  onClaimSpot: (id: string, name: string) => void;
}

export const TravelTable = ({ entries, onClaimSpot }: TravelTableProps) => {
  const [claimName, setClaimName] = useState<{ [key: string]: string }>({});
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TravelEntry>>({});
  const { toast } = useToast();

  const handleClaim = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry || entry.available_spots <= 0) {
      toast({
        title: "No spots available",
        description: "This travel option has no available spots",
        variant: "destructive",
      });
      return;
    }

    const name = claimName[id]?.trim();
    if (!name) {
      toast({
        title: "Please enter your name",
        description: "Your name is required to claim a spot",
        variant: "destructive",
      });
      return;
    }
    onClaimSpot(id, name);
    setClaimName((prev) => ({ ...prev, [id]: "" }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleClaim(id);
    }
  };

  const startEditing = (entry: TravelEntry) => {
    setEditingEntry(entry.id);
    setEditForm(entry);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setEditForm({});
  };

  const saveEditing = async () => {
    if (!editingEntry || !editForm) return;

    const { error } = await supabase
      .from('travel_entries')
      .update({
        ...editForm,
        last_edited_at: new Date().toISOString(),
        last_edited_by: claimName[editingEntry] || 'Anonymous'
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

  const renderCell = (entry: TravelEntry, field: keyof TravelEntry) => {
    if (editingEntry === entry.id) {
      if (field === 'taxi_sharing') {
        return (
          <select
            value={editForm[field]?.toString()}
            onChange={(e) => setEditForm(prev => ({ ...prev, [field]: e.target.value === 'true' }))}
            className="w-full p-2 border rounded"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }
      
      if (field === 'available_spots') {
        return (
          <Input
            type="number"
            value={editForm[field] || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
            className="w-20"
          />
        );
      }

      return (
        <Input
          value={editForm[field]?.toString() || ''}
          onChange={(e) => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
          className={field === 'route' ? 'w-full min-w-[400px]' : 'w-full'}
        />
      );
    }

    if (field === 'claimed_by') {
      return Array.isArray(entry[field]) && entry[field].length > 0 
        ? entry[field].join('\n')
        : '-';
    }

    if (field === 'taxi_sharing') {
      return entry[field] ? "Yes" : "No";
    }

    return entry[field];
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead className="w-[120px]">Available Spots</TableHead>
              <TableHead className="min-w-[400px]">Route</TableHead>
              <TableHead className="w-[120px]">Transport</TableHead>
              <TableHead className="w-[100px]">Taxi Sharing</TableHead>
              <TableHead className="w-[150px]">Contact</TableHead>
              <TableHead className="w-[150px]">Claimed By</TableHead>
              <TableHead className="w-[250px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {renderCell(entry, 'name')}
                </TableCell>
                <TableCell>{renderCell(entry, 'available_spots')}</TableCell>
                <TableCell className="whitespace-pre-wrap break-words max-w-[400px] py-4">
                  {renderCell(entry, 'route')}
                </TableCell>
                <TableCell>{renderCell(entry, 'transport')}</TableCell>
                <TableCell>{renderCell(entry, 'taxi_sharing')}</TableCell>
                <TableCell>{renderCell(entry, 'contact')}</TableCell>
                <TableCell className="whitespace-pre-line">
                  {renderCell(entry, 'claimed_by')}
                </TableCell>
                <TableCell>
                  {editingEntry === entry.id ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={saveEditing}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {entry.available_spots > 0 && (
                        <>
                          <Input
                            placeholder="Your name"
                            value={claimName[entry.id] || ""}
                            onChange={(e) =>
                              setClaimName((prev) => ({
                                ...prev,
                                [entry.id]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => handleKeyPress(e, entry.id)}
                            className="w-32"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => handleClaim(entry.id)}
                            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
                          >
                            Claim
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Feel free to use it. Built by sende.co
      </footer>
    </>
  );
};
