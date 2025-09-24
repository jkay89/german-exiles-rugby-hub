-- Update RLS policies for fixtures and results to allow public read access
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable all for authenticated users only" ON public.fixtures;
DROP POLICY IF EXISTS "Enable all for authenticated users only" ON public.results;

-- Create new policies that allow public read access but require auth for modifications
CREATE POLICY "Anyone can view fixtures" 
ON public.fixtures 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage fixtures" 
ON public.fixtures 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view results" 
ON public.results 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage results" 
ON public.results 
FOR ALL 
USING (auth.role() = 'authenticated');