
import { Button } from "@/components/ui/button";
import { EditForm } from "../EditForm";
import { TravelEntry } from "../types";

interface MobileEditSectionProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export const MobileEditSection = ({ 
  entry, 
  editForm, 
  setEditForm,
  onSaveEdit,
  onCancelEdit 
}: MobileEditSectionProps) => {
  return (
    <div className="mb-6">
      <div className="flex-1">
        <EditForm 
          entry={entry} 
          editForm={editForm} 
          setEditForm={setEditForm} 
          field="route" 
          onSave={onSaveEdit}
        />
        <div className="flex justify-between mt-3">
          <Button variant="outline" onClick={onCancelEdit} className="mr-2">
            Cancel
          </Button>
          <Button onClick={onSaveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
