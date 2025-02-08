
import { Input } from "@/components/ui/input";
import type { TravelEntry } from "./types";

interface EditFormProps {
  entry: TravelEntry;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  field: keyof TravelEntry;
}

export const EditForm = ({ entry, editForm, setEditForm, field }: EditFormProps) => {
  if (field === "taxi_sharing") {
    return (
      <select
        value={editForm[field]?.toString()}
        onChange={(e) =>
          setEditForm({ ...editForm, [field]: e.target.value === "true" })
        }
        className="w-full p-2 border rounded"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  }

  if (field === "language") {
    return (
      <select
        value={editForm[field] || "en"}
        onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="zh">Chinese</option>
      </select>
    );
  }

  if (field === "available_spots") {
    return (
      <Input
        type="number"
        value={editForm[field] || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, [field]: parseInt(e.target.value) })
        }
        className="w-20"
      />
    );
  }

  return (
    <Input
      value={editForm[field]?.toString() || ""}
      onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
      className={field === "route" ? "w-full min-w-[400px]" : "w-full"}
    />
  );
};
