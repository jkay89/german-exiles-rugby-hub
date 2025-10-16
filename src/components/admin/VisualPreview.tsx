import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Maximize2, Move, Trash2, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadContentImage } from "@/utils/siteContentUtils";

interface PositionedElement {
  id: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  position_x: number;
  position_y: number;
  position_width: number;
  position_height: number;
  position_z_index: number;
}

interface VisualPreviewProps {
  page: string;
  onElementsChange: () => void;
}

export const VisualPreview = ({ page, onElementsChange }: VisualPreviewProps) => {
  const [elements, setElements] = useState<PositionedElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPositionedElements();
  }, [page]);

  const loadPositionedElements = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page)
      .eq('is_positioned', true)
      .order('position_z_index');

    if (error) {
      console.error("Error loading positioned elements:", error);
      return;
    }

    setElements(data || []);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(elementId);
    setSelectedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - container.left - dragOffset.x;
    const newY = e.clientY - container.top - dragOffset.y;

    setElements(prev =>
      prev.map(el =>
        el.id === dragging
          ? { ...el, position_x: Math.max(0, newX), position_y: Math.max(0, newY) }
          : el
      )
    );
  };

  const handleMouseUp = async () => {
    if (!dragging) return;

    const element = elements.find(el => el.id === dragging);
    if (element) {
      await supabase
        .from('site_content')
        .update({
          position_x: element.position_x,
          position_y: element.position_y,
        })
        .eq('id', element.id);

      toast.success("Position updated");
    }

    setDragging(null);
  };

  const handleResize = async (elementId: string, width: number, height: number) => {
    await supabase
      .from('site_content')
      .update({
        position_width: width,
        position_height: height,
      })
      .eq('id', elementId);

    setElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? { ...el, position_width: width, position_height: height }
          : el
      )
    );

    toast.success("Size updated");
    onElementsChange();
  };

  const handleDelete = async (elementId: string) => {
    await supabase
      .from('site_content')
      .delete()
      .eq('id', elementId);

    setElements(prev => prev.filter(el => el.id !== elementId));
    toast.success("Element deleted");
    onElementsChange();
  };

  const handleUpload = async (type: 'image' | 'video', file: File) => {
    setUploading(true);
    try {
      const url = await uploadContentImage(file);
      
      // Create new positioned element
      const { data, error } = await supabase
        .from('site_content')
        .insert({
          section_key: `positioned_${type}_${Date.now()}`,
          section_label: `${type === 'image' ? 'Image' : 'Video'} Element`,
          page,
          content_type: type,
          content_value: url,
          published_value: url,
          is_published: true,
          is_positioned: true,
          position_x: 100,
          position_y: 100,
          position_width: 300,
          position_height: type === 'image' ? 200 : 169,
          position_z_index: elements.length + 1,
          display_order: 999,
        })
        .select()
        .single();

      if (error) throw error;

      setElements(prev => [...prev, data as PositionedElement]);
      toast.success(`${type === 'image' ? 'Image' : 'Video'} added`);
      onElementsChange();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add Image
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload('image', file);
          }}
        />
        
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('video-upload')?.click()}
        >
          <Video className="h-4 w-4 mr-2" />
          Add Video
        </Button>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload('video', file);
          }}
        />
      </div>

      <div
        ref={containerRef}
        className="relative border-2 border-dashed rounded-lg bg-muted/10 overflow-hidden"
        style={{ minHeight: '600px', height: '600px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Nav bar placeholder to show where it will be on live site */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/50 border-b-2 border-primary/50 pointer-events-none z-[100] flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Navigation Bar Area (64px)</span>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm" style={{ paddingTop: '64px' }}>
          {elements.length === 0 ? (
            <div className="text-center">
              <Move className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Upload images or videos and drag them to position</p>
            </div>
          ) : (
            <div className="absolute inset-0" />
          )}
        </div>

        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move group ${
              selectedElement === element.id ? 'ring-2 ring-primary' : ''
            }`}
            style={{
              left: `${element.position_x}px`,
              top: `${element.position_y}px`,
              width: `${element.position_width}px`,
              height: `${element.position_height}px`,
              zIndex: element.position_z_index,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.content_type === 'image' ? (
              <img
                src={element.content_value}
                alt={element.section_label}
                className="w-full h-full object-cover rounded border-2 border-border"
                draggable={false}
              />
            ) : (
              <video
                src={element.content_value}
                className="w-full h-full object-cover rounded border-2 border-border"
                controls
              />
            )}

            {selectedElement === element.id && (
              <div className="absolute top-0 right-0 flex gap-1 p-1 bg-background border rounded-bl">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDelete(element.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            {selectedElement === element.id && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startWidth = element.position_width;
                  const startHeight = element.position_height;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    const newWidth = Math.max(100, startWidth + deltaX);
                    const newHeight = Math.max(100, startHeight + deltaY);

                    setElements(prev =>
                      prev.map(el =>
                        el.id === element.id
                          ? { ...el, position_width: newWidth, position_height: newHeight }
                          : el
                      )
                    );
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    handleResize(element.id, element.position_width, element.position_height);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Click to select, drag to move, use bottom-right corner to resize
      </p>
    </Card>
  );
};
