
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTravelEntry } from "@/services/travelEntryService";
import { ChevronUp } from "lucide-react";
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
  availableSpots: number;
  transport: string;
  dateTime: string;
  contact: string;
  dietaryRestrictions: string;
}

export const TravelForm = ({ projectId }: TravelFormProps) => {
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
      
      // Scroll to the new entry in the table and to the top of the table
      setTimeout(() => {
        // First scroll to the top of the table
        const tableElement = document.querySelector('.responsive-table');
        if (tableElement) {
          tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Then find and highlight the new entry
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
        route: "Write your route (add any comment)",
        availableSpots: "Number of available spots",
        transport: "Type of transport (car, bus, taxi, etc.)",
        dateTime: "Write a date and approx hour (e.g., 1.9 around 11:00 am)",
        contact: "Your contact (preferably WhatsApp number)",
        dietaryRestrictions: "Diet/allergies (optional)"
      },
      es: {
        name: "Tu nombre",
        route: "Escribe tu ruta (añade cualquier comentario)",
        availableSpots: "Número de plazas disponibles",
        transport: "Tipo de transporte (coche, autobús, taxi, etc.)",
        dateTime: "Escribe una fecha y hora aproximada (ej., 1.9 sobre las 11:00 am)",
        contact: "Tu contacto (preferiblemente número de WhatsApp)",
        dietaryRestrictions: "Dieta/alergias (opcional)"
      }
    };
    
    return placeholders[language][field];
  };

  const successMessage = language === "es" 
    ? "¡Excelente! Desplázate hacia arriba para ver o editar tu plan de viaje."
    : "Great! Scroll up to see or edit your travel plan.";

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="bg-[#FFFFFF] max-w-2xl mx-auto rounded-lg">
      <div className="relative rounded-lg overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5 md:p-10 bg-[#FFFFFF] rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-700 text-left block">
                {language === "en" ? "Your name" : "Tu nombre"}
              </label>
              <button 
                type="button"
                onClick={handleToggleLanguage} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-xs"
              >
                <span className={language === "en" ? "font-bold" : "font-normal"}>EN</span>
                {" / "}
                <span className={language === "es" ? "font-bold" : "font-normal"}>ES</span>
              </button>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("name")}
                      className={`
                        focus:outline-none 
                        ${focusedField === "name" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                        focus-visible:ring-[#F97316]
                      `}
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
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
                  <FormLabel className="text-gray-700 text-left block">
                    {language === "en" ? "Route" : "Ruta"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={getPlaceholder("route")}
                      className={`
                        min-h-[100px] resize-none 
                        focus:outline-none 
                        ${focusedField === "route" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                        focus-visible:ring-[#F97316]
                      `}
                      onFocus={() => handleFocus("route")}
                      onBlur={handleBlur}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="availableSpots"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-gray-700 text-left block">
                      {language === "en" ? "Available spots" : "Plazas disponibles"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        placeholder={getPlaceholder("availableSpots")}
                        className={`
                          focus:outline-none 
                          ${focusedField === "availableSpots" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                          focus-visible:ring-[#F97316]
                        `}
                        onFocus={() => handleFocus("availableSpots")}
                        onBlur={handleBlur}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transport"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-gray-700 text-left block">
                      {language === "en" ? "Transport type" : "Tipo de transporte"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={getPlaceholder("transport")}
                        className={`
                          focus:outline-none 
                          ${focusedField === "transport" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                          focus-visible:ring-[#F97316]
                        `}
                        onFocus={() => handleFocus("transport")}
                        onBlur={handleBlur}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-left block">
                    {language === "en" ? "Date & time" : "Fecha y hora"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("dateTime")}
                      className={`
                        focus:outline-none 
                        ${focusedField === "dateTime" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                        focus-visible:ring-[#F97316]
                      `}
                      onFocus={() => handleFocus("dateTime")}
                      onBlur={handleBlur}
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
                  <FormLabel className="text-gray-700 text-left block">
                    {language === "en" ? "Contact" : "Contacto"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("contact")}
                      className={`
                        focus:outline-none 
                        ${focusedField === "contact" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                        focus-visible:ring-[#F97316]
                      `}
                      onFocus={() => handleFocus("contact")}
                      onBlur={handleBlur}
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
                  <FormLabel className="text-gray-700 text-left block">
                    {language === "en" ? "Diet/allergies" : "Dieta/alergias"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getPlaceholder("dietaryRestrictions")}
                      className={`
                        focus:outline-none 
                        ${focusedField === "dietaryRestrictions" ? "border-[#F97316] ring-[#F97316]" : "border-transparent"} 
                        focus-visible:ring-[#F97316]
                      `}
                      onFocus={() => handleFocus("dietaryRestrictions")}
                      onBlur={handleBlur}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end mt-6">
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
            <ChevronUp className="h-4 w-4 ml-1" />
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
