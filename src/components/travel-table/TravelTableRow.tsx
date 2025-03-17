
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
  onClaimSpot: (id: string, name: string) => void;
  className?: string;
  isAlternate?: boolean;
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
  isAlternate = false
}: TravelTableRowProps) => {
  const isEditing = editingEntry === entry.id;

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

  const rowClassName = isAlternate ? "bg-[#F5F5F5]" : "bg-white";

  return (
    <>
      <MobileTravelRow 
        entry={entry} 
        onStartEdit={onStartEdit} 
        onClaimSpot={onClaimSpot} 
        isAlternate={isAlternate}
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
      />
    </>
  );
};
