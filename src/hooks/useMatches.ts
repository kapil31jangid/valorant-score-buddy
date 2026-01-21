import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  map_name: string | null;
  played_at: string;
  created_at: string;
  team1?: { id: string; name: string; logo_url: string | null };
  team2?: { id: string; name: string; logo_url: string | null };
}

export interface MatchInsert {
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  map_name?: string;
  played_at?: string;
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(id, name, logo_url),
          team2:teams!matches_team2_id_fkey(id, name, logo_url)
        `)
        .order('played_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching matches',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async (match: MatchInsert) => {
    try {
      const { error } = await supabase.from('matches').insert([match]);
      if (error) throw error;
      toast({
        title: 'Match added',
        description: 'Match has been recorded successfully.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error adding match',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: 'Match deleted',
        description: 'Match has been removed.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting match',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { matches, loading, addMatch, deleteMatch, refetch: fetchMatches };
}
