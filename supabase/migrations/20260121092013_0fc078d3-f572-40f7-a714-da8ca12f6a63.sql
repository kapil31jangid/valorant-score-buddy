-- Create function to update team stats when a match is inserted
CREATE OR REPLACE FUNCTION public.update_team_stats_on_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update team1 stats
  IF NEW.team1_score > NEW.team2_score THEN
    -- Team1 wins
    UPDATE public.teams 
    SET wins = wins + 1, points = points + 3
    WHERE id = NEW.team1_id;
    -- Team2 loses
    UPDATE public.teams 
    SET losses = losses + 1
    WHERE id = NEW.team2_id;
  ELSIF NEW.team2_score > NEW.team1_score THEN
    -- Team2 wins
    UPDATE public.teams 
    SET wins = wins + 1, points = points + 3
    WHERE id = NEW.team2_id;
    -- Team1 loses
    UPDATE public.teams 
    SET losses = losses + 1
    WHERE id = NEW.team1_id;
  ELSE
    -- Draw: both teams get 1 point
    UPDATE public.teams 
    SET points = points + 1
    WHERE id IN (NEW.team1_id, NEW.team2_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create function to revert team stats when a match is deleted
CREATE OR REPLACE FUNCTION public.revert_team_stats_on_match_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Revert team1 stats
  IF OLD.team1_score > OLD.team2_score THEN
    -- Team1 had won
    UPDATE public.teams 
    SET wins = GREATEST(wins - 1, 0), points = GREATEST(points - 3, 0)
    WHERE id = OLD.team1_id;
    -- Team2 had lost
    UPDATE public.teams 
    SET losses = GREATEST(losses - 1, 0)
    WHERE id = OLD.team2_id;
  ELSIF OLD.team2_score > OLD.team1_score THEN
    -- Team2 had won
    UPDATE public.teams 
    SET wins = GREATEST(wins - 1, 0), points = GREATEST(points - 3, 0)
    WHERE id = OLD.team2_id;
    -- Team1 had lost
    UPDATE public.teams 
    SET losses = GREATEST(losses - 1, 0)
    WHERE id = OLD.team1_id;
  ELSE
    -- Was a draw
    UPDATE public.teams 
    SET points = GREATEST(points - 1, 0)
    WHERE id IN (OLD.team1_id, OLD.team2_id);
  END IF;
  
  RETURN OLD;
END;
$$;

-- Create trigger for match insert
CREATE TRIGGER on_match_insert
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_stats_on_match();

-- Create trigger for match delete
CREATE TRIGGER on_match_delete
  AFTER DELETE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.revert_team_stats_on_match_delete();