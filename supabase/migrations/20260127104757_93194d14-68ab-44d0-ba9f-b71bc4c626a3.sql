-- Add group_name column to teams table for manual group assignment
ALTER TABLE public.teams 
ADD COLUMN group_name text DEFAULT 'A' CHECK (group_name IN ('A', 'B'));