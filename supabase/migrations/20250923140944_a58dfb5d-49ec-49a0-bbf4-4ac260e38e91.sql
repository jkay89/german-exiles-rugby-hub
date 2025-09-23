-- Manually assign admin role to the first admin user
-- Replace 'your-admin-email@example.com' with your actual email
-- This is needed to bootstrap the admin system since no other admin exists yet

-- First, create a function that can be called without admin permissions for initial setup
CREATE OR REPLACE FUNCTION public.create_first_admin(_user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  admin_count INTEGER;
BEGIN
  -- Check if any admins already exist
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  -- Only allow this if no admins exist yet
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Use promote_to_admin function instead.';
  END IF;
  
  -- Find the user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _user_email;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Example: Uncomment and modify the line below with your email to create the first admin
-- SELECT public.create_first_admin('your-admin-email@example.com');