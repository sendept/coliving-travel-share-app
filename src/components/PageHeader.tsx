
import { getTranslation } from "@/lib/translations";

export const PageHeader = () => {
  return (
    <div className="space-y-4">
      <div className="h-16 w-16 mx-auto mb-6">
        {/* Placeholder for event logo */}
        <div className="w-full h-full rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-sm text-gray-400">Logo</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{getTranslation('title', 'en')}</h1>
        <p className="text-2xl font-light text-muted-foreground">{getTranslation('subtitle', 'es')}</p>
      </div>
    </div>
  );
};
