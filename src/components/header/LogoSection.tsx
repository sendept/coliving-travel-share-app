
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { LogoUpload } from "../LogoUpload";

interface LogoSectionProps {
  logoUrl: string;
  onLogoUpdate: (url: string) => void;
}

export const LogoSection = ({ logoUrl, onLogoUpdate }: LogoSectionProps) => {
  return (
    <div className="h-24 w-24 mx-auto mb-6 relative group">
      {logoUrl ? (
        <div className="relative">
          <img 
            src={logoUrl} 
            alt="Event logo" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
            <LogoUpload onLogoUpdate={onLogoUpdate}>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-white"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </LogoUpload>
          </div>
        </div>
      ) : (
        <div className="w-full h-full rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <LogoUpload onLogoUpdate={onLogoUpdate} />
        </div>
      )}
    </div>
  );
};
