-- Add positioning fields to site_content table
ALTER TABLE public.site_content
ADD COLUMN position_x INTEGER DEFAULT NULL,
ADD COLUMN position_y INTEGER DEFAULT NULL,
ADD COLUMN position_width INTEGER DEFAULT NULL,
ADD COLUMN position_height INTEGER DEFAULT NULL,
ADD COLUMN position_z_index INTEGER DEFAULT 1,
ADD COLUMN is_positioned BOOLEAN DEFAULT false;

-- Add comment explaining the positioning system
COMMENT ON COLUMN public.site_content.position_x IS 'Horizontal position in pixels from left (for absolutely positioned elements)';
COMMENT ON COLUMN public.site_content.position_y IS 'Vertical position in pixels from top (for absolutely positioned elements)';
COMMENT ON COLUMN public.site_content.position_width IS 'Width in pixels for positioned elements';
COMMENT ON COLUMN public.site_content.position_height IS 'Height in pixels for positioned elements';
COMMENT ON COLUMN public.site_content.position_z_index IS 'Stacking order for positioned elements';
COMMENT ON COLUMN public.site_content.is_positioned IS 'Whether this element uses absolute positioning';