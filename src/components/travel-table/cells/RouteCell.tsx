
import { Button } from "@/components/ui/button";
import type { TravelEntry } from "../types";
import { getTransportIcon } from "../utils/transportIconUtils";

interface RouteCellProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  isEditing: boolean;
}

export const RouteCell = ({ entry, onStartEdit, isEditing }: RouteCellProps) => {
  const transportIcon = getTransportIcon(entry.transport);

  if (isEditing) return null;

  return (
    <div className="whitespace-pre-line">
      <span className="inline-block mr-2 align-middle">{transportIcon}</span>
      <span className="align-middle">{entry.route}</span>
      <div 
        className="text-[9px] text-gray-500 mt-1 hover:text-blue-500 cursor-pointer text-center w-full"
        onClick={() => onStartEdit(entry)}
      >
        {entry.name} can edit here
      </div>
    </div>
  );
};
