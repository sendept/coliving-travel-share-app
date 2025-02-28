
import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { parseMessage } from "@/lib/parser";
import { useToast } from "@/hooks/use-toast";
import { createTravelEntry } from "@/services/travelEntryService";
import { ChevronDown } from "lucide-react";
import { detectLanguage } from "@/lib/parser/languageDetector";

interface TravelFormProps {
  projectId?: string | null;
}

export const TravelForm = ({ projectId }: TravelFormProps) => {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("es");

  const handleSubmit = async (message: string, currentLanguage: "en" | "es") => {
    setLanguage(currentLanguage);
    const parsed = parseMessage(message);
    if (!parsed) {
      toast({
        title: "Could not parse message",
        description: "Please try rephrasing your travel plan",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      name: parsed.name,
      available_spots: parsed.availableSpots,
      route: parsed.route,
      transport: parsed.transport,
      taxi_sharing: parsed.taxiSharing,
      contact: parsed.contact,
      claimed_by: [],
      language: currentLanguage, // Use the detected language
      project_id: projectId || 'default',
      dietary_restrictions: parsed.dietary_restrictions || null
      // Removed date_time field which was causing the error
    };

    const { error } = await createTravelEntry(newEntry);

    if (error) {
      console.error('Error inserting entry:', error);
      toast({
        title: "Error adding travel plan",
        description: "Could not save your travel plan",
        variant: "destructive",
      });
      return;
    }

    setSuccess(true);
    toast({
      title: "Travel plan added!",
      description: "Your travel plan has been successfully added to the list.",
    });

    // Reset success message after 10 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 10000);
  };

  const successMessage = language === "es" 
    ? "¡Excelente! Desplázate hacia abajo para ver o editar tu plan de viaje."
    : "Great! Scroll down to see or edit your travel plan.";

  return (
    <div className="bg-[#FFFFFF] max-w-2xl mx-auto">
      <ChatInput onSubmit={handleSubmit} />
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mt-2 text-center">
          <p className="text-sm flex items-center justify-center">
            {successMessage}
            <ChevronDown className="h-4 w-4 ml-1" />
          </p>
        </div>
      )}
    </div>
  );
};
