
import { TextAreaField } from "./TextAreaField";
import { KeyboardEvent } from "react";

interface RouteFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onConfirm: () => void;
}

export const RouteField = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onConfirm
}: RouteFieldProps) => {
  const routeTextareaClasses = `table-textarea min-h-[80px] bg-white border-0 px-3 py-2 rounded-md pr-8 focus:outline-none focus:ring-0`;
  
  return (
    <TextAreaField
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`${routeTextareaClasses} claim-form border-0`}
      onConfirm={onConfirm}
    />
  );
};
