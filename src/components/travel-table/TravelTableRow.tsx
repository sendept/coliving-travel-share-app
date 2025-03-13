
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
  className = ""
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

  return (
    <>
      <MobileTravelRow 
        entry={entry} 
        onStartEdit={onStartEdit} 
        onClaimSpot={onClaimSpot} 
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
        className={className}
        renderEditForm={renderCell}
      />
    </>
  );
};
