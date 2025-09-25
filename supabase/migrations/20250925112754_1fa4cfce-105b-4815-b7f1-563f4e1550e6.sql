-- Update the app_role enum to include the new role levels
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('website_overlord', 'admin', 'user', 'lottery_admin');

-- Recreate user_roles table with updated enum
DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION public.is_website_overlord(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(_user_id, 'website_overlord')
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'website_overlord')
$$;

CREATE OR REPLACE FUNCTION public.is_user_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(_user_id, 'user') OR public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'website_overlord')
$$;

CREATE OR REPLACE FUNCTION public.is_lottery_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(_user_id, 'lottery_admin') OR public.has_role(_user_id, 'website_overlord')
$$;

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Website overlords can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_website_overlord(auth.uid()));

-- Insert the initial website overlord role for jay@germanexilesrl.co.uk
-- First we need to ensure the user exists, but we can't create auth users directly
-- The website overlord will need to sign up first, then we'll assign the role

-- Function to promote a user to website overlord (can only be called once)
CREATE OR REPLACE FUNCTION public.create_first_website_overlord(_user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
  overlord_count INTEGER;
BEGIN
  -- Check if any website overlords already exist
  SELECT COUNT(*) INTO overlord_count
  FROM public.user_roles
  WHERE role = 'website_overlord';
  
  -- Only allow this if no website overlords exist yet
  IF overlord_count > 0 THEN
    RAISE EXCEPTION 'Website overlord already exists. Use promote_user function instead.';
  END IF;
  
  -- Find the user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _user_email;
  END IF;
  
  -- Insert website overlord role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'website_overlord')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Function for website overlords to promote users
CREATE OR REPLACE FUNCTION public.promote_user(_user_email text, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Check if the caller is a website overlord
  IF NOT public.is_website_overlord(auth.uid()) THEN
    RAISE EXCEPTION 'Only website overlords can promote users';
  END IF;
  
  -- Find the user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _user_email;
  END IF;
  
  -- Insert the role (will be ignored if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;