
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
      const claimedByContent = Array.isArray(entry[field]) && entry[field].length > 0
        ? entry[field].join(", ")
        : "-";
      
      return (
        <div>
          <div className="whitespace-pre-line mb-2">{claimedByContent}</div>
          {entry.available_spots > 0 && (
            <ClaimForm entry={entry} onClaim={onClaimSpot} />
          )}
        </div>
      );
    }

    if (field === "taxi_sharing") {
      return entry[field] ? "Yes" : "No";
    }

    if (field === "language") {
      return entry[field];
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
    </TableRow>
  );
};
