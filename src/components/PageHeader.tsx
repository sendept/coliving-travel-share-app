
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoSection } from "./header/LogoSection";
import { EditableTitle } from "./header/EditableTitle";
import { SubtitleControls } from "./header/SubtitleControls";

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
  large: "text-lg md:text-xl"
};

const positions = {
  top: "mt-2",
  center: "my-4",
  bottom: "mb-6"
};

const presets = {
  default: "text-muted-foreground",
  elegant: "text-gray-700 italic font-playfair",
  minimal: "text-gray-600 font-light"
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
    logo_url: ""
  });
  
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<PageSettings>(settings);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('page_settings').select('*').single();
    if (!error && data) {
      setSettings(data);
      setEditForm(data);
    }
  };

  const handleSave = async () => {
    const lines = editForm.subtitle.split('\n');
    const isValidLength = lines.every(line => line.length <= 120);
    
    if (!isValidLength) {
      toast({
        title: "Invalid subtitle length",
        description: "Each line should be 120 characters or less",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await supabase.from('page_settings').upsert({
      id: settings.id || undefined,
      name: editForm.name,
      subtitle: editForm.subtitle,
      subtitle_style: editForm.subtitle_style
    });
    
    if (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes",
        variant: "destructive"
      });
      return;
    }
    
    setSettings(editForm);
    setEditing(false);
    
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully"
    });
  };

  const handleLogoUpdate = async (url: string) => {
    const { error } = await supabase.from('page_settings').upsert({
      id: settings.id || undefined,
      logo_url: url
    });
    
    if (!error) {
      setSettings(prev => ({
        ...prev,
        logo_url: url
      }));
    }
  };

  const updateSubtitleStyle = (key: "fontSize" | "position" | "preset", value: string) => {
    setEditForm(prev => ({
      ...prev,
      subtitle_style: {
        ...prev.subtitle_style,
        [key]: value
      }
    }));
  };

  return <div className="space-y-4">
      <LogoSection logoUrl={settings.logo_url} onLogoUpdate={handleLogoUpdate} />
      <div className="text-center space-y-2 px-4 sm:px-0">
        {editing ? <>
            <div className="space-y-2">
              <EditableTitle isEditing={true} title={editForm.name} onEdit={() => {}} onChange={value => setEditForm(prev => ({
            ...prev,
            name: value
          }))} onSave={handleSave} />
              <div className="relative max-w-[700px] min-w-[350px] mx-auto">
                <Input value={editForm.subtitle} onChange={e => setEditForm(prev => ({
              ...prev,
              subtitle: e.target.value
            }))} className={cn("text-center", fontSizes[editForm.subtitle_style?.fontSize || "medium"], positions[editForm.subtitle_style?.position || "top"], presets[editForm.subtitle_style?.preset || "default"])} placeholder="Enter subtitle (max 120 characters per line)" />
                <SubtitleControls onUpdateStyle={updateSubtitleStyle} />
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => {
          setEditing(false);
          setEditForm(settings);
        }} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </> : <>
            <EditableTitle isEditing={false} title={settings.name} onEdit={() => setEditing(true)} onChange={() => {}} onSave={() => {}} />
            <p className="text-base text-gray-500 font-normal break-words whitespace-pre-wrap">
              {settings.subtitle}
            </p>
          </>}
      </div>
    </div>;
};
