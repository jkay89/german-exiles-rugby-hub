import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PositionedElement {
  id: string;
  content_type: string;
  content_value: string;
  published_value: string;
  position_x: number;
  position_y: number;
  position_width: number;
  position_height: number;
  position_z_index: number;
  section_label: string;
}

interface PositionedElementsProps {
  page: string;
}

export const PositionedElements = ({ page }: PositionedElementsProps) => {
  const [elements, setElements] = useState<PositionedElement[]>([]);

  useEffect(() => {
    loadElements();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('positioned-elements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: `page=eq.${page},is_positioned=eq.true`,
        },
        () => {
          loadElements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page]);

  const loadElements = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page)
      .eq('is_positioned', true)
      .eq('is_published', true)
      .order('position_z_index');

    if (error) {
      console.error("Error loading positioned elements:", error);
      return;
    }

    setElements(data || []);
  };

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${element.position_x}px`,
            top: `${element.position_y}px`,
            width: `${element.position_width}px`,
            height: `${element.position_height}px`,
            zIndex: element.position_z_index,
          }}
        >
          {element.content_type === 'image' ? (
            <img
              src={element.published_value || element.content_value}
              alt={element.section_label}
              className="w-full h-full object-cover rounded shadow-lg"
              draggable={false}
            />
          ) : element.content_type === 'video' ? (
            <video
              src={element.published_value || element.content_value}
              className="w-full h-full object-cover rounded shadow-lg"
              controls
              playsInline
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
