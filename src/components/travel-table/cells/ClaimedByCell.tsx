
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { Phone } from "lucide-react";

interface ClaimedByCellProps {
  entry: TravelEntry;
  onClaimSpot: (id: string, name: string) => void;
  isEditing: boolean;
}

export const ClaimedByCell = ({ entry, onClaimSpot, isEditing }: ClaimedByCellProps) => {
  if (isEditing) return null;

  const hasContact = !!entry.contact && entry.contact.trim() !== '';

  return (
    <div>
      <div className="flex flex-col space-y-1 mb-2">
        <div className="flex items-center">
          <span className="font-medium">{entry.name}</span>
          {hasContact && (
            <div className="ml-2 flex items-center text-sm text-gray-500">
              <Phone size={12} className="mr-1" />
              <span>{entry.contact}</span>
            </div>
          )}
        </div>
        
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 && (
          <div className="text-sm text-gray-500">
            + {entry.claimed_by.join(", ")}
          </div>
        )}
      </div>

      {entry.available_spots > 0 ? (
        <div>
          <div className="text-sm text-gray-500 mb-2">
            {entry.available_spots} {entry.available_spots === 1 ? 'spot' : 'spots'} left
          </div>
          <ClaimForm entry={entry} onClaim={onClaimSpot} />
        </div>
      ) : (
        <div className="text-sm text-amber-500">
          0 spots/plazas
        </div>
      )}
    </div>
  );
};
