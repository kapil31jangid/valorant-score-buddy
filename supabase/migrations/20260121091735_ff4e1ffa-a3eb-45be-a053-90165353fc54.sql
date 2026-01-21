-- Create matches table for match history
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team1_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  team2_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  team1_score INTEGER NOT NULL DEFAULT 0,
  team2_score INTEGER NOT NULL DEFAULT 0,
  map_name TEXT,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_teams CHECK (team1_id != team2_id)
);

-- Enable Row Level Security
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches
CREATE POLICY "Anyone can view matches"
ON public.matches
FOR SELECT
USING (true);

-- Only admins can insert matches
CREATE POLICY "Admins can insert matches"
ON public.matches
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update matches
CREATE POLICY "Admins can update matches"
ON public.matches
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete matches
CREATE POLICY "Admins can delete matches"
ON public.matches
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for matches
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;