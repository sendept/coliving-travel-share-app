
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { getTransportIcon } from "../utils/transportIconUtils";
import { getTranslation } from "@/lib/translations";
import { Phone } from "lucide-react";
import { EditForm } from "../EditForm";

interface MobileTravelRowProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string, contact?: string) => void;
  isAlternate?: boolean;
  editingEntry?: string | null;
  editForm?: Partial<TravelEntry>;
  setEditForm?: (form: Partial<TravelEntry>) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
}

// Define color pairs for co-travelers [background, text]
const coTravelerColorPairs = [
  ["#F2FCE2", "#3D7B15"], // Soft Green / Dark Green
  ["#E5DEFF", "#5E41D0"], // Soft Purple / Deep Purple
  ["#FFDEE2", "#BD3A4C"], // Soft Pink / Deep Pink
  ["#D3E4FD", "#2C65B1"], // Soft Blue / Deep Blue
  ["#FDE1D3", "#B95F2E"]  // Soft Peach / Deep Orange
];

export const MobileTravelRow = ({ 
  entry, 
  onStartEdit, 
  onClaimSpot,
  isAlternate = false,
  editingEntry,
  editForm = {},
  setEditForm = () => {},
  onSaveEdit = () => {},
  onCancelEdit = () => {}
}: MobileTravelRowProps) => {
  const transportIcon = getTransportIcon(entry.transport);
  const language = entry.language as "en" | "es" | "fr";
  const hasContact = !!entry.contact && entry.contact.trim() !== '';
  const bgColor = isAlternate ? "bg-[#F5F5F5]" : "bg-white";
  const isEditing = editingEntry === entry.id;

  const getMobileRoute = () => {
    return entry.route;
  };

  const getEditButtonText = () => {
    if (language === "es") {
      return `${entry.name} puede editar aquí`;
    } else {
      return `${entry.name} can edit here`;
    }
  };

  // Extract phone number from claimed person string if it exists
  const extractPhoneNumber = (claimedPerson: string) => {
    const match = claimedPerson.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  };

  // Extract name without phone number if it exists
  const extractName = (claimedPerson: string) => {
    return claimedPerson.replace(/\s*\([^)]*\)\s*/, '');
  };

  return (
    <div className={`md:hidden p-5 border-b mb-3 ${bgColor} rounded-none shadow-sm`} id={`entry-${entry.id}`}>
      <div className="bg-gray-200 inline-block px-4 py-1 rounded-full mb-4 mx-auto w-auto text-center" style={{display: "table", margin: "0 auto 1rem"}}>
        <h3 className="text-gray-600 text-sm">Travel together with {entry.name}</h3>
      </div>
      
      {isEditing ? (
        <div className="mb-6">
          <div className="flex-1">
            <EditForm 
              entry={entry} 
              editForm={editForm} 
              setEditForm={setEditForm} 
              field="route" 
              onSave={onSaveEdit}
            />
            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={onCancelEdit} className="mr-2">
                Cancel
              </Button>
              <Button onClick={onSaveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-start justify-center flex-col">
            <span className="text-xl mb-2 mx-auto">{transportIcon}</span>
            <div className="flex-1 text-center w-full">
              <div className="font-medium text-[#222222] text-base mb-2 px-3 py-2 rounded-lg border border-gray-300 text-center">
                {getMobileRoute()}
              </div>
              <button 
                className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer mx-auto block"
                onClick={() => onStartEdit(entry)}
              >
                {getEditButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <ClaimForm entry={entry} onClaim={onClaimSpot} />
      </div>

      <div className="text-sm mt-5 opacity-85">
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 ? (
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">{entry.name}</span>
              {hasContact && (
                <span className="text-xs text-gray-500 ml-2">
                  <Phone size={12} className="inline mr-1" />
                  {entry.contact}
                </span>
              )}
              <div className="flex flex-col space-y-1 mt-2">
                {entry.claimed_by.map((person, index) => {
                  const [bgColor, textColor] = coTravelerColorPairs[index % coTravelerColorPairs.length];
                  const phoneNumber = extractPhoneNumber(person);
                  const name = extractName(person);
                  return (
                    <span 
                      key={index}
                      className="text-sm font-normal px-2 py-1 rounded flex justify-between items-center"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      <span>{name}</span>
                      {phoneNumber && (
                        <span className="text-xs flex items-center">
                          <Phone size={10} className="mr-1" />
                          {phoneNumber}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="text-gray-600">
              {entry.available_spots > 0 && (
                <>{entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}</>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-600">
            {entry.name}
            {hasContact && (
              <span className="text-xs text-gray-500 ml-2">
                <Phone size={12} className="inline mr-1" />
                {entry.contact}
              </span>
            )}
            {entry.available_spots > 0 && (
              <> + {entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
