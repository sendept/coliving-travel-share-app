
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMessage } from "@/lib/parser";
import { detectLanguage } from "@/lib/parser/languageDetector";

interface ChatInputProps {
  onSubmit: (message: string, language: "en" | "es" | "fr") => void;
}

export const ChatInput = ({
  onSubmit
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("en");
  const [detectedLanguage, setDetectedLanguage] = useState<"en" | "es" | "fr">("en");
  const {
    toast
  } = useToast();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-detect language as user types (if enough text)
    if (e.target.value.length > 5) {
      const detected = detectLanguage(e.target.value);
      setDetectedLanguage(detected);
    }
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
    
    // Use detected language for submission, regardless of UI selection
    const detected = detectLanguage(message);
    onSubmit(message, detected);
    
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift key, submit the form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (newline)
      if (message.trim()) {
        // Use detected language for submission, regardless of UI selection
        const detected = detectLanguage(message);
        onSubmit(message, detected);
        setMessage("");
      }
    }
    // If Shift+Enter is pressed, allow default behavior (newline)
  };

  const toggleLanguage = () => {
    setSelectedLanguage(prev => prev === "en" ? "es" : "en");
  };

  const getHelpText = () => {
    if (selectedLanguage === "es") {
      return "Escribe tu ruta aquí: Yo soy María y viajo desde Santiago hasta Lisboa. Voy a parar en Vigo. Fecha: 1.9 sobre las 11:00 am. Tengo 3 plazas libres. Mi contacto: 123456789";
    } else {
      return "Write your route here: I am Fabrizio and I'm traveling from Lisbon to Santiago. I'll stop in Porto. Date: 1.9 around 11:00 am. I have 2 seats available. My contact: 987654321";
    }
  };

  const helpText = getHelpText();

  return <form onSubmit={handleSubmit} className="relative mt-5">
      <div className="relative rounded-md overflow-hidden">
        <Textarea 
          value={message} 
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="" 
          className="min-h-[156px] resize-none border border-gray-200 bg-[#FFFFFF] rounded-md p-5 md:p-10 focus:ring-1 focus:outline-none text-sm focus:border-ph-orange focus:ring-ph-orange focus-visible:ring-ph-orange focus-visible:ring-1 focus-visible:border-ph-orange" 
        />
        <div className="absolute text-gray-500 w-full h-full top-0 left-0 p-5 md:p-10 pointer-events-none">
          {!message && (
            <p className="text-sm text-left font-normal opacity-80">
              {helpText}
            </p>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center">
          <div className="mr-3 text-xs">
            <button 
              type="button"
              onClick={toggleLanguage} 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className={selectedLanguage === "en" ? "font-bold" : "font-normal"}>EN</span>
              {" / "}
              <span className={selectedLanguage === "es" ? "font-bold" : "font-normal"}>ES</span>
            </button>
          </div>
          <Button type="submit" className="p-0 m-0 h-auto w-auto bg-transparent hover:bg-transparent">
            <img src="/lovable-uploads/7c201b73-452d-4ae2-91c1-a85e6b1acd23.png" alt="Send" className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4" style={{ 
              width: 'clamp(1rem, 4vw, 1.25rem)', 
              height: 'clamp(1rem, 4vw, 1.25rem)'
            }} />
          </Button>
        </div>
      </div>
    </form>;
};
