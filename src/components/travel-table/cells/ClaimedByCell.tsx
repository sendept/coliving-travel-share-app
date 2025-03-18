
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";

interface ClaimedByCellProps {
  entry: TravelEntry;
  onClaimSpot: (id: string, name: string) => void;
  isEditing: boolean;
}

// Define color pairs for co-travelers [background, text]
const coTravelerColorPairs = [
  ["#F2FCE2", "#3D7B15"], // Soft Green / Dark Green
  ["#E5DEFF", "#5E41D0"], // Soft Purple / Deep Purple
  ["#FFDEE2", "#BD3A4C"], // Soft Pink / Deep Pink
  ["#D3E4FD", "#2C65B1"], // Soft Blue / Deep Blue
  ["#FDE1D3", "#B95F2E"]  // Soft Peach / Deep Orange
];

export const ClaimedByCell = ({ entry, onClaimSpot, isEditing }: ClaimedByCellProps) => {
  if (isEditing) return null;

  // Helper function to extract phone numbers from claimed by strings
  const extractNameAndContact = (person: string) => {
    const match = person.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
    if (match) {
      const [_, name, contact] = match;
      return { name: name.trim(), contact: contact || null };
    }
    return { name: person, contact: null };
  };

  const hasContact = !!entry.contact && entry.contact.trim() !== '';

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-col space-y-1 mb-2">
        <div className="flex items-center justify-center">
          <span className="font-medium text-center">{entry.name}</span>
          {hasContact && (
            <div className="ml-2 flex items-center text-sm text-gray-500">
              <span>{entry.contact}</span>
            </div>
          )}
        </div>
        
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 && (
          <div className="text-center flex flex-col space-y-1 mt-2">
            {entry.claimed_by.map((person, index) => {
              const [bgColor, textColor] = coTravelerColorPairs[index % coTravelerColorPairs.length];
              const { name, contact } = extractNameAndContact(person);
              return (
                <div 
                  key={index}
                  className="text-sm font-normal px-2 py-1 rounded mx-auto flex justify-between items-center"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    display: "flex",
                    width: "100%",
                    maxWidth: "280px"
                  }}
                >
                  <span>{name}</span>
                  {contact && (
                    <span className="text-xs ml-2">{contact}</span>
                  )}
                </div>
              );
            })}
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
