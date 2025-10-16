import { ReactNode } from "react";
import { PositionedElements } from "./PositionedElements";

interface PageWithPositionedElementsProps {
  page: string;
  children: ReactNode;
  className?: string;
}

export const PageWithPositionedElements = ({ 
  page, 
  children, 
  className = "pt-16 min-h-screen bg-black" 
}: PageWithPositionedElementsProps) => {
  return (
    <div className={`relative ${className}`}>
      <PositionedElements page={page} />
      {children}
    </div>
  );
};
