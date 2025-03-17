
import { useState } from "react";

interface LanguageToggleProps {
  language: "en" | "es";
  onToggle: () => void;
}

export const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  return (
    <button 
      type="button"
      onClick={onToggle} 
      className="text-gray-500 hover:text-gray-700 focus:outline-none text-xs ml-2"
    >
      <span className={language === "en" ? "font-bold" : "font-normal"}>EN</span>
      {" / "}
      <span className={language === "es" ? "font-bold" : "font-normal"}>ES</span>
    </button>
  );
};
