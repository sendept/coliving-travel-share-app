
import { ChevronUp } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mt-2 text-center">
      <p className="text-sm flex items-center justify-center">
        {message}
        <ChevronUp className="h-4 w-4 ml-1" />
      </p>
    </div>
  );
};
