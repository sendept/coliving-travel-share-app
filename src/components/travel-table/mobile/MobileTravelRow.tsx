
import { Button } from "@/components/ui/button";
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { getTransportIcon } from "../utils/transportIconUtils";
import { getTranslation } from "@/lib/translations";

interface MobileTravelRowProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string) => void;
}

export const MobileTravelRow = ({ entry, onStartEdit, onClaimSpot }: MobileTravelRowProps) => {
  const transportIcon = getTransportIcon(entry.transport);
  const language = entry.language as "en" | "es" | "fr";

  const getMobileRouteWithContact = () => {
    let routeText = entry.route;
    
    if (entry.contact) {
      routeText += `\n\nContact: ${entry.contact}`;
    }
    
    return routeText;
  };

  const getEditButtonText = () => {
    if (language === "es") {
      return `${entry.name} puede editar errores aquí`;
    } else {
      return `${entry.name} can edit errors here`;
    }
  };

  return (
    <div className="md:hidden p-5 border-b mb-3 bg-white rounded-xl shadow-sm" id={`entry-${entry.id}`}>
      <div className="bg-gray-200 inline-block px-4 py-1 rounded-full mb-4">
        <h3 className="text-gray-600 text-sm">Travel together with {entry.name}</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">{transportIcon}</span>
          <div className="flex-1 text-left">
            <div className="font-medium text-[#222222] text-base mb-2 px-3 py-2 rounded-lg">
              {getMobileRouteWithContact()}
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

      <div className="mb-6">
        <ClaimForm entry={entry} onClaim={onClaimSpot} />
      </div>

      <div className="text-sm text-gray-600 mt-5 opacity-85">
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 ? (
          <div>
            {entry.name}, {entry.claimed_by.join(", ")} + Queda {entry.available_spots} {entry.available_spots !== 1 ? 'plazas' : 'plaza'}
          </div>
        ) : (
          <div>
            {entry.name} + Queda {entry.available_spots} {entry.available_spots !== 1 ? 'plazas' : 'plaza'}
          </div>
        )}
      </div>
    </div>
  );
};
