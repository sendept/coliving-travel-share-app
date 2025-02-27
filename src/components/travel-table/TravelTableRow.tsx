
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClaimForm } from "./ClaimForm";
import { EditForm } from "./EditForm";
import { Plane, Car, Bike, Train, Bus, Edit2, Check, X, CarTaxiFront } from "lucide-react";
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
  if (transport_lower.includes('car')) return "🚗";
  return "🚗"; // Default to car if no match
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

  const renderCell = (field: keyof TravelEntry) => {
    if (isEditing) {
      return <EditForm entry={entry} editForm={editForm} setEditForm={setEditForm} field={field} />;
    }
    if (field === "claimed_by") {
      const claimedByContent = Array.isArray(entry[field]) && entry[field].length > 0 ? entry[field].join(", ") : "-";
      return <div>
          <div className="mb-2">
            <span className="font-medium text-black">{entry.name}</span>
            {claimedByContent !== "-" && (
              <div className="text-gray-600">+ {claimedByContent}</div>
            )}
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-500">{entry.available_spots} {entry.available_spots === 1 ? 'Plaza' : 'Plazas'}</span>
            <br/>
            <span className="text-xs text-gray-500">{entry.available_spots} spots available</span>
          </div>
          {entry.available_spots > 0 && <div>
            <ClaimForm entry={entry} onClaim={onClaimSpot} />
            <div className="text-[9px] text-gray-500 mt-1">unete/join as co-traveller</div>
          </div>}
        </div>;
    }
    if (field === "route") {
      return <div className="whitespace-pre-line">
        <span className="mr-2">{getTransportIcon(entry.transport)}</span>
        {entry[field]}
        <div className="text-[9px] text-gray-500 mt-1">ruta completa/complete journey</div>
      </div>;
    }
    if (field === "date_time") {
      return entry[field] ? new Date(entry[field]).toLocaleString() : "-";
    }
    return entry[field];
  };

  return <TableRow className={className}>
      <TableCell className="w-[80px]">
        {isEditing ? <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onSaveEdit} className="h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div> : <Button variant="ghost" size="icon" onClick={() => onStartEdit(entry)} className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>}
      </TableCell>
      <TableCell className="border-r">
        {renderCell("claimed_by")}
      </TableCell>
      <TableCell className="whitespace-pre-line py-4 border-r">
        {renderCell("route")}
      </TableCell>
      <TableCell className="border-r">{renderCell("date_time")}</TableCell>
      <TableCell className="border-r">{renderCell("contact")}</TableCell>
      <TableCell className="whitespace-pre-line border-r">
        {renderCell("dietary_restrictions")}
      </TableCell>
    </TableRow>;
};
