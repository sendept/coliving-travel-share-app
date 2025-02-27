
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
  const iconProps = {
    className: "inline-block mr-2",
    size: 18
  };
  const taxiIconProps = {
    className: "inline-block mr-2 text-yellow-500",
    size: 18,
    strokeWidth: 2
  };
  const transport_lower = transport.toLowerCase();
  if (transport_lower.includes('taxi')) return <CarTaxiFront {...taxiIconProps} />;
  if (transport_lower.includes('plane')) return <Plane {...iconProps} />;
  if (transport_lower.includes('car')) return <Car {...iconProps} />;
  if (transport_lower.includes('bike') || transport_lower.includes('bicycle')) return <Bike {...iconProps} />;
  if (transport_lower.includes('train')) return <Train {...iconProps} />;
  if (transport_lower.includes('bus') || transport_lower.includes('van')) return <Bus {...iconProps} />;
  return null;
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
          <div className="whitespace-pre-line mb-2">{claimedByContent}</div>
          {entry.available_spots > 0 && <ClaimForm entry={entry} onClaim={onClaimSpot} />}
        </div>;
    }
    if (field === "transport") {
      return <div className="flex items-center">
          {getTransportIcon(entry[field])}
          <span className="text-center mx-[40px]">{entry[field]}</span>
        </div>;
    }
    if (field === "route") {
      return <div className="whitespace-pre-line">{entry[field]}</div>;
    }
    if (field === "date_time") {
      // Format the date if it exists, otherwise return "-"
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
      <TableCell className="border-r">{renderCell("available_spots")}</TableCell>
      <TableCell className="whitespace-pre-line py-4 border-r">
        {renderCell("route")}
      </TableCell>
      <TableCell className="border-r">{renderCell("date_time")}</TableCell>
      <TableCell className="mx-[90px] border-r">{renderCell("transport")}</TableCell>
      <TableCell className="border-r">{renderCell("contact")}</TableCell>
      <TableCell className="whitespace-pre-line border-r">
        {renderCell("dietary_restrictions")}
      </TableCell>
      <TableCell className="font-medium border-r">
        {renderCell("name")}
      </TableCell>
    </TableRow>;
};
