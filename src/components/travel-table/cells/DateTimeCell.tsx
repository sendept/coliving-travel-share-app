
import type { TravelEntry } from "../types";
import { extractDateTimeInfo } from "../utils/dateTimeUtils";

interface DateTimeCellProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  isEditing: boolean;
}

export const DateTimeCell = ({ entry, onStartEdit, isEditing }: DateTimeCellProps) => {
  if (isEditing) return null;
  
  const dateTimeValue = entry.date_time || extractDateTimeInfo(entry.route) || "-";
  
  return (
    <div>
      <div className="mb-0">{dateTimeValue}</div>
      <div 
        className="text-[9px] text-gray-500 mt-0 hover:text-blue-500 cursor-pointer"
        onClick={() => onStartEdit(entry)}
      >
        Click to edit
      </div>
    </div>
  );
};
