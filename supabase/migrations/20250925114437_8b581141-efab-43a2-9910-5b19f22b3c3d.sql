-- Fix RLS policy on user_roles table to allow authenticated users to check for their own roles
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a new policy that allows authenticated users to check for their own roles
-- This allows users to see if they have any roles, even if they don't have one yet
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());