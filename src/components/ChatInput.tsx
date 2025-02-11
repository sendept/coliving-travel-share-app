
import { useState } from "react";
import { Send } from "lucide-react";
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
  const [detectedLanguage, setDetectedLanguage] = useState<"en" | "es">("en");

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
        title: detectedLanguage === 'es' ? "Por favor escribe un mensaje" : "Please enter a message",
        description: detectedLanguage === 'es' ? "Tu plan de viaje no puede estar vacío" : "Your travel plan cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(message);
    setMessage("");
    setDetectedLanguage("en");
  };

  const placeholder = detectedLanguage === 'es' 
    ? "Ingresa tu plan de viaje... (ej: 'Soy María desde Ourense con 2 plazas vía Santiago')"
    : "Enter your travel plan... (e.g., 'I'm Maria from Ourense with 2 free spots via Santiago')";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={handleMessageChange}
        placeholder={placeholder}
        className="min-h-[100px] pr-12 resize-none"
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {detectedLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
        </span>
        <Button 
          type="submit" 
          size="icon"
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
