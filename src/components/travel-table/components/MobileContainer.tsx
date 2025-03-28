
import React from "react";

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer = ({ children }: MobileContainerProps) => {
  return (
    <div className="md:hidden bg-white rounded-none overflow-hidden shadow-sm">
      {children}
    </div>
  );
};
