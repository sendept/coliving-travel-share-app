
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "./LogoUpload";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Check, X, Type, AlignCenter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageSettings {
  id?: string;
  name: string;
  subtitle: string;
  subtitle_style?: {
    fontSize?: "small" | "medium" | "large";
    position?: "top" | "center" | "bottom";
    preset?: "default" | "elegant" | "minimal";
  };
  logo_url: string;
}

const fontSizes = {
  small: "text-sm md:text-base",
  medium: "text-base md:text-lg",
  large: "text-lg md:text-xl",
};

const positions = {
  top: "mt-2",
  center: "my-4",
  bottom: "mb-6",
};

const presets = {
  default: "text-muted-foreground",
  elegant: "text-gray-700 italic font-playfair",
  minimal: "text-gray-600 font-light",
};

export const PageHeader = () => {
  const [settings, setSettings] = useState<PageSettings>({
    name: "EVENT NAME",
    subtitle: "",
    subtitle_style: {
      fontSize: "medium",
      position: "top",
      preset: "default"
    },
    logo_url: "",
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<PageSettings>(settings);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('page_settings')
      .select('*')
      .single();

    if (!error && data) {
      setSettings(data);
      setEditForm(data);
    }
  };

  const handleSave = async () => {
    // Validate subtitle length (45-85 characters per line)
    const lines = editForm.subtitle.split('\n');
    const isValidLength = lines.every(line => line.length >= 45 && line.length <= 85);

    if (!isValidLength) {
      toast({
        title: "Invalid subtitle length",
        description: "Each line should be between 45-85 characters",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('page_settings')
      .upsert({ 
        id: settings.id || undefined,
        name: editForm.name,
        subtitle: editForm.subtitle,
        subtitle_style: editForm.subtitle_style,
      });

    if (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes",
        variant: "destructive",
      });
      return;
    }

    setSettings(editForm);
    setEditing(false);
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    });
  };

  const handleLogoUpdate = async (url: string) => {
    const { error } = await supabase
      .from('page_settings')
      .upsert({ 
        id: settings.id || undefined,
        logo_url: url 
      });

    if (!error) {
      setSettings(prev => ({ ...prev, logo_url: url }));
    }
  };

  const updateSubtitleStyle = (
    key: "fontSize" | "position" | "preset",
    value: string
  ) => {
    setEditForm(prev => ({
      ...prev,
      subtitle_style: {
        ...prev.subtitle_style,
        [key]: value,
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="h-24 w-24 mx-auto mb-6 relative group">
        {settings.logo_url ? (
          <div className="relative">
            <img 
              src={settings.logo_url} 
              alt="Event logo" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <LogoUpload onLogoUpdate={handleLogoUpdate}>
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
            <LogoUpload onLogoUpdate={handleLogoUpdate} />
          </div>
        )}
      </div>
      <div className="text-center space-y-2">
        {editing ? (
          <>
            <div className="space-y-2">
              <div className="relative max-w-[700px] min-w-[350px] mx-auto">
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-3xl font-semibold tracking-tight text-center pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  className="h-8 w-8 absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative max-w-[700px] min-w-[350px] mx-auto">
                <Input
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  className={cn(
                    "text-center",
                    fontSizes[editForm.subtitle_style?.fontSize || "medium"],
                    positions[editForm.subtitle_style?.position || "top"],
                    presets[editForm.subtitle_style?.preset || "default"]
                  )}
                  placeholder="Enter subtitle (45-85 characters per line)"
                />
                <div className="absolute right-2 top-2 flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Type className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("fontSize", "small")}>
                        Small
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("fontSize", "medium")}>
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("fontSize", "large")}>
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
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("position", "top")}>
                        Top
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("position", "center")}>
                        Center
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateSubtitleStyle("position", "bottom")}>
                        Bottom
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(false);
                setEditForm(settings);
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="relative max-w-[700px] min-w-[350px] mx-auto">
              <h1 className="text-3xl font-semibold tracking-tight pr-8">{settings.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditing(true)}
                className="h-8 w-8 absolute right-0 top-1/2 -translate-y-1/2"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <p className={cn(
              "max-w-[700px] min-w-[350px] mx-auto px-4",
              fontSizes[settings.subtitle_style?.fontSize || "medium"],
              positions[settings.subtitle_style?.position || "top"],
              presets[settings.subtitle_style?.preset || "default"]
            )}>
              {settings.subtitle}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
