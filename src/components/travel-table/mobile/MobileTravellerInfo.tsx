import { TravelEntry } from "../types";

const coTravelerColorPairs = [
  ["#F2FCE2", "#3D7B15"], // Soft Green / Dark Green
  ["#E5DEFF", "#5E41D0"], // Soft Purple / Deep Purple
  ["#FFDEE2", "#BD3A4C"], // Soft Pink / Deep Pink
  ["#D3E4FD", "#2C65B1"], // Soft Blue / Deep Blue
  ["#FDE1D3", "#B95F2E"]  // Soft Peach / Deep Orange
];

export const MobileTravellerInfo = ({ entry }: { entry: TravelEntry }) => {
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
    <div className="text-sm mt-5 opacity-85">
      {Array.isArray(entry.claimed_by) && entry.claimed_by.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-col space-y-1 mt-2">
            {entry.claimed_by.map((person, index) => {
              const [bgColor, textColor] = coTravelerColorPairs[index % coTravelerColorPairs.length];
              const phoneNumber = extractPhoneNumber(person);
              const name = extractName(person);
              return (
                <span 
                  key={index}
                  className="text-sm font-normal px-2 py-1 rounded flex justify-between items-center max-w-[250px]"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                >
                  <span>{name}</span>
                  {phoneNumber && (
                    <span 
                      className="text-xs ml-[12px]"
                    >
                      {phoneNumber}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <div className="text-gray-600 text-xs mt-1">
            {entry.available_spots > 0 && (
              <>
                <div>
                  {entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}
                </div>
                <div>{entry.available_spots} spots left</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-600">
          <span>{entry.name}</span>
          {entry.available_spots > 0 && (
            <div className="text-xs mt-1">
              <div>
                {entry.available_spots <= 1 ? "Queda" : "Quedan"} {entry.available_spots} {entry.available_spots === 1 ? 'plaza' : 'plazas'}
              </div>
              <div>{entry.available_spots} spots left</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
