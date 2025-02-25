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
  default: "text-muted-foreground font-medium mb-5",
  minimal: "text-gray-400 font-light mb-5",
  elegant: "text-gray-700 mb-5"
};
const positionStyles = {
  top: "mt-2",
  center: "my-4",
  bottom: "mb-6"
};
const fontSizeStyles = {
  small: "text-sm md:text-base",
  medium: "text-base md:text-lg",
  large: "text-lg md:text-xl"
};
export const PageSubtitle = ({
  children,
  className,
  position = "top",
  fontSize = "medium",
  preset = "minimal"
}: PageSubtitleProps) => {
  return <div className="">
      {children}
    </div>;
};