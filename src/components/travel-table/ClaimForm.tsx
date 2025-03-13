
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { TravelEntry } from "./types";

interface ClaimFormProps {
  entry: TravelEntry;
  onClaim: (id: string, name: string) => void;
}

export const ClaimForm = ({ entry, onClaim }: ClaimFormProps) => {
  const [claimName, setClaimName] = useState("");
  const { toast } = useToast();

  const handleClaim = () => {
    if (entry.available_spots <= 0) {
      toast({
        title: "No spots available",
        description: "This travel option has no available spots",
        variant: "destructive",
      });
      return;
    }

    const name = claimName.trim();
    if (!name) {
      toast({
        title: "Please enter your name",
        description: "Your name is required to claim a spot",
        variant: "destructive",
      });
      return;
    }
    onClaim(entry.id, name);
    setClaimName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClaim();
    }
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <Input
        placeholder="Name / Nombre"
        value={claimName}
        onChange={(e) => setClaimName(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full md:w-32 bg-white border border-gray-200 rounded-full h-[46px]"
      />
      <Button
        variant="secondary"
        onClick={handleClaim}
        className="bg-[#F97316] hover:bg-[#F97316]/90 text-white whitespace-nowrap rounded-full h-[46px] px-6"
      >
        Join / Únete
      </Button>
    </div>
  );
};
