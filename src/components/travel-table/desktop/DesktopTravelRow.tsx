
import { TableCell, TableRow } from "@/components/ui/table";
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
    <TableRow className={`hidden md:table-row ${className} hover:bg-transparent`}>
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
      <TableCell className="whitespace-pre-line">
        {isEditing ? renderEditForm("dietary_restrictions") : (entry.dietary_restrictions || "-")}
      </TableCell>
    </TableRow>
  );
};
