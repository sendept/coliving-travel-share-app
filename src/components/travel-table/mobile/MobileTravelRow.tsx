
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
    <div className={`md:hidden p-5 border-b mb-3 ${bgColor} rounded-none shadow-sm`} id={`entry-${entry.id}`}>
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

      <div className="text-sm mt-5 opacity-85">
        {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 ? (
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">{entry.name}, </span>
              <div className="flex flex-col space-y-1 mt-2">
                {entry.claimed_by.map((name, index) => {
                  const [bgColor, textColor] = coTravelerColorPairs[index % coTravelerColorPairs.length];
                  return (
                    <span 
                      key={index}
                      className="text-sm font-normal px-2 py-1 rounded"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        display: "inline-block"
                      }}
                    >
                      {name}
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
            {entry.name} + {entry.available_spots > 0 && (
              <>{entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
