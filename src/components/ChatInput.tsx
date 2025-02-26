
import { useState } from "react";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMessage } from "@/lib/parser";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [detectedLanguage, setDetectedLanguage] = useState<"en" | "es" | "fr">("en");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Update detected language as user types
    if (newMessage.length > 5) {
      const parsed = parseMessage(newMessage);
      if (parsed) {
        setDetectedLanguage(parsed.language);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: detectedLanguage === 'es' 
          ? "Por favor escribe un mensaje" 
          : detectedLanguage === 'fr'
          ? "Veuillez écrire un message"
          : "Please enter a message",
        description: detectedLanguage === 'es' 
          ? "Tu plan de viaje no puede estar vacío" 
          : detectedLanguage === 'fr'
          ? "Votre plan de voyage ne peut pas être vide"
          : "Your travel plan cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(message);
    setMessage("");
    setDetectedLanguage("en");
  };

  const getPlaceholder = () => {
    switch(detectedLanguage) {
      case 'es':
        return "Escribe aquí tu plan de viaje... (soy María y viajo desde Madrid a Lisboa. Voy a parar en Évora. Tengo 3 plazas libres. Mi contacto es 123456789)";
      case 'fr':
        return "Écrivez votre plan de voyage ici... (Je m'appelle Marie et je voyage de Paris à Lyon. J'ai 2 places libres. Mon numéro est 123456789)";
      default:
        return "Enter your travel plan... (e.g., 'I'm Maria from Ourense with 2 free spots via Santiago')";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-5">
      <Textarea
        value={message}
        onChange={handleMessageChange}
        placeholder={getPlaceholder()}
        className="min-h-[140px] pr-12 resize-none border-0 bg-[#FFFFFF]"
      />
      <div className="absolute bottom-2 right-2">
        <Button 
          type="submit" 
          size="icon"
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2"
        >
          <Circle className="h-4 w-4 relative">
            <span className="absolute inset-0 flex items-center justify-center">
              ↗
            </span>
          </Circle>
        </Button>
      </div>
    </form>
  );
};
