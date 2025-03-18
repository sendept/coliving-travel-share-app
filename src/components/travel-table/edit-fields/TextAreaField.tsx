
import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent } from "react";

interface TextAreaFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  className: string;
  placeholder?: string;
  onConfirm: () => void;
}

export const TextAreaField = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
  placeholder,
  onConfirm
}: TextAreaFieldProps) => {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        placeholder={placeholder}
      />
      <Check 
        size={16} 
        className="absolute right-2 bottom-2 text-green-600 cursor-pointer check-icon" 
        onClick={onConfirm}
      />
    </div>
  );
};
