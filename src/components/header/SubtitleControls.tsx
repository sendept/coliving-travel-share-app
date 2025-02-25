
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Type, AlignCenter } from "lucide-react";

interface SubtitleControlsProps {
  onUpdateStyle: (key: "fontSize" | "position" | "preset", value: string) => void;
}

export const SubtitleControls = ({ onUpdateStyle }: SubtitleControlsProps) => {
  return (
    <div className="absolute right-2 top-2 flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onUpdateStyle("fontSize", "small")}>
            Small
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStyle("fontSize", "medium")}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStyle("fontSize", "large")}>
            Large
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <AlignCenter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onUpdateStyle("position", "top")}>
            Top
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStyle("position", "center")}>
            Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStyle("position", "bottom")}>
            Bottom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
