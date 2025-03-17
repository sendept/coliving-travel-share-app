
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { RouteCell } from "../cells/RouteCell";
import { ClaimedByCell } from "../cells/ClaimedByCell";
import { DateTimeCell } from "../cells/DateTimeCell";
import type { TravelEntry } from "../types";

interface DesktopTravelRowProps {
  entry: TravelEntry;
  editingEntry: string | null;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string) => void;
  className?: string;
  renderEditForm: (field: keyof TravelEntry) => React.ReactNode;
}

export const DesktopTravelRow = ({
  entry,
  editingEntry,
  editForm,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onClaimSpot,
  className = "",
  renderEditForm
}: DesktopTravelRowProps) => {
  const isEditing = editingEntry === entry.id;
  
  return (
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
      <TableCell className="whitespace-pre-line py-4">
        {isEditing ? renderEditForm("route") : (
          <RouteCell 
            entry={entry} 
            onStartEdit={onStartEdit} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? renderEditForm("claimed_by") : (
          <ClaimedByCell 
            entry={entry} 
            onClaimSpot={onClaimSpot} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? renderEditForm("date_time") : (
          <DateTimeCell 
            entry={entry} 
            onStartEdit={onStartEdit} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? renderEditForm("contact") : (entry.contact || "-")}
      </TableCell>
      <TableCell className="whitespace-pre-line">
        {isEditing ? renderEditForm("dietary_restrictions") : (entry.dietary_restrictions || "-")}
      </TableCell>
    </TableRow>
  );
};
