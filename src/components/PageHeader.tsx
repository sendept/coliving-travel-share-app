
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogoSection } from "./header/LogoSection";

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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('page_settings').select('*').single();
    if (!error && data) {
      setSettings(data);
    }
  };

  return <div className="space-y-4">
      <div className="h-24 w-24 mx-auto mb-6 relative">
        {settings.logo_url && (
          <img 
            src={settings.logo_url} 
            alt="Event logo" 
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="text-center space-y-4 px-4 sm:px-0">
        <div className="relative max-w-[700px] min-w-[350px] mx-auto">
          <h1 className="font-semibold tracking-tight text-3xl">{settings.name}</h1>
        </div>
        <p className={`text-base md:text-xl text-gray-500 font-normal break-words whitespace-pre-wrap max-w-2xl mx-auto mt-6 ${
          settings.subtitle_style?.fontSize ? fontSizes[settings.subtitle_style.fontSize] : fontSizes.medium
        }`}>
          {settings.subtitle}
        </p>
      </div>
    </div>;
};
