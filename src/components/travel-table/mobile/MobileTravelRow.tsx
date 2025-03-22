
import { ClaimForm } from "../ClaimForm";
import type { TravelEntry } from "../types";
import { MobileHeaderSection } from "./MobileHeaderSection";
import { MobileRouteDisplay } from "./MobileRouteDisplay";
import { MobileEditSection } from "./MobileEditSection";
import { MobileTravellerInfo } from "./MobileTravellerInfo";

interface MobileTravelRowProps {
  entry: TravelEntry;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string, contact?: string) => void;
  isAlternate?: boolean;
  editingEntry?: string | null;
  editForm?: Partial<TravelEntry>;
  setEditForm?: (form: Partial<TravelEntry>) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  rowNumber: number; // Keep for compatibility but don't display it
}

export const MobileTravelRow = ({ 
  entry, 
  onStartEdit, 
  onClaimSpot,
  isAlternate = false,
  editingEntry,
  editForm = {},
  setEditForm = () => {},
  onSaveEdit = () => {},
  onCancelEdit = () => {},
  rowNumber // Keep for compatibility
}: MobileTravelRowProps) => {
  const bgColor = isAlternate ? "bg-[#F5F5F5]" : "bg-white";
  const isEditing = editingEntry === entry.id;

  return (
    <div className={`md:hidden p-5 border-b mb-3 ${bgColor} rounded-none shadow-sm`} id={`entry-${entry.id}`}>
      <MobileHeaderSection entry={entry} />
      
      {isEditing ? (
        <MobileEditSection 
          entry={entry}
          editForm={editForm}
          setEditForm={setEditForm}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      ) : (
        <div className="mb-6">
          <MobileRouteDisplay entry={entry} onStartEdit={onStartEdit} />
        </div>
      )}

      <div className="mb-6">
        <ClaimForm entry={entry} onClaim={onClaimSpot} />
      </div>

      <MobileTravellerInfo entry={entry} />
    </div>
  );
};
