
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTravelEntry } from "@/services/travelEntryService";
import { ChevronDown } from "lucide-react";
import { detectLanguage } from "@/lib/parser/languageDetector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface TravelFormProps {
  projectId?: string | null;
}

interface TravelFormValues {
  name: string;
  route: string;
  dateTime: string;
  contact: string;
  dietaryRestrictions: string;
}

export const TravelForm = ({ projectId }: TravelFormProps) => {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("es");

  const form = useForm<TravelFormValues>({
    defaultValues: {
      name: "",
      route: "",
      dateTime: "",
      contact: "",
      dietaryRestrictions: ""
    }
  });

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
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
        available_spots: 2, // Default to 2 available spots
        route: formData.route,
        transport: "car", // Default transport type
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

  const getPlaceholder = (field: keyof TravelFormValues) => {
    const placeholders = {
      en: {
        name: "Your name",
        route: "Write your route and means of transport (add any comment)",
        dateTime: "Write a date and approx hour (e.g., 1.9 around 11:00 am)",
        contact: "Your contact (preferably WhatsApp number)",
        dietaryRestrictions: "Diet/allergies (optional)"
      },
      es: {
        name: "Tu nombre",
        route: "Escribe tu ruta y medio de transporte (añade cualquier comentario)",
        dateTime: "Escribe una fecha y hora aproximada (ej., 1.9 sobre las 11:00 am)",
        contact: "Tu contacto (preferiblemente número de WhatsApp)",
        dietaryRestrictions: "Dieta/alergias (opcional)"
      }
    };
    
    return placeholders[language][field];
  };

  const successMessage = language === "es" 
    ? "¡Excelente! Desplázate hacia abajo para ver o editar tu plan de viaje."
    : "Great! Scroll down to see or edit your travel plan.";

  return (
    <div className="bg-[#FFFFFF] max-w-2xl mx-auto">
      <div className="relative rounded-lg overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5 md:p-10 bg-[#FFFFFF] rounded-lg border border-transparent focus-within:border-[#F97316]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">{language === "en" ? "Your name" : "Tu nombre"}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("name")}
                      className="focus:outline-none focus:ring-[#F97316] focus:border-[#F97316] focus-visible:ring-[#F97316]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    {language === "en" ? "Route & transport" : "Ruta y transporte"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={getPlaceholder("route")}
                      className="min-h-[100px] resize-none focus:outline-none focus:ring-[#F97316] focus:border-[#F97316] focus-visible:ring-[#F97316]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    {language === "en" ? "Date & time" : "Fecha y hora"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("dateTime")}
                      className="focus:outline-none focus:ring-[#F97316] focus:border-[#F97316] focus-visible:ring-[#F97316]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    {language === "en" ? "Contact" : "Contacto"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("contact")}
                      className="focus:outline-none focus:ring-[#F97316] focus:border-[#F97316] focus-visible:ring-[#F97316]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    {language === "en" ? "Diet/allergies" : "Dieta/alergias"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("dietaryRestrictions")}
                      className="focus:outline-none focus:ring-[#F97316] focus:border-[#F97316] focus-visible:ring-[#F97316]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center mt-6">
              <button 
                type="button"
                onClick={handleToggleLanguage} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-xs"
              >
                <span className={language === "en" ? "font-bold" : "font-normal"}>EN</span>
                {" / "}
                <span className={language === "es" ? "font-bold" : "font-normal"}>ES</span>
              </button>
              
              <Button type="submit" className="bg-[#F97316] hover:bg-[#F97316]/90 text-white border-none">
                {language === "en" ? "Submit" : "Enviar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mt-2 text-center">
          <p className="text-sm flex items-center justify-center">
            {successMessage}
            <ChevronDown className="h-4 w-4 ml-1" />
          </p>
        </div>
      )}
      
      <div className="mt-2 text-center">
        <a 
          href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#F97316] hover:text-[#F97316]/80 underline text-[9px]"
        >
          Report a bug or suggest changes
        </a>
      </div>
    </div>
  );
};
