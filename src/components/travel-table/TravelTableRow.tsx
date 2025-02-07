
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { ClaimForm } from "./ClaimForm";
import { EditForm } from "./EditForm";
import type { TravelEntry } from "./types";

interface TravelTableRowProps {
  entry: TravelEntry;
  editingEntry: string | null;
  editForm: Partial<TravelEntry>;
  setEditForm: (form: Partial<TravelEntry>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (entry: TravelEntry) => void;
  onClaimSpot: (id: string, name: string) => void;
}

export const TravelTableRow = ({
  entry,
  editingEntry,
  editForm,
  setEditForm,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onClaimSpot,
}: TravelTableRowProps) => {
  const renderCell = (field: keyof TravelEntry) => {
    if (editingEntry === entry.id) {
      return (
        <EditForm
          entry={entry}
          editForm={editForm}
          setEditForm={setEditForm}
          field={field}
        />
      );
    }

    if (field === "claimed_by") {
      return Array.isArray(entry[field]) && entry[field].length > 0
        ? entry[field].join("\n")
        : "-";
    }

    if (field === "taxi_sharing") {
      return entry[field] ? "Yes" : "No";
    }

    return entry[field];
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {renderCell("name")}
      </TableCell>
      <TableCell>{renderCell("available_spots")}</TableCell>
      <TableCell className="whitespace-pre-wrap break-words max-w-[400px] py-4">
        {renderCell("route")}
      </TableCell>
      <TableCell>{renderCell("transport")}</TableCell>
      <TableCell>{renderCell("taxi_sharing")}</TableCell>
      <TableCell>{renderCell("contact")}</TableCell>
      <TableCell className="whitespace-pre-line">
        {renderCell("claimed_by")}
      </TableCell>
      <TableCell>
        {editingEntry === entry.id ? (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onSaveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStartEdit(entry)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {entry.available_spots > 0 && (
              <ClaimForm entry={entry} onClaim={onClaimSpot} />
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
