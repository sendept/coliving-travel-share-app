
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { Phone } from "lucide-react";

interface ClaimedByCellProps {
  entry: TravelEntry;
  onClaimSpot: (id: string, name: string) => void;
  isEditing: boolean;
}

// Define a set of pastel colors for co-travelers
const coTravelerColors = [
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#E5DEFF", // Soft Purple
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD"  // Soft Blue
];

export const ClaimedByCell = ({ entry, onClaimSpot, isEditing }: ClaimedByCellProps) => {
  if (isEditing) return null;

  const hasContact = !!entry.contact && entry.contact.trim() !== '';

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-col space-y-1 mb-2">
        <div className="flex items-center justify-center">
          <span className="font-medium text-center">{entry.name}</span>
          {hasContact && (
            <div className="ml-2 flex items-center text-sm text-gray-500">
              <Phone size={12} className="mr-1" />
              <span>{entry.contact}</span>
            </div>
          )}
        </div>
        
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 && (
          <div className="text-center">
            {entry.claimed_by.map((name, index) => (
              <span 
                key={index}
                className="text-sm font-normal px-1 py-0.5 rounded mx-1"
                style={{
                  backgroundColor: coTravelerColors[index % coTravelerColors.length],
                  color: "#333"
                }}
              >
                {name}
              </span>
            ))}
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
        <div className="text-xs text-gray-400 font-medium">
          0 spots/plazas
        </div>
      )}
    </div>
  );
};
