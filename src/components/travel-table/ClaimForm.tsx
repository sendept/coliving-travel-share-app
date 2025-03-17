
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { TravelEntry } from "./types";

interface ClaimFormProps {
  entry: TravelEntry;
  onClaim: (id: string, name: string, contact?: string) => void;
}

export const ClaimForm = ({ entry, onClaim }: ClaimFormProps) => {
  const [claimName, setClaimName] = useState("");
  const [claimContact, setClaimContact] = useState("");
  const [showContactField, setShowContactField] = useState(false);
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

    if (showContactField) {
      // If showing contact field, submit both name and contact
      onClaim(entry.id, name, claimContact.trim());
      setClaimName("");
      setClaimContact("");
      setShowContactField(false);
    } else {
      // First submission, just show contact field
      setShowContactField(true);
    }
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!showContactField) {
        // First Enter press - show contact field
        const name = claimName.trim();
        if (name) {
          setShowContactField(true);
          e.preventDefault();
        } else {
          toast({
            title: "Please enter your name",
            description: "Your name is required to claim a spot",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleContactKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClaim();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-3 items-center w-full">
        {!showContactField ? (
          <Input
            placeholder="Name / Nombre"
            value={claimName}
            onChange={(e) => setClaimName(e.target.value)}
            onKeyPress={handleNameKeyPress}
            className="w-full md:w-32 bg-white border border-gray-200 rounded-full h-[46px] text-center text-base"
          />
        ) : (
          <Input
            placeholder="Contact / Contacto"
            value={claimContact}
            onChange={(e) => setClaimContact(e.target.value)}
            onKeyPress={handleContactKeyPress}
            className="w-full md:w-32 bg-white border border-gray-200 rounded-full h-[46px] text-center text-base"
            autoFocus
          />
        )}
        <Button
          variant="secondary"
          onClick={handleClaim}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white whitespace-nowrap rounded-full h-[46px] px-6 text-base"
        >
          {!showContactField ? "Join / Únete" : "Submit / Enviar"}
        </Button>
      </div>
    </div>
  );
};
