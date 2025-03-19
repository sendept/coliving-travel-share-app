
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
  rowNumber: number; // Add row number prop
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
  rowNumber // Add row number to props
}: MobileTravelRowProps) => {
  const bgColor = isAlternate ? "bg-[#F5F5F5]" : "bg-white";
  const isEditing = editingEntry === entry.id;

  return (
    <div className={`md:hidden p-5 border-b mb-3 ${bgColor} rounded-none shadow-sm`} id={`entry-${entry.id}`}>
      {/* Row number badge */}
      <div className="absolute top-2 left-2 bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-gray-600 font-medium text-sm">
        {rowNumber}
      </div>
      
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
