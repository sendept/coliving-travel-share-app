import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClaimForm } from "./ClaimForm";
import { EditForm } from "./EditForm";
import { Plane, Car, CarTaxiFront, Bike, Train, Bus, Edit2, Check, X } from "lucide-react";
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
}

const getTransportIcon = (transport: string, taxiSharing: boolean) => {
  const iconProps = { className: "inline-block mr-2", size: 18 };
  const taxiIconProps = { 
    className: "inline-block mr-2 text-yellow-500", 
    size: 18,
    strokeWidth: 2.5 
  };
  
  // If taxi sharing is enabled, show taxi icon regardless of transport type
  if (taxiSharing) return <CarTaxiFront {...taxiIconProps} />;
  
  const transport_lower = transport.toLowerCase();
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
}: TravelTableRowProps) => {
  const isEditing = editingEntry === entry.id;

  const renderCell = (field: keyof TravelEntry) => {
    if (isEditing) {
      return (
        <EditForm
          entry={entry}
          editForm={editForm}
          setEditForm={setEditForm}
          field={field}
        />
      );
    }

    if (field === "claimed_by") {
      const claimedByContent = Array.isArray(entry[field]) && entry[field].length > 0
        ? entry[field].join(", ")
        : "-";
      
      return (
        <div>
          <div className="whitespace-pre-line mb-2">{claimedByContent}</div>
          {entry.available_spots > 0 && (
            <ClaimForm entry={entry} onClaim={onClaimSpot} />
          )}
        </div>
      );
    }

    if (field === "taxi_sharing") {
      return entry[field] ? "Yes" : "No";
    }

    if (field === "transport") {
      return (
        <div className="flex items-center">
          {getTransportIcon(entry[field], entry.taxi_sharing)}
          <span>{entry[field]}</span>
        </div>
      );
    }

    if (field === "route") {
      return (
        <div className="whitespace-pre-line">{entry[field]}</div>
      );
    }

    return entry[field];
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {renderCell("name")}
      </TableCell>
      <TableCell>{renderCell("available_spots")}</TableCell>
      <TableCell className="whitespace-pre-line py-4">
        {renderCell("route")}
      </TableCell>
      <TableCell>{renderCell("transport")}</TableCell>
      <TableCell>{renderCell("taxi_sharing")}</TableCell>
      <TableCell>{renderCell("contact")}</TableCell>
      <TableCell className="whitespace-pre-line">
        {renderCell("claimed_by")}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <EditForm
            entry={entry}
            editForm={editForm}
            setEditForm={setEditForm}
            field="dietary_restrictions"
          />
        ) : (
          entry.dietary_restrictions || "-"
        )}
      </TableCell>
      <TableCell className="w-[100px]">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSaveEdit}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancelEdit}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStartEdit(entry)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
