import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit2 } from "lucide-react";
interface EditableTitleProps {
  isEditing: boolean;
  title: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
}
export const EditableTitle = ({
  isEditing,
  title,
  onEdit,
  onChange,
  onSave
}: EditableTitleProps) => {
  if (isEditing) {
    return <div className="relative max-w-[700px] min-w-[350px] mx-auto">
        <Input value={title} onChange={e => onChange(e.target.value)} className="text-3xl font-semibold tracking-tight text-center pr-10" />
        <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8 absolute right-2 top-1/2 -translate-y-1/2">
          <Check className="h-4 w-4" />
        </Button>
      </div>;
  }
  return <div className="relative max-w-[700px] min-w-[350px] mx-auto">
      <h1 className="font-semibold tracking-tight pr-8 text-2xl">{title}</h1>
      <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 absolute right-0 top-1/2 -translate-y-1/2">
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>;
};