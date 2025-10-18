-- Drop the existing foreign key constraint
ALTER TABLE public.results 
DROP CONSTRAINT IF EXISTS results_fixture_id_fkey;

-- Recreate the foreign key with ON DELETE SET NULL
-- This allows fixtures to be deleted after results are created
-- The fixture_id in results will be set to NULL when the fixture is deleted
ALTER TABLE public.results
ADD CONSTRAINT results_fixture_id_fkey 
FOREIGN KEY (fixture_id) 
REFERENCES public.fixtures(id) 
ON DELETE SET NULL;