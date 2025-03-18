
import { TravelEntry } from "../types";

interface MobileHeaderSectionProps {
  entry: TravelEntry;
}

export const MobileHeaderSection = ({ entry }: MobileHeaderSectionProps) => {
  // Get date time for display beneath the title
  const getDateTime = () => {
    if (entry.date_time) {
      // If date doesn't include year, add current year
      let dateTime = entry.date_time;
      
      // Check if date_time contains a year pattern
      const hasYear = /\b20\d{2}\b/.test(dateTime);
      if (!hasYear) {
        const currentYear = new Date().getFullYear();
        // Try to find a date pattern and append year if found
        const datePattern = /\b\d{1,2}[\/\.\-]\d{1,2}\b/;
        if (datePattern.test(dateTime)) {
          dateTime = dateTime.replace(datePattern, (match) => `${match}.${currentYear}`);
        } else {
          // If no clear pattern to replace, just append the year
          dateTime = `${dateTime} ${currentYear}`;
        }
      }
      
      return dateTime;
    }
    return null;
  };

  return (
    <>
      <div className="bg-gray-200 inline-block px-4 py-1 rounded-full mb-2 mx-auto w-auto text-center" style={{display: "table", margin: "0 auto 0.5rem"}}>
        <h3 className="text-gray-600 text-sm">Travel together with {entry.name}</h3>
      </div>
      
      {getDateTime() && (
        <div className="text-center mb-3">
          <span className="text-gray-600 text-sm">{getDateTime()}</span>
        </div>
      )}
    </>
  );
};
