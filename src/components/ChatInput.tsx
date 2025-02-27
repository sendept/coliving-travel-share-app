
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMessage } from "@/lib/parser";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({
  onSubmit
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<"en" | "es">("es");
  const {
    toast
  } = useToast();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    onSubmit(message);
    setMessage("");
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  const getHelpText = () => {
    if (language === "es") {
      return {
        main: "Escribe tu ruta aquí: (Yo soy María y viajo desde Santiago hasta Lisboa. Voy a parar en Vigo. Tengo 3 plazas libres. Mi contacto: 123456789)",
        sub: "Share your travel plans here (e.g. I am Fabrizio, and I want to share a taxi from Porto airport to Sende. There are 3 more spots in the car. My contact is 123456789)"
      };
    } else {
      return {
        main: "Write your route here: (I am John and I'm traveling from Lisbon to Santiago. I'll stop in Porto. I have 2 seats available. My contact: 987654321)",
        sub: "Comparte tu plan de viaje aquí (p.ej. Soy Fabrizio, y quiero compartir un taxi desde el aeropuerto de Porto a Sende. Hay 3 plazas más en el coche. Mi contacto es 123456789)"
      };
    }
  };

  const helpText = getHelpText();

  return <form onSubmit={handleSubmit} className="relative mt-5">
      <div className="relative">
        <Textarea 
          value={message} 
          onChange={handleMessageChange} 
          placeholder="" 
          className="min-h-[156px] pr-12 resize-none border-0 bg-[#FFFFFF] rounded-none pt-[40px] px-[40px] pb-[40px] focus:ring-0 focus:outline-none" 
        />
        <div className="absolute text-gray-500 w-full h-full top-0 left-0 flex flex-col justify-start px-[40px] pt-[40px] pointer-events-none">
          {!message && (
            <>
              <p className="text-base md:text-base text-[11px] text-left font-normal py-px my-0 flex items-start">
                {helpText.main}
              </p>
              {/* Show the subtitle help text only on desktop for both languages */}
              {window.innerWidth >= 768 && (
                <p className="text-[9px] font-normal my-0 text-left px-0 py-[6px] sm:text-[9px] text-[8px]">
                  {helpText.sub}
                </p>
              )}
            </>
          )}
          {/* Add blinking cursor when empty - positioned with text spacing */}
          {!message && (
            <div className="absolute top-[40px] left-[40px] ml-[calc(100%-4px)] h-[14px] w-[1px] bg-gray-500 animate-pulse"></div>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex items-center">
        <div className="mr-3 text-xs">
          <button 
            type="button"
            onClick={toggleLanguage} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <span className={language === "en" ? "font-bold" : "font-normal"}>EN</span>
            {" / "}
            <span className={language === "es" ? "font-bold" : "font-normal"}>ES</span>
          </button>
        </div>
        <Button type="submit" className="p-0 m-0 h-auto w-auto bg-transparent hover:bg-transparent">
          <img src="/lovable-uploads/7c201b73-452d-4ae2-91c1-a85e6b1acd23.png" alt="Send" className="w-6 h-6" />
        </Button>
      </div>
    </form>;
};
