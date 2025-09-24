-- Add missing random_org_signature column to lottery_draws table
ALTER TABLE public.lottery_draws 
ADD COLUMN random_org_signature TEXT;