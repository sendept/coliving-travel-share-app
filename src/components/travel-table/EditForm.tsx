
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent } from "react";
import type { TravelEntry } from "./types";

interface EditFormProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  field: keyof TravelEntry;
  onSave?: () => void;
}

export const EditForm = ({ entry, editForm, setEditForm, field, onSave }: EditFormProps) => {
  const handleChange = (value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSave) {
      e.preventDefault();
      onSave();
    }
  };

  if (field === 'claimed_by') {
    // Special handling for editing claimed users
    const claimedBy = Array.isArray(editForm.claimed_by) ? editForm.claimed_by : entry.claimed_by || [];
    const claimedByValue = claimedBy.join('\n');

    return (
      <div className="space-y-2">
        <div className="mb-2">
          <label htmlFor="name-input" className="text-xs">Driver/Organizer Name:</label>
          <Input
            id="name-input"
            value={editForm.name !== undefined ? editForm.name : entry.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            onKeyDown={handleKeyDown}
            className="mt-1"
          />
        </div>
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
          className="min-h-[80px]"
          placeholder="Enter claimed users (one per line)"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="available-spots" className="text-xs whitespace-nowrap">
            Available Spots:
          </label>
          <Input
            id="available-spots"
            type="number"
            value={editForm.available_spots !== undefined ? editForm.available_spots : entry.available_spots}
            onChange={(e) => setEditForm({ ...editForm, available_spots: parseInt(e.target.value) || 0 })}
            onKeyDown={handleKeyDown}
            className="w-16 h-6 py-1 px-2 text-xs"
            min="0"
          />
        </div>
      </div>
    );
  }

  if (field === 'route' || field === 'dietary_restrictions') {
    return (
      <Textarea
        value={editForm[field] !== undefined ? String(editForm[field] || '') : String(entry[field] || '')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[80px]"
      />
    );
  }

  if (field === 'date_time') {
    return (
      <Input
        value={editForm.date_time !== undefined ? String(editForm.date_time || '') : String(entry.date_time || '')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 1.9 around 11:00 am"
        className="w-full"
      />
    );
  }

  return (
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
      type={field === 'available_spots' ? 'number' : 'text'}
      min={field === 'available_spots' ? 0 : undefined}
    />
  );
};
