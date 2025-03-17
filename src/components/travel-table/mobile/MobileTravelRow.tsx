
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { getTransportIcon } from "../utils/transportIconUtils";
import { getTranslation } from "@/lib/translations";
import { Phone } from "lucide-react";

interface MobileTravelRowProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string) => void;
  isAlternate?: boolean;
}

export const MobileTravelRow = ({ 
  entry, 
  onStartEdit, 
  onClaimSpot,
  isAlternate = false 
}: MobileTravelRowProps) => {
  const transportIcon = getTransportIcon(entry.transport);
  const language = entry.language as "en" | "es" | "fr";
  const hasContact = !!entry.contact && entry.contact.trim() !== '';
  const bgColor = isAlternate ? "bg-[#F5F5F5]" : "bg-white";

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

  return (
    <div className={`md:hidden p-5 border-b mb-3 ${bgColor} rounded-xl shadow-sm`} id={`entry-${entry.id}`}>
      <div className="bg-gray-200 inline-block px-4 py-1 rounded-full mb-4">
        <h3 className="text-gray-600 text-sm">Travel together with {entry.name}</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">{transportIcon}</span>
          <div className="flex-1 text-left">
            <div className="font-medium text-[#222222] text-base mb-2 px-3 py-2 rounded-lg">
              {getMobileRoute()}
            </div>
            <button 
              className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer text-left ml-2"
              onClick={() => onStartEdit(entry)}
            >
              {getEditButtonText()}
            </button>
          </div>
        </div>
      </div>
      
      {hasContact && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Phone size={14} className="mr-2" />
          <span>Contact: {entry.contact}</span>
        </div>
      )}

      <div className="mb-6">
        <ClaimForm entry={entry} onClaim={onClaimSpot} />
      </div>

      <div className="text-sm text-gray-600 mt-5 opacity-85">
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 ? (
          <div>
            {entry.name}, {entry.claimed_by.join(", ")} + {entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}
          </div>
        ) : (
          <div>
            {entry.name} + {entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}
          </div>
        )}
      </div>
    </div>
  );
};
