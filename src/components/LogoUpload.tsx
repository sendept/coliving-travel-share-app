
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploadProps {
  onLogoUpdate: (url: string) => void;
  children?: React.ReactNode;
}

export const LogoUpload = ({ onLogoUpdate, children }: LogoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event_logos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event_logos')
        .getPublicUrl(filePath);

      onLogoUpdate(publicUrl);

      toast({
        title: "Logo uploaded",
        description: "Your logo has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      {children || (
        <Button variant="ghost" className="w-full h-full" disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Logo"}
        </Button>
      )}
    </div>
  );
};
