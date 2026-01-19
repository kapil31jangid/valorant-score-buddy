import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("points", { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching teams",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (team: Omit<Team, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .insert([team])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Team added!",
        description: `${team.name} has been added to the tournament.`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error adding team",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Team updated!",
        description: "The team information has been updated.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error updating team",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Team removed",
        description: "The team has been removed from the tournament.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting team",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    fetchTeams();

    const channel = supabase
      .channel("teams-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    teams,
    loading,
    addTeam,
    updateTeam,
    deleteTeam,
    refetch: fetchTeams,
  };
}
