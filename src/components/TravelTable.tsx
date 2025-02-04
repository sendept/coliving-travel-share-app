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
import { useToast } from "@/components/ui/use-toast";

export interface TravelEntry {
  id: string;
  name: string;
  travelersWith: number;
  availableSpots: number;
  route: string;
  transportFrom: string;
  taxiSharing: boolean;
  contact: string;
  claimedBy: string;
}

interface TravelTableProps {
  entries: TravelEntry[];
  onClaimSpot: (id: string, name: string) => void;
}

export const TravelTable = ({ entries, onClaimSpot }: TravelTableProps) => {
  const [claimName, setClaimName] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleClaim = (id: string) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Travelers With</TableHead>
            <TableHead>Available Spots</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Transport From</TableHead>
            <TableHead>Taxi Sharing</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Claim Spot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell>{entry.travelersWith}</TableCell>
              <TableCell>{entry.availableSpots}</TableCell>
              <TableCell>{entry.route}</TableCell>
              <TableCell>{entry.transportFrom}</TableCell>
              <TableCell>{entry.taxiSharing ? "Yes" : "No"}</TableCell>
              <TableCell>{entry.contact}</TableCell>
              <TableCell>
                {entry.claimedBy ? (
                  <span className="text-muted-foreground">
                    Claimed by {entry.claimedBy}
                  </span>
                ) : (
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
                      className="w-32"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => handleClaim(entry.id)}
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
  );
};