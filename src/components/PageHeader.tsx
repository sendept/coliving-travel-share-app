
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "./LogoUpload";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Check, X } from "lucide-react";

export const PageHeader = () => {
  const [settings, setSettings] = useState({
    name: "EVENT NAME",
    subtitle: "",
    logo_url: "",
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(settings);
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
    const { error } = await supabase
      .from('page_settings')
      .upsert({ 
        id: settings.id || undefined,
        name: editForm.name,
        subtitle: editForm.subtitle,
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

  return (
    <div className="space-y-4">
      <div className="h-16 w-16 mx-auto mb-6">
        {settings.logo_url ? (
          <img 
            src={settings.logo_url} 
            alt="Event logo" 
            className="w-full h-full object-contain"
          />
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
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-semibold tracking-tight text-center"
              />
              <Input
                value={editForm.subtitle}
                onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                className="text-2xl font-light text-center"
              />
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
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
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">{settings.name}</h1>
            <p className="text-2xl font-light text-muted-foreground">{settings.subtitle}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
              className="h-8 w-8 mt-2"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
