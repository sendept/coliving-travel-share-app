
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
  // Ensure value is always a string for the Input component
  const stringValue = value === null || value === undefined 
    ? '' 
    : String(value);

  return (
    <div className="relative">
      <Input
        value={stringValue}
        onChange={(e) => {
          let inputValue = e.target.value;
          if (type === "number") {
            // For number inputs, pass a number to the handler if it's valid, or 0
            const parsedValue = inputValue === '' ? '' : (parseInt(inputValue) || 0);
            onChange(parsedValue);
          } else {
            onChange(inputValue);
          }
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
