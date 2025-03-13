
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

  const handleSubmit = async (message: string, detectedLanguage: "en" | "es" | "fr") => {
    // Update UI language based on detected language (only for en/es)
    if (detectedLanguage === "en" || detectedLanguage === "es") {
      setLanguage(detectedLanguage);
    }
    
    const parsed = parseMessage(message);
    if (!parsed) {
      toast({
        title: "Could not parse message",
        description: "Please try rephrasing your travel plan",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the language detected from the parser, which may include French
      const submissionLanguage = parsed.language === "fr" ? "en" : parsed.language;
      
      const newEntry = {
        name: parsed.name,
        available_spots: parsed.availableSpots,
        route: parsed.route,
        transport: parsed.transport,
        taxi_sharing: parsed.taxiSharing,
        contact: parsed.contact,
        claimed_by: [],
        language: submissionLanguage,
        project_id: projectId || 'default',
        dietary_restrictions: parsed.dietary_restrictions || null,
        date_time: parsed.date_time || null
      };

      console.log("Submitting new entry:", newEntry);

      const { error, data } = await createTravelEntry(newEntry);

      if (error) {
        console.error('Error inserting entry:', error);
        toast({
          title: "Error adding travel plan",
          description: "Could not save your travel plan: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Entry created successfully:", data);
      
      setSuccess(true);
      toast({
        title: "Travel plan added!",
        description: "Your travel plan has been successfully added to the list.",
      });

      // Reset success message after 10 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
      
      // Scroll to the new entry in the table
      setTimeout(() => {
        // Check if data exists and is an array with at least one element
        if (data && Array.isArray(data) && data.length > 0 && data[0].id) {
          const entryId = data[0].id;
          const entryElement = document.getElementById(`entry-${entryId}`);
          if (entryElement) {
            entryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Briefly highlight the entry
            entryElement.classList.add('bg-orange-50');
            setTimeout(() => {
              entryElement.classList.remove('bg-orange-50');
            }, 3000);
          }
        }
      }, 1000); // Wait for the table to refresh
    } catch (err) {
      console.error("Unexpected error in handleSubmit:", err);
      toast({
        title: "Error adding travel plan",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
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
