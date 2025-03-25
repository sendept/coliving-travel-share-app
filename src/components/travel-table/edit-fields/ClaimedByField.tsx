
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent } from "react";
import { TravelEntry } from "../types";

interface ClaimedByFieldProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onConfirm: () => void;
}

export const ClaimedByField = ({
  entry,
  editForm,
  setEditForm,
  onKeyDown,
  onFocus,
  onBlur,
  onConfirm
}: ClaimedByFieldProps) => {
  const claimedBy = Array.isArray(editForm.claimed_by) ? editForm.claimed_by : entry.claimed_by || [];
  const claimedByValue = claimedBy.join('\n');

  const inputClasses = `table-input bg-white border border-gray-300 px-3 py-2 rounded-md pr-8 focus:outline-none focus:border-blue-500`;
  const textareaClasses = `table-textarea min-h-[80px] bg-white border border-gray-300 px-3 py-2 rounded-md pr-8 focus:outline-none focus:border-blue-500`;
  
  return (
    <div className="space-y-2 relative">
      <div className="mb-2">
        <label htmlFor="name-input" className="text-xs">Driver/Organizer Name:</label>
        <div className="relative">
          <Input
            id="name-input"
            value={editForm.name !== undefined ? editForm.name : entry.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`mt-1 ${inputClasses} claim-form input`}
            style={{ fontSize: '16px' }}
          />
          <Check 
            size={16} 
            className="absolute right-2 bottom-2 text-green-600 cursor-pointer check-icon" 
            onClick={onConfirm}
          />
        </div>
      </div>
      <div className="relative">
        <Textarea
          value={claimedByValue}
          onChange={(e) => {
            const newClaimedBy = e.target.value
              .split('\n')
              .map(line => line.trim())
              .filter(line => line !== '');
            setEditForm({ ...editForm, claimed_by: newClaimedBy });
          }}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${textareaClasses} claim-form`}
          placeholder="Enter claimed users (one per line)"
          style={{ fontSize: '16px' }}
        />
        <Check 
          size={16} 
          className="absolute right-2 bottom-2 text-green-600 cursor-pointer check-icon" 
          onClick={onConfirm}
        />
      </div>
      <div className="flex items-center gap-2 relative">
        <label htmlFor="available-spots" className="text-xs whitespace-nowrap">
          Available Spots:
        </label>
        <div className="relative">
          <Input
            id="available-spots"
            type="number"
            value={editForm.available_spots !== undefined ? editForm.available_spots : entry.available_spots}
            onChange={(e) => setEditForm({ ...editForm, available_spots: parseInt(e.target.value) || 0 })}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`w-16 h-6 py-1 px-2 text-xs table-input border border-gray-300 rounded-md pr-6 focus:outline-none focus:border-blue-500 claim-form input`}
            min="0"
            style={{ fontSize: '16px' }}
          />
          <Check 
            size={12} 
            className="absolute right-1 bottom-[3px] text-green-600 cursor-pointer check-icon" 
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};
