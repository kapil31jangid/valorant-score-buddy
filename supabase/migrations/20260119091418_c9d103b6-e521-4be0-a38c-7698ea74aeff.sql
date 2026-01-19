-- Create teams table for Valorant tournament
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view the scoreboard)
CREATE POLICY "Anyone can view teams" 
ON public.teams 
FOR SELECT 
USING (true);

-- Create policy for public insert (for admin functionality - we'll add auth later if needed)
CREATE POLICY "Anyone can insert teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update
CREATE POLICY "Anyone can update teams" 
ON public.teams 
FOR UPDATE 
USING (true);

-- Create policy for public delete
CREATE POLICY "Anyone can delete teams" 
ON public.teams 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;