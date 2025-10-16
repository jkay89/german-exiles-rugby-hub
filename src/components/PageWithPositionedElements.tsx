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
      {/* 1440px max-width container for consistent positioning with visual editor */}
      <div className="relative mx-auto" style={{ maxWidth: '1440px' }}>
        <PositionedElements page={page} />
      </div>
      {children}
    </div>
  );
};
