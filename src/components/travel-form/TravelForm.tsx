
import { LanguageToggle } from "./components/LanguageToggle";
import { FormField } from "./components/FormField";
import { SuccessMessage } from "./components/SuccessMessage";
import { FormLayout } from "./components/FormLayout";
import { useFormPlaceholders } from "./hooks/useFormPlaceholders";
import { useTravelForm } from "./hooks/useTravelForm";
import { TravelFormProps } from "./types";

export const TravelForm = ({ projectId }: TravelFormProps) => {
  const {
    form,
    onSubmit,
    language,
    handleToggleLanguage,
    focusedField,
    handleFocus,
    handleBlur,
    success,
    getSuccessMessage
  } = useTravelForm(projectId);

  const getPlaceholder = useFormPlaceholders(language);

  return (
    <div className="bg-[#FFFFFF] max-w-2xl mx-auto rounded-xl">
      <div className="relative rounded-xl overflow-hidden">
        <FormLayout 
          form={form} 
          onSubmit={onSubmit} 
          submitLabel={language === "en" ? "Submit" : "Enviar"}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-gray-700 text-left block text-sm font-medium">
              {language === "en" ? "Your name" : "Tu nombre"}
            </label>
            <LanguageToggle language={language} onToggle={handleToggleLanguage} />
          </div>
          
          <FormField
            name="name"
            control={form.control}
            placeholder={getPlaceholder("name")}
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          <FormField
            name="route"
            control={form.control}
            label={language === "en" ? "Route" : "Ruta"}
            placeholder={getPlaceholder("route")}
            isTextarea={true}
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              name="availableSpots"
              control={form.control}
              label={language === "en" ? "Available spots" : "Plazas disponibles"}
              placeholder={getPlaceholder("availableSpots")}
              type="number"
              min="0"
              className="flex-1"
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            
            <FormField
              name="transport"
              control={form.control}
              label={language === "en" ? "Transport type" : "Tipo de transporte"}
              placeholder={getPlaceholder("transport")}
              className="flex-1"
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              name="dateTime"
              control={form.control}
              label={language === "en" ? "Date & time" : "Fecha y hora"}
              placeholder={getPlaceholder("dateTime")}
              className="flex-1"
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            
            <FormField
              name="contact"
              control={form.control}
              label={language === "en" ? "Contact" : "Contacto"}
              placeholder={getPlaceholder("contact")}
              className="flex-1"
              focusedField={focusedField}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          
          <FormField
            name="dietaryRestrictions"
            control={form.control}
            label={language === "en" ? "Diet/allergies" : "Dieta/alergias"}
            placeholder={getPlaceholder("dietaryRestrictions")}
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </FormLayout>
      </div>
      
      {success && <SuccessMessage message={getSuccessMessage()} />}
      
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
