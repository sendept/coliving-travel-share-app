
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { TravelFormValues } from "../types";
import { createTravelEntry } from "@/services/travelEntryService";
import { detectLanguage } from "@/lib/parser/languageDetector";

export const useTravelForm = (projectId?: string | null) => {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const form = useForm<TravelFormValues>({
    defaultValues: {
      name: "",
      route: "",
      availableSpots: 2,
      transport: "car",
      dateTime: "",
      contact: "",
      dietaryRestrictions: ""
    }
  });

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const onSubmit = async (formData: TravelFormValues) => {
    try {
      // Detect language from the route text
      const detectedLanguage = detectLanguage(formData.route);
      
      // Update UI language based on detected language (only for en/es)
      if (detectedLanguage === "en" || detectedLanguage === "es") {
        setLanguage(detectedLanguage);
      }
      
      // Create a travel entry from form data
      const newEntry = {
        name: formData.name,
        available_spots: formData.availableSpots, 
        route: formData.route,
        transport: formData.transport.toLowerCase(), 
        taxi_sharing: formData.route.toLowerCase().includes("taxi"),
        contact: formData.contact,
        claimed_by: [],
        language: detectedLanguage === "fr" ? "en" : detectedLanguage,
        project_id: projectId || 'default',
        dietary_restrictions: formData.dietaryRestrictions || null,
        date_time: formData.dateTime || null
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
      
      // Reset the form
      form.reset();
      
      setSuccess(true);
      toast({
        title: "Travel plan added!",
        description: "Your travel plan has been successfully added to the list.",
      });

      // Reset success message after 10 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
      
      // Immediately scroll to the top of the table
      const tableElement = document.querySelector('.responsive-table');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
        
      // Then find and highlight the new entry
      if (data && Array.isArray(data) && data.length > 0 && data[0].id) {
        setTimeout(() => {
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
        }, 500); // reduced wait time for a smoother experience
      }
    } catch (err) {
      console.error("Unexpected error in handleSubmit:", err);
      toast({
        title: "Error adding travel plan",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getSuccessMessage = () => {
    return language === "es" 
      ? "¡Excelente! Desplázate hacia arriba para ver o editar tu plan de viaje."
      : "Great! Scroll up to see or edit your travel plan.";
  };

  return {
    form,
    onSubmit,
    language,
    handleToggleLanguage,
    focusedField,
    handleFocus,
    handleBlur,
    success,
    getSuccessMessage
  };
};
