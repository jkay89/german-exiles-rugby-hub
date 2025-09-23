-- Add RLS policy for admins to view all lottery entries
CREATE POLICY "Admins can view all lottery entries" 
ON public.lottery_entries 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Add RLS policy for admins to manage all lottery entries  
CREATE POLICY "Admins can manage all lottery entries" 
ON public.lottery_entries 
FOR ALL 
USING (public.is_admin(auth.uid()));