
import { TravelEntry } from "../types";
import { getTransportIcon } from "../utils/transportIconUtils";

interface MobileRouteDisplayProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
}

export const MobileRouteDisplay = ({ entry, onStartEdit }: MobileRouteDisplayProps) => {
  const transportIcon = getTransportIcon(entry.transport);
  
  const getEditButtonText = () => {
    if (entry.language === "es") {
      return `${entry.name} puede editar aquí`;
    } else {
      return `${entry.name} can edit here`;
    }
  };

  return (
    <div className="flex items-start justify-center flex-col">
      <div className="flex-1 text-center w-full">
        <div className="font-medium text-[#222222] text-base mb-2 px-3 py-2 rounded-lg text-center border-0">
          <span className="inline-block mr-2 align-middle">{transportIcon}</span>
          <span className="align-middle">{entry.route}</span>
        </div>
        <button 
          className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer mx-auto block"
          onClick={() => onStartEdit(entry)}
        >
          {getEditButtonText()}
        </button>
      </div>
    </div>
  );
};
