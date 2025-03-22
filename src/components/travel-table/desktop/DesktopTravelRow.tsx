
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
  rowNumber?: number; // Made optional
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
  renderEditForm,
  rowNumber // Keep for compatibility but don't display it
}: DesktopTravelRowProps) => {
  const isEditing = editingEntry === entry.id;
  
  return (
    <TableRow className={`hidden md:table-row ${className}`}>
      <TableCell className="whitespace-pre-line py-4 w-1/2">
        {isEditing ? renderEditForm("route") : (
          <RouteCell 
            entry={entry} 
            onStartEdit={onStartEdit} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
      <TableCell className="w-1/4">
        {isEditing ? renderEditForm("claimed_by") : (
          <ClaimedByCell 
            entry={entry} 
            onClaimSpot={onClaimSpot} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
      <TableCell className="w-1/4">
        {isEditing ? renderEditForm("date_time") : (
          <DateTimeCell 
            entry={entry} 
            onStartEdit={onStartEdit} 
            isEditing={isEditing} 
          />
        )}
      </TableCell>
    </TableRow>
  );
};
