
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { KeyboardEvent } from "react";

interface InputFieldProps {
  value: string | number;
  onChange: (value: any) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  className: string;
  placeholder?: string;
  type?: string;
  min?: number;
  onConfirm: () => void;
}

export const InputField = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
  placeholder,
  type = "text",
  min,
  onConfirm
}: InputFieldProps) => {
  return (
    <div className="relative">
      <Input
        value={String(value)}
        onChange={(e) => {
          let inputValue = e.target.value;
          if (type === "number") {
            inputValue = parseInt(inputValue) || 0;
          }
          onChange(inputValue);
        }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        placeholder={placeholder}
        type={type}
        min={min}
      />
      <Check 
        size={16} 
        className="absolute right-2 bottom-2 text-green-600 cursor-pointer check-icon" 
        onClick={onConfirm}
      />
    </div>
  );
};
