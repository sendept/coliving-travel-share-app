
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { parseMessage } from "@/lib/parser";
import { ChevronDown } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({
  onSubmit
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
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

  return <form onSubmit={handleSubmit} className="relative mt-5">
      <Textarea value={message} onChange={handleMessageChange} placeholder="" className="min-h-[140px] pr-12 resize-none border-0 bg-[#FFFFFF] rounded-2xl hover:rounded-2xl focus:rounded-2xl" />
      <div className="absolute top-8 left-4 text-gray-500">
        <p className="font-medium text-base mt-8 my-[16px] mx-[16px]">
          Comparte tus planes de viaje aquí. (Yo soy María y viajo desde Santiago hasta Lisboa. Voy a parar en Vigo. Tengo 3 plazas libres. Mi contacto: 123456789)
        </p>
        <p className="text-[9px] font-normal">
          Share your travel plans here (e.g. I am Fabrizio, and I want to share a taxi from Porto airport to Sende. There are 3 more spots in the car. My contact is 123456789)
        </p>
      </div>
      <div className="absolute bottom-2 right-2">
        <Button type="submit" className="p-0 m-0 h-auto w-auto bg-transparent hover:bg-transparent">
          <img src="/lovable-uploads/7c201b73-452d-4ae2-91c1-a85e6b1acd23.png" alt="Send" className="w-6 h-6" />
        </Button>
      </div>
    </form>;
};
