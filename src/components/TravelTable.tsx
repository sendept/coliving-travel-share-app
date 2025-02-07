
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
}

interface TravelTableProps {
  entries: TravelEntry[];
  onClaimSpot: (id: string, name: string) => void;
}

export const TravelTable = ({ entries, onClaimSpot }: TravelTableProps) => {
  const [claimName, setClaimName] = useState<{ [key: string]: string }>({});
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
              <TableHead className="w-[250px]">Claim Spot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.available_spots}</TableCell>
                <TableCell className="whitespace-pre-wrap break-words max-w-[400px] py-4">
                  {entry.route}
                </TableCell>
                <TableCell>{entry.transport}</TableCell>
                <TableCell>{entry.taxi_sharing ? "Yes" : "No"}</TableCell>
                <TableCell>{entry.contact}</TableCell>
                <TableCell className="whitespace-pre-line">
                  {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 
                    ? entry.claimed_by.join('\n')
                    : '-'}
                </TableCell>
                <TableCell>
                  {entry.available_spots > 0 && (
                    <div className="flex gap-2">
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
