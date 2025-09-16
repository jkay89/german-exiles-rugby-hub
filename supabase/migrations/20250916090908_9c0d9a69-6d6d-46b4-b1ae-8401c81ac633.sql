-- Create committee_members table
CREATE TABLE public.committee_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contact_email TEXT,
  contact_number TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- Create policies for committee_members
CREATE POLICY "Anyone can view committee members" 
ON public.committee_members 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage committee members" 
ON public.committee_members 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- constitution, code_of_conduct, minutes, agm_minutes, general
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Anyone can view documents" 
ON public.documents 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage documents" 
ON public.documents 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create coaching_staff table (replacing the static staff data)
CREATE TABLE public.coaching_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contact_email TEXT,
  contact_number TEXT,
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coaching_staff ENABLE ROW LEVEL SECURITY;

-- Create policies for coaching_staff
CREATE POLICY "Anyone can view coaching staff" 
ON public.coaching_staff 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage coaching staff" 
ON public.coaching_staff 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Add sponsor information to players table for Exiles 9s
ALTER TABLE public.players 
ADD COLUMN sponsor_name TEXT,
ADD COLUMN sponsor_logo_url TEXT;

-- Create team_sponsors table for managing team sponsors
CREATE TABLE public.team_sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team TEXT NOT NULL, -- 'exiles9s', 'heritage', 'community', etc.
  sponsor_name TEXT NOT NULL,
  sponsor_logo_url TEXT,
  sponsor_website TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_sponsors ENABLE ROW LEVEL SECURITY;

-- Create policies for team_sponsors
CREATE POLICY "Anyone can view team sponsors" 
ON public.team_sponsors 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage team sponsors" 
ON public.team_sponsors 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_committee_members_updated_at
BEFORE UPDATE ON public.committee_members
FOR EACH ROW
EXECUTE FUNCTION public.update_player_stats_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_player_stats_updated_at();

CREATE TRIGGER update_coaching_staff_updated_at
BEFORE UPDATE ON public.coaching_staff
FOR EACH ROW
EXECUTE FUNCTION public.update_player_stats_updated_at();

CREATE TRIGGER update_team_sponsors_updated_at
BEFORE UPDATE ON public.team_sponsors
FOR EACH ROW
EXECUTE FUNCTION public.update_player_stats_updated_at();

-- Insert initial coaching staff data
INSERT INTO public.coaching_staff (name, role) VALUES
('Iain Bowie', 'Head Coach'),
('Kieron Billsborough', 'Assistant Coach'),
('Conrad Tetley', 'Assistant Coach'),
('Tom Hughes', 'Head Physio');