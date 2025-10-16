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
  const [allElements, setAllElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPositionedElements();
    loadAllElements();
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

  const loadAllElements = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page)
      .eq('is_published', true)
      .order('display_order');

    if (error) {
      console.error("Error loading all elements:", error);
      return;
    }

    setAllElements(data || []);
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
          ? { ...el, position_x: Math.round(Math.max(0, newX)), position_y: Math.round(Math.max(64, newY)) }
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
          position_x: Math.round(element.position_x),
          position_y: Math.round(element.position_y),
        })
        .eq('id', element.id);

      toast.success("Position updated");
    }

    setDragging(null);
  };

  const handleResize = async (elementId: string, width: number, height: number) => {
    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);
    
    await supabase
      .from('site_content')
      .update({
        position_width: roundedWidth,
        position_height: roundedHeight,
      })
      .eq('id', elementId);

    setElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? { ...el, position_width: roundedWidth, position_height: roundedHeight }
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
          position_y: 150,
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
        className="relative border-2 border-dashed rounded-lg bg-background overflow-auto"
        style={{ minHeight: '600px', height: '600px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background: Show all page elements as reference */}
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <div className="min-h-screen bg-background">
            {allElements.map((el) => (
              <div key={el.id} className="p-4 border-b border-border/20">
                <div className="text-xs text-muted-foreground mb-1">{el.section_label}</div>
                {el.content_type === 'text' && (
                  <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: el.published_value || el.content_value }} />
                )}
                {el.content_type === 'image' && el.content_value && (
                  <img src={el.content_value} alt={el.section_label} className="max-w-full h-auto" />
                )}
                {el.content_type === 'video' && el.content_value && (
                  <video src={el.content_value} className="max-w-full h-auto" controls />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nav bar placeholder to show where it will be on live site */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 border-b-2 border-primary/50 pointer-events-none z-[100] flex items-center justify-center">
          <span className="text-xs text-white/70">Navigation Bar Area (64px)</span>
        </div>
        
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
            <div className="text-center bg-background/90 p-4 rounded-lg">
              <Move className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Upload images or videos and drag them to position over the page preview</p>
            </div>
          </div>
        )}

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
                className="w-full h-full object-contain rounded border-2 border-border"
                draggable={false}
              />
            ) : (
              <video
                src={element.content_value}
                className="w-full h-full object-contain rounded border-2 border-border"
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
                  let finalWidth = startWidth;
                  let finalHeight = startHeight;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    finalWidth = Math.max(100, startWidth + deltaX);
                    finalHeight = Math.max(100, startHeight + deltaY);

                    setElements(prev =>
                      prev.map(el =>
                        el.id === element.id
                          ? { ...el, position_width: finalWidth, position_height: finalHeight }
                          : el
                      )
                    );
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    handleResize(element.id, finalWidth, finalHeight);
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
