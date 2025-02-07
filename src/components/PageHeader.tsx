
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PageSettings {
  id: string;
  title: string;
  subtitle: string;
  language: string;
}

export const PageHeader = () => {
  const [settings, setSettings] = useState<PageSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PageSettings>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching page settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    };

    fetchSettings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:page_settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_settings'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setSettings(payload.new as PageSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const startEditing = () => {
    setIsEditing(true);
    setEditForm(settings || {});
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const saveEditing = async () => {
    if (!settings?.id || !editForm) return;

    const { error } = await supabase
      .from('page_settings')
      .update({
        title: editForm.title,
        subtitle: editForm.subtitle,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);

    if (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    });

    setIsEditing(false);
    setEditForm({});
  };

  if (!settings) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editForm.title || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-4xl font-bold text-center max-w-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={saveEditing}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center">{settings.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={startEditing}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        {isEditing ? (
          <Input
            value={editForm.subtitle || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
            className="text-muted-foreground text-center max-w-xl"
          />
        ) : (
          <p className="text-center text-muted-foreground">
            {settings.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
