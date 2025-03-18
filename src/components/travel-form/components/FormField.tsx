
import { ReactNode } from "react";
import { FormControl, FormField as UIFormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { TravelFormValues } from "../types";

interface FormFieldProps {
  name: keyof TravelFormValues;
  control: Control<TravelFormValues>;
  label?: string;
  placeholder: string;
  isTextarea?: boolean;
  type?: string;
  className?: string;
  min?: string;
  focusedField: string | null;
  onFocus: (field: string) => void;
  onBlur: () => void;
  onChange?: (value: any) => void;
}

export const FormField = ({
  name,
  control,
  label,
  placeholder,
  isTextarea = false,
  type = "text",
  className = "",
  min,
  focusedField,
  onFocus,
  onBlur,
  onChange,
}: FormFieldProps) => {
  return (
    <UIFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-gray-700 text-left block mb-3 text-sm font-medium">
              {label}
            </FormLabel>
          )}
          <FormControl>
            {isTextarea ? (
              <Textarea
                placeholder={placeholder}
                className={`
                  min-h-[100px] resize-none border border-transparent
                  focus:outline-none 
                  ${focusedField === name ? "ring-1 ring-[#F97316]" : ""} 
                  focus-visible:ring-1 focus-visible:ring-[#F97316]
                `}
                onFocus={() => onFocus(name)}
                onBlur={onBlur}
                {...field}
              />
            ) : (
              <Input
                type={type}
                min={min}
                placeholder={placeholder}
                className={`
                  ${name === "name" ? "border border-gray-300" : "border border-transparent"}
                  focus:outline-none 
                  ${focusedField === name ? "ring-1 ring-[#F97316]" : ""} 
                  focus-visible:ring-1 focus-visible:ring-[#F97316]
                `}
                onFocus={() => onFocus(name)}
                onBlur={onBlur}
                {...field}
                onChange={(e) => {
                  if (type === "number") {
                    field.onChange(parseInt(e.target.value) || 0);
                  } else {
                    field.onChange(e.target.value);
                  }
                  if (onChange) {
                    onChange(e.target.value);
                  }
                }}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
};
