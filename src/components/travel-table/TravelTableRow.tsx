
import { EditForm } from "./EditForm";
import { MobileTravelRow } from "./mobile/MobileTravelRow";
import { DesktopTravelRow } from "./desktop/DesktopTravelRow";
import type { TravelEntry } from "./types";

interface TravelTableRowProps {
  entry: TravelEntry;
  editingEntry: string | null;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string, contact?: string) => void;
  className?: string;
  isAlternate?: boolean;
  index: number;
}

export const TravelTableRow = ({
  entry,
  editingEntry,
  editForm,
  setEditForm,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onClaimSpot,
  className = "",
  isAlternate = false,
  index
}: TravelTableRowProps) => {
  const isEditing = editingEntry === entry.id;
  const rowNumber = index + 1; // Create row number

  const renderCell = (field: keyof TravelEntry) => {
    return (
      <EditForm 
        entry={entry} 
        editForm={editForm} 
        setEditForm={setEditForm} 
        field={field} 
        onSave={onSaveEdit} 
      />
    );
  };

  // Fixed row background - first row is always white, then alternate
  const rowClassName = index === 0 
    ? "bg-white" 
    : (index % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white");

  return (
    <>
      <MobileTravelRow 
        entry={entry} 
        onStartEdit={onStartEdit} 
        onClaimSpot={onClaimSpot} 
        isAlternate={index % 2 === 1} // Make sure mobile rows alternate properly too
        editingEntry={editingEntry}
        editForm={editForm}
        setEditForm={setEditForm}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        rowNumber={rowNumber} // Pass row number to mobile row
      />
      
      <DesktopTravelRow 
        entry={entry}
        editingEntry={editingEntry}
        editForm={editForm}
        setEditForm={setEditForm}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onStartEdit={onStartEdit}
        onClaimSpot={onClaimSpot}
        className={`${rowClassName} ${className}`}
        renderEditForm={renderCell}
        rowNumber={rowNumber} // Pass row number to desktop row
      />
    </>
  );
};
