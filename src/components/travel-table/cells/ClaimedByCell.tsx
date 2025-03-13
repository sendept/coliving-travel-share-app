
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";

interface ClaimedByCellProps {
  entry: TravelEntry;
  onClaimSpot: (id: string, name: string) => void;
  isEditing: boolean;
}

export const ClaimedByCell = ({ entry, onClaimSpot, isEditing }: ClaimedByCellProps) => {
  if (isEditing) return null;
  
  const claimedByContent = Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 
    ? entry.claimed_by.join(", ") 
    : "-";
  
  return (
    <div>
      <div className="mb-2">
        <span className="font-medium text-black">{entry.name}</span>
        {claimedByContent !== "-" && (
          <div className="text-gray-600 opacity-85">{claimedByContent}</div>
        )}
      </div>
      <div className="mb-2">
        <span className="text-xs text-gray-500">{entry.available_spots} spots available</span>
        <br/>
        <span className="text-xs text-gray-500">{entry.available_spots} {entry.available_spots === 1 ? 'Plaza' : 'Plazas'}</span>
      </div>
      {entry.available_spots > 0 && (
        <div>
          <ClaimForm entry={entry} onClaim={onClaimSpot} />
          <div className="text-[9px] text-gray-500 mt-1">join/unete as co-traveller</div>
        </div>
      )}
    </div>
  );
};
