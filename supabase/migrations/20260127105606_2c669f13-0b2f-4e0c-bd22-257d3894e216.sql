-- Remove the existing CHECK constraint and allow any single letter group name
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_group_name_check;

-- Add a new constraint that allows letters A through Z
ALTER TABLE public.teams ADD CONSTRAINT teams_group_name_check CHECK (group_name ~ '^[A-Z]$');