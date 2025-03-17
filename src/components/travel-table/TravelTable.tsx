
import { TravelTableRow } from "./TravelTableRow";
import { TableContainer } from "./components/TableContainer";
import { MobileContainer } from "./components/MobileContainer";
import { TableFooter } from "./components/TableFooter";
import { useEditForm } from "./hooks/useEditForm";
import type { TravelTableProps } from "./types";

export const TravelTable = ({ entries, onClaimSpot }: TravelTableProps) => {
  const {
    editingEntry,
    editForm,
    setEditForm,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit
  } = useEditForm();
  
  return (
    <div className="relative mt-12">
      <MobileContainer>
        {entries.map((entry, index) => (
          <TravelTableRow
            key={entry.id}
            entry={entry}
            editingEntry={editingEntry}
            editForm={editForm}
            setEditForm={setEditForm}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onStartEdit={handleStartEdit}
            onClaimSpot={onClaimSpot}
            isAlternate={index % 2 !== 0}
          />
        ))}
      </MobileContainer>

      <TableContainer>
        {entries.map((entry, index) => (
          <TravelTableRow 
            key={entry.id} 
            entry={entry} 
            editingEntry={editingEntry} 
            editForm={editForm} 
            setEditForm={setEditForm} 
            onSaveEdit={handleSaveEdit} 
            onCancelEdit={handleCancelEdit} 
            onStartEdit={handleStartEdit} 
            onClaimSpot={onClaimSpot} 
            isAlternate={index % 2 !== 0}
          />
        ))}
      </TableContainer>

      <TableFooter />
    </div>
  );
};
