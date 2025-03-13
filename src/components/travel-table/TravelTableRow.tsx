
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClaimForm } from "./ClaimForm";
import { EditForm } from "./EditForm";
import { Edit2, Check, X } from "lucide-react";
import type { TravelEntry } from "./types";

interface TravelTableRowProps {
  entry: TravelEntry;
  editingEntry: string | null;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string) => void;
  className?: string;
}

const getTransportIcon = (transport: string) => {
  const transport_lower = transport.toLowerCase();
  if (transport_lower.includes('taxi') || transport_lower.includes('uber') || transport_lower.includes('bolt')) return "🚖";
  if (transport_lower.includes('bus') || transport_lower.includes('van')) return "🚌";
  if (transport_lower.includes('train')) return "🚂";
  if (transport_lower.includes('plane') || transport_lower.includes('fly') || transport_lower === "✈️") return "✈️";
  if (transport_lower.includes('car')) return "🚗";
  if (/^\p{Emoji}/u.test(transport)) return transport;
  return "🚗";
};

const extractDateTimeInfo = (route: string) => {
  const datePatterns = [
    /\b\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?\b/,
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*(?:\d{2,4})?\b/i,
    /\b(?:\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM)?|\d{1,2}\s*(?:am|pm|AM|PM))/,
    /\b(?:today|tomorrow|tonight|this\s+(?:morning|afternoon|evening))\b/i,
    /\b(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo),?\s+\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i,
    /\b(?:fecha|date|día|day|hora|hour|time)[:s\s]+[\w\s\d.,:\-\/]+\b/i
  ];

  for (const pattern of datePatterns) {
    const match = route.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return "";
};

export const TravelTableRow = ({
  entry,
  editingEntry,
  editForm,
  setEditForm,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onClaimSpot,
  className = ""
}: TravelTableRowProps) => {
  const isEditing = editingEntry === entry.id;
  const transportIcon = getTransportIcon(entry.transport);

  const renderCell = (field: keyof TravelEntry) => {
    if (isEditing) {
      return <EditForm 
        entry={entry} 
        editForm={editForm} 
        setEditForm={setEditForm} 
        field={field} 
        onSave={onSaveEdit} 
      />;
    }

    if (field === "claimed_by") {
      const claimedByContent = Array.isArray(entry[field]) && entry[field].length > 0 ? entry[field].join(", ") : "-";
      return (
        <div>
          <div className="mb-2">
            <span className="font-medium text-black">{entry.name}</span>
            {claimedByContent !== "-" && (
              <div className="text-gray-600 opacity-85">{claimedByContent}</div>
            )}
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-500">{entry.available_spots} spots available</span>
            <br/>
            <span className="text-xs text-gray-500">{entry.available_spots} {entry.available_spots === 1 ? 'Plaza' : 'Plazas'}</span>
          </div>
          {entry.available_spots > 0 && (
            <div>
              <ClaimForm entry={entry} onClaim={onClaimSpot} />
              <div className="text-[9px] text-gray-500 mt-1">join/unete as co-traveller</div>
            </div>
          )}
        </div>
      );
    }

    if (field === "route") {
      return (
        <div className="whitespace-pre-line">
          <span className="mr-2 text-lg">{transportIcon}</span>
          {entry[field]}
          <div 
            className="text-[9px] text-gray-500 mt-1 hover:text-blue-500 cursor-pointer"
            onClick={() => onStartEdit(entry)}
          >
            Click to edit route
          </div>
        </div>
      );
    }

    if (field === "date_time") {
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
    }

    return entry[field] || "-";
  };

  const getMobileRouteWithContact = () => {
    let routeText = entry.route;
    
    if (entry.contact) {
      routeText += `\n\nContact: ${entry.contact}`;
    }
    
    return routeText;
  };

  const renderMobileLayout = () => (
    <div className="md:hidden p-5 border-b mb-3 bg-white rounded-xl shadow-sm">
      <div className="bg-gray-200 inline-block px-4 py-1 rounded-full mb-4">
        <h3 className="text-gray-600 text-sm">Travel together with {entry.name}</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">{transportIcon}</span>
          <div className="flex-1 text-left">
            <div className="font-medium text-[#222222] text-base mb-2 px-3 py-2 bg-gray-50 rounded-lg">
              {getMobileRouteWithContact()}
            </div>
            <button 
              className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer text-left ml-2"
              onClick={() => onStartEdit(entry)}
            >
              {entry.name} can edit errors here
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
            {entry.name}, {entry.claimed_by.join(", ")} + {entry.available_spots} spot{entry.available_spots !== 1 ? 's' : ''} left / {entry.available_spots} plaza{entry.available_spots !== 1 ? 's' : ''} disponible
          </div>
        ) : (
          <div>
            {entry.name} + {entry.available_spots} spot{entry.available_spots !== 1 ? 's' : ''} left / {entry.available_spots} plaza{entry.available_spots !== 1 ? 's' : ''} disponible
          </div>
        )}
      </div>
    </div>
  );

  const renderDesktopLayout = () => (
    <TableRow className={`hidden md:table-row ${className}`}>
      <TableCell className="w-[80px]">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onSaveEdit} className="h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => onStartEdit(entry)} className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
      <TableCell className="whitespace-pre-line py-4 border-r">
        {renderCell("route")}
      </TableCell>
      <TableCell className="border-r">
        {renderCell("claimed_by")}
      </TableCell>
      <TableCell className="border-r">{renderCell("date_time")}</TableCell>
      <TableCell className="border-r">{renderCell("contact")}</TableCell>
      <TableCell className="whitespace-pre-line">
        {renderCell("dietary_restrictions")}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderMobileLayout()}
      {renderDesktopLayout()}
    </>
  );
};
