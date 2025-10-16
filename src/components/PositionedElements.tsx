import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FlowElement {
  id: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  published_value: string;
  position_width: number;
  position_height: number;
  display_order: number;
}

interface PositionedElementsProps {
  page: string;
}

export const PositionedElements = ({ page }: PositionedElementsProps) => {
  const [elements, setElements] = useState<FlowElement[]>([]);

  useEffect(() => {
    loadElements();

    const channel = supabase
      .channel(`site_content_flow_${page}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: `page=eq.${page}`,
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
      .order('display_order');

    if (error) {
      console.error("Error loading flow elements:", error);
      return;
    }

    setElements(data || []);
  };

  if (elements.length === 0) return null;

  return (
    <div className="w-full space-y-6 py-8">
      {elements.map((element) => (
        <div
          key={element.id}
          className="mx-auto"
          style={{
            width: `${element.position_width}px`,
            minHeight: `${element.position_height}px`,
            maxWidth: '100%',
          }}
        >
          {element.content_type === 'image' ? (
            <img
              src={element.published_value || element.content_value}
              alt={element.section_label}
              className="w-full h-full object-contain"
            />
          ) : element.content_type === 'video' ? (
            <video
              src={element.published_value || element.content_value}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
