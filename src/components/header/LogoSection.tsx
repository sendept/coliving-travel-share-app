
interface LogoSectionProps {
  logoUrl: string;
}

export const LogoSection = ({ logoUrl }: LogoSectionProps) => {
  return (
    <div className="h-24 w-24 mx-auto mb-6 relative">
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt="Event logo" 
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};
