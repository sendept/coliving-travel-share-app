
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
  available_spots: number;  // Changed to match DB schema
  route: string;
  transport: string;
  taxi_sharing: boolean;  // Changed to match DB schema
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
              <TableHead>Name</TableHead>
              <TableHead>Available Spots</TableHead>
              <TableHead className="min-w-[300px]">Route</TableHead>
              <TableHead>Transport</TableHead>
              <TableHead>Taxi Sharing</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Claimed By</TableHead>
              <TableHead>Claim Spot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.available_spots}</TableCell>
                <TableCell className="whitespace-pre-line break-words max-w-[300px]">{entry.route}</TableCell>
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
