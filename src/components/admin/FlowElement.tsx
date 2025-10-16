import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from 'react';

interface FlowElementProps {
  id: string;
  section_label: string;
  content_type: string;
  content_value: string;
  position_width: number;
  position_height: number;
  onDelete: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export const FlowElement = ({
  id,
  section_label,
  content_type,
  content_value,
  position_width,
  position_height,
  onDelete,
  onResize,
}: FlowElementProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isResizing, setIsResizing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = position_width;
    const startHeight = position_height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newWidth = Math.max(200, startWidth + deltaX);
      const newHeight = Math.max(150, startHeight + deltaY);
      
      // Update size in real-time during drag
      onResize(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border-2 border-yellow-500/50 hover:border-yellow-500 rounded-lg bg-background mb-4 mx-auto"
    >
      {/* Drag handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing bg-background/90 p-1 rounded z-10 hover:bg-accent"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Element label */}
      <div className="absolute top-2 left-12 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded z-10">
        {section_label}
      </div>

      {/* Delete button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="destructive"
          size="icon"
          className="h-7 w-7"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div 
        className="p-8"
        style={{
          width: `${position_width}px`,
          minHeight: `${position_height}px`,
        }}
      >
        {content_type === 'image' ? (
          <img
            src={content_value}
            alt={section_label}
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <video
            src={content_value}
            className="w-full h-full object-contain"
            controls
          />
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-2 right-2 w-6 h-6 bg-primary cursor-se-resize rounded-tl hover:bg-primary/80 z-10 flex items-center justify-center"
        onMouseDown={handleResize}
      >
        <div className="w-3 h-3 border-r-2 border-b-2 border-primary-foreground" />
      </div>

      {/* Size indicator */}
      <div className="absolute bottom-2 left-2 bg-background/90 text-xs px-2 py-1 rounded text-muted-foreground z-10">
        {position_width}×{position_height}px
      </div>
    </div>
  );
};
