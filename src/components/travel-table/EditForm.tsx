
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import type { TravelEntry } from "./types";
import { Textarea } from "@/components/ui/textarea";

interface EditFormProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  field: keyof TravelEntry;  // This type already includes all possible fields from TravelEntry
}

export const EditForm = ({ entry, editForm, setEditForm, field }: EditFormProps) => {
  const renderCheckIcon = () => (
    <div className="absolute bottom-1 right-1">
      <Check className="h-3 w-3 text-gray-400" />
    </div>
  );

  if (field === "taxi_sharing") {
    return (
      <div className="relative">
        <select
          value={editForm[field]?.toString()}
          onChange={(e) =>
            setEditForm({ ...editForm, [field]: e.target.value === "true" })
          }
          className="w-full p-2 border rounded bg-white"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {renderCheckIcon()}
      </div>
    );
  }

  if (field === "language") {
    return (
      <div className="relative">
        <select
          value={editForm[field] || "en"}
          onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value as 'en' | 'es' })}
          className="w-full p-2 border rounded bg-white"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
        {renderCheckIcon()}
      </div>
    );
  }

  if (field === "available_spots") {
    return (
      <div className="relative">
        <Input
          type="number"
          value={editForm[field] || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, [field]: parseInt(e.target.value) })
          }
          className="w-20 bg-white"
        />
        {renderCheckIcon()}
      </div>
    );
  }

  if (field === "dietary_restrictions" || field === "route") {
    return (
      <div className="relative">
        <Textarea
          value={editForm[field]?.toString() || ""}
          onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
          className={`${field === "route" ? "w-full min-w-[400px]" : "w-full"} bg-white rounded-lg`}
        />
        {renderCheckIcon()}
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        value={editForm[field]?.toString() || ""}
        onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
        className="w-full bg-white rounded-lg"
      />
      {renderCheckIcon()}
    </div>
  );
};
