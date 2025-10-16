import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Trash2, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadContentImage } from "@/utils/siteContentUtils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FlowElement } from "./FlowElement";

interface FlowElementData {
  id: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  position_width: number;
  position_height: number;
  display_order: number;
}

interface VisualPreviewProps {
  page: string;
  onElementsChange: () => void;
}

export const VisualPreview = ({ page, onElementsChange }: VisualPreviewProps) => {
  const [elements, setElements] = useState<FlowElementData[]>([]);
  const [allElements, setAllElements] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadFlowElements();
    loadAllElements();
  }, [page]);

  const loadFlowElements = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page)
      .eq('is_positioned', true)
      .order('display_order');

    if (error) {
      console.error("Error loading flow elements:", error);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);

      const reorderedElements = arrayMove(elements, oldIndex, newIndex);
      setElements(reorderedElements);

      // Update display_order for all affected elements
      const updates = reorderedElements.map((el, index) => ({
        id: el.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('site_content')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast.success("Order updated");
      onElementsChange();
    }
  };

  const handleResize = async (elementId: string, width: number, height: number) => {
    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);
    
    // Update local state immediately for smooth resizing
    setElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? { ...el, position_width: roundedWidth, position_height: roundedHeight }
          : el
      )
    );

    // Debounced database update
    await supabase
      .from('site_content')
      .update({
        position_width: roundedWidth,
        position_height: roundedHeight,
      })
      .eq('id', elementId);

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
      
      // Get max display_order
      const maxOrder = elements.length > 0 
        ? Math.max(...elements.map(el => el.display_order || 0))
        : 0;
      
      // Create new flow element
      const { data, error } = await supabase
        .from('site_content')
        .insert({
          section_key: `flow_${type}_${Date.now()}`,
          section_label: `${type === 'image' ? 'Image' : 'Video'} Element`,
          page,
          content_type: type,
          content_value: url,
          published_value: url,
          is_published: true,
          is_positioned: true,
          position_width: 800,
          position_height: type === 'image' ? 450 : 450,
          display_order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;

      setElements(prev => [...prev, data as FlowElementData]);
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

      <div className="border-2 border-dashed rounded-lg bg-background p-4">
        {/* Background reference content */}
        <div className="mb-4 p-4 bg-muted/30 rounded border border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Page Content Preview (Read-only)</p>
          <div className="space-y-2 opacity-40">
            {allElements.filter(el => !el.is_positioned).map((el) => (
              <div key={el.id} className="p-2 border border-border/20 rounded text-xs">
                {el.section_label}
              </div>
            ))}
          </div>
        </div>

        {/* Flow elements editor */}
        <div className="relative min-h-[400px]">
          {elements.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Upload images or videos</p>
              <p className="text-xs mt-2">Elements will stack vertically and can be reordered by dragging</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={elements.map(el => el.id)}
                strategy={verticalListSortingStrategy}
              >
                {elements.map((element) => (
                  <FlowElement
                    key={element.id}
                    id={element.id}
                    section_label={element.section_label}
                    content_type={element.content_type}
                    content_value={element.content_value}
                    position_width={element.position_width}
                    position_height={element.position_height}
                    onDelete={handleDelete}
                    onResize={handleResize}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Elements stack vertically and push content below when resized. Drag the grip icon to reorder elements.
      </p>
    </Card>
  );
};
