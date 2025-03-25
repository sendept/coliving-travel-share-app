import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { TravelEntry } from "./types";

interface ClaimFormProps {
  entry: TravelEntry;
  onClaim: (id: string, name: string, contact?: string) => void;
}

export const ClaimForm = ({
  entry,
  onClaim
}: ClaimFormProps) => {
  const [claimName, setClaimName] = useState("");
  const [claimContact, setClaimContact] = useState("");
  const [showContactField, setShowContactField] = useState(false);
  const [nameFieldFocused, setNameFieldFocused] = useState(false);
  const [contactFieldFocused, setContactFieldFocused] = useState(false);
  const {
    toast
  } = useToast();

  const handleClaim = () => {
    if (entry.available_spots <= 0) {
      toast({
        title: "No spots available",
        description: "This travel option has no available spots",
        variant: "destructive"
      });
      return;
    }
    const name = claimName.trim();
    if (!name) {
      toast({
        title: "Please enter your name",
        description: "Your name is required to claim a spot",
        variant: "destructive"
      });
      return;
    }
    if (showContactField) {
      onClaim(entry.id, name, claimContact.trim());
      setClaimName("");
      setClaimContact("");
      setShowContactField(false);
    } else {
      setShowContactField(true);
    }
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!showContactField) {
        const name = claimName.trim();
        if (name) {
          setShowContactField(true);
          e.preventDefault();
        } else {
          toast({
            title: "Please enter your name",
            description: "Your name is required to claim a spot",
            variant: "destructive"
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
    <div className="flex flex-col items-center w-full max-w-[300px] mx-auto">
      <div className="flex gap-3 items-center justify-center w-full">
        {!showContactField ? (
          <Input 
            placeholder="Name / Nombre" 
            value={claimName} 
            onChange={e => setClaimName(e.target.value)} 
            onKeyPress={handleNameKeyPress}
            onFocus={() => setNameFieldFocused(true)}
            onBlur={() => setNameFieldFocused(false)}
            className={`
              bg-white rounded-md h-[49px] text-center text-base w-[133px] flex-none
              border border-gray-300
              ${nameFieldFocused ? "border-blue-500" : ""}
            `}
            style={{ fontSize: '16px' }}
          />
        ) : (
          <Input 
            placeholder="Contact / Contacto" 
            value={claimContact} 
            onChange={e => setClaimContact(e.target.value)} 
            onKeyPress={handleContactKeyPress}
            onFocus={() => setContactFieldFocused(true)}
            onBlur={() => setContactFieldFocused(false)}
            className={`
              bg-white rounded-md h-[49px] text-center text-base w-[133px] flex-none
              border border-gray-300
              ${contactFieldFocused ? "border-blue-500" : ""}
            `}
            style={{ fontSize: '16px' }}
            autoFocus 
          />
        )}
        <Button 
          variant={showContactField ? "secondary" : "outline"} 
          onClick={handleClaim} 
          className={`
            rounded-md h-[49px] w-[133px] px-6 text-base flex-none
            ${showContactField ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500"}
          `}
          style={{ fontSize: '16px' }}
        >
          {!showContactField ? "Join / Únete" : "Add number"}
        </Button>
      </div>
    </div>
  );
};
