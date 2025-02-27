
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMessage } from "@/lib/parser";
import { ChevronDown } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    onSubmit(message);
    setMessage("");
  };

  const getPlaceholder = () => {
    return "Share your travel plans here... / Comparte tus planes de viaje aquí...";
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-5">
      <Textarea
        value={message}
        onChange={handleMessageChange}
        placeholder={getPlaceholder()}
        className="min-h-[140px] pr-12 resize-none border-0 bg-[#FFFFFF] rounded-lg hover:rounded-lg focus:rounded-lg"
      />
      <div className="absolute bottom-2 right-2">
        <Button 
          type="submit" 
          size="icon"
          className="bg-gray-400 hover:bg-gray-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center"
        >
          <img 
            src="/lovable-uploads/ed4b1385-2c2c-4ac5-8dba-315b6b787da1.png" 
            alt="Send" 
            className="w-8 h-8"
          />
        </Button>
      </div>
      <div className="mt-3 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <span>See other shared rides / Ver otros viajes compartidos</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </form>
  );
};
