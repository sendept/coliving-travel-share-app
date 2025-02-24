
import React from "react";
import { cn } from "@/lib/utils";

interface PageSubtitleProps {
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "center";
  fontSize?: "small" | "medium" | "large";
  preset?: "default" | "minimal" | "elegant";
}

const presetStyles = {
  default: "text-muted-foreground",
  minimal: "text-gray-600 font-light",
  elegant: "text-gray-700 italic",
};

const positionStyles = {
  top: "mt-2",
  center: "my-4",
  bottom: "mb-6",
};

const fontSizeStyles = {
  small: "text-sm md:text-base",
  medium: "text-base md:text-lg",
  large: "text-lg md:text-xl",
};

export const PageSubtitle = ({
  children,
  className,
  position = "top",
  fontSize = "medium",
  preset = "default",
}: PageSubtitleProps) => {
  return (
    <div
      className={cn(
        "mx-auto text-center max-w-[700px] min-w-[350px] px-4",
        "font-playfair leading-relaxed",
        positionStyles[position],
        fontSizeStyles[fontSize],
        presetStyles[preset],
        className
      )}
    >
      {children}
    </div>
  );
};
