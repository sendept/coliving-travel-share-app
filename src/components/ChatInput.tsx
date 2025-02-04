import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        description: "Your travel plan cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your travel plan... (e.g., 'I'm Maria from Ourense with 2 free spots via Santiago')"
        className="min-h-[100px] pr-12 resize-none"
      />
      <Button 
        type="submit" 
        size="icon"
        className="absolute bottom-2 right-2 bg-secondary hover:bg-secondary/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};