
import { useState, useEffect } from "react";
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
      return "Escribe tu ruta aquí: (Yo soy María y viajo desde Santiago hasta Lisboa. Voy a parar en Vigo. Tengo 3 plazas libres. Mi contacto: 123456789)";
    } else {
      return "Write your route here: (I am Fabrizio and I'm traveling from Lisbon to Santiago. I'll stop in Porto. I have 2 seats available. My contact: 987654321)";
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
        <div className="absolute text-gray-500 w-full h-full top-0 left-0 flex flex-col justify-between px-[40px] py-[40px] pointer-events-none">
          {!message && (
            <p className="text-base md:text-base text-[11px] text-left font-normal py-px my-0 flex items-start">
              {helpText}
            </p>
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
