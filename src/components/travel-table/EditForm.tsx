
import { KeyboardEvent, useState } from "react";
import type { TravelEntry } from "./types";
import { TextAreaField } from "./edit-fields/TextAreaField";
import { InputField } from "./edit-fields/InputField";
import { ClaimedByField } from "./edit-fields/ClaimedByField";
import { RouteField } from "./edit-fields/RouteField";

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

  // Common styling classes
  const inputClasses = `table-input bg-white border border-gray-300 px-3 py-2 rounded-md pr-8 focus:outline-none focus:border-blue-500`;
  const textareaClasses = `table-textarea min-h-[80px] bg-white border border-gray-300 px-3 py-2 rounded-md pr-8 focus:outline-none focus:border-blue-500`;

  // Handles focus state
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Value for the field
  const fieldValue = editForm[field] !== undefined ? String(editForm[field] || '') : String(entry[field] || '');

  // Special handling for claimed_by field
  if (field === 'claimed_by') {
    return (
      <ClaimedByField
        entry={entry}
        editForm={editForm}
        setEditForm={setEditForm}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onConfirm={confirmEdit}
      />
    );
  }

  // Special handling for route field
  if (field === 'route') {
    return (
      <RouteField
        value={fieldValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onConfirm={confirmEdit}
      />
    );
  }

  // Handling for dietary_restrictions field
  if (field === 'dietary_restrictions') {
    return (
      <TextAreaField
        value={fieldValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${textareaClasses} claim-form`}
        onConfirm={confirmEdit}
      />
    );
  }

  // Handling for date_time field
  if (field === 'date_time') {
    return (
      <InputField
        value={fieldValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full ${inputClasses} claim-form input`}
        placeholder="e.g., 1.9 around 11:00 am"
        onConfirm={confirmEdit}
      />
    );
  }

  // Default handling for other fields
  return (
    <InputField
      value={fieldValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${inputClasses} claim-form input`}
      type={field === 'available_spots' ? 'number' : 'text'}
      min={field === 'available_spots' ? 0 : undefined}
      onConfirm={confirmEdit}
    />
  );
};
