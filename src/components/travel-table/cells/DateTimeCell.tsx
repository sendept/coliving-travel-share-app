
import type { TravelEntry } from "../types";
import { extractDateTimeInfo } from "../utils/dateTimeUtils";

interface DateTimeCellProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  isEditing: boolean;
}

export const DateTimeCell = ({ entry, onStartEdit, isEditing }: DateTimeCellProps) => {
  if (isEditing) return null;
  
  const getFormattedDateTime = () => {
    let dateTimeValue = entry.date_time || extractDateTimeInfo(entry.route) || "-";
    
    // If there's a date but no year, add current year
    if (dateTimeValue !== "-") {
      // Check if date_time contains a year pattern
      const hasYear = /\b20\d{2}\b/.test(dateTimeValue);
      if (!hasYear) {
        const currentYear = new Date().getFullYear();
        // Try to find a date pattern and append year if found
        const datePattern = /\b\d{1,2}[\/\.\-]\d{1,2}\b/;
        if (datePattern.test(dateTimeValue)) {
          dateTimeValue = dateTimeValue.replace(datePattern, (match) => `${match}.${currentYear}`);
        } else {
          // If no clear pattern to replace, just append the year
          dateTimeValue = `${dateTimeValue} ${currentYear}`;
        }
      }
    }
    
    return dateTimeValue;
  };
  
  return (
    <div>
      <div className="mb-0">{getFormattedDateTime()}</div>
      <div 
        className="text-[9px] text-gray-500 mt-0 hover:text-blue-500 cursor-pointer"
        onClick={() => onStartEdit(entry)}
      >
        Click to edit
      </div>
    </div>
  );
};
