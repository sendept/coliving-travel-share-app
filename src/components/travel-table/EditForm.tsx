
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import type { TravelEntry } from "./types";

interface EditFormProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  field: keyof TravelEntry;
  onSave?: () => void;
}

export const EditForm = ({ entry, editForm, setEditForm, field, onSave }: EditFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSave) {
      e.preventDefault();
      onSave();
    }
  };
  
  const confirmEdit = () => {
    if (onSave) onSave();
  };

  const inputClasses = "bg-white border border-gray-300 px-3 py-2 rounded-md pr-8";
  const textareaClasses = "min-h-[80px] bg-white border border-gray-300 px-3 py-2 rounded-md pr-8";

  if (field === 'claimed_by') {
    // Special handling for editing claimed users
    const claimedBy = Array.isArray(editForm.claimed_by) ? editForm.claimed_by : entry.claimed_by || [];
    const claimedByValue = claimedBy.join('\n');

    return (
      <div className="space-y-2 relative">
        <div className="mb-2">
          <label htmlFor="name-input" className="text-xs">Driver/Organizer Name:</label>
          <div className="relative">
            <Input
              id="name-input"
              value={editForm.name !== undefined ? editForm.name : entry.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`mt-1 ${inputClasses}`}
            />
            {isFocused && (
              <Check 
                size={16} 
                className="absolute right-2 bottom-2 text-green-600 cursor-pointer" 
                onClick={confirmEdit}
              />
            )}
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
              handleChange(newClaimedBy);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={textareaClasses}
            placeholder="Enter claimed users (one per line)"
          />
          {isFocused && (
            <Check 
              size={16} 
              className="absolute right-2 bottom-2 text-green-600 cursor-pointer" 
              onClick={confirmEdit}
            />
          )}
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
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-16 h-6 py-1 px-2 text-xs border border-gray-300 rounded-md pr-6"
              min="0"
            />
            {isFocused && (
              <Check 
                size={12} 
                className="absolute right-1 bottom-[3px] text-green-600 cursor-pointer" 
                onClick={confirmEdit}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (field === 'route' || field === 'dietary_restrictions') {
    return (
      <div className="relative">
        <Textarea
          value={editForm[field] !== undefined ? String(editForm[field] || '') : String(entry[field] || '')}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={textareaClasses}
        />
        {isFocused && (
          <Check 
            size={16} 
            className="absolute right-2 bottom-2 text-green-600 cursor-pointer" 
            onClick={confirmEdit}
          />
        )}
      </div>
    );
  }

  if (field === 'date_time') {
    return (
      <div className="relative">
        <Input
          value={editForm.date_time !== undefined ? String(editForm.date_time || '') : String(entry.date_time || '')}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g., 1.9 around 11:00 am"
          className={`w-full ${inputClasses}`}
        />
        {isFocused && (
          <Check 
            size={16} 
            className="absolute right-2 bottom-2 text-green-600 cursor-pointer" 
            onClick={confirmEdit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        value={editForm[field] !== undefined ? String(editForm[field] || '') : String(entry[field] || '')}
        onChange={(e) => {
          let value: any = e.target.value;
          if (field === 'available_spots') {
            value = parseInt(value) || 0;
          }
          handleChange(value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type={field === 'available_spots' ? 'number' : 'text'}
        min={field === 'available_spots' ? 0 : undefined}
        className={inputClasses}
      />
      {isFocused && (
        <Check 
          size={16} 
          className="absolute right-2 bottom-2 text-green-600 cursor-pointer" 
          onClick={confirmEdit}
        />
      )}
    </div>
  );
};
