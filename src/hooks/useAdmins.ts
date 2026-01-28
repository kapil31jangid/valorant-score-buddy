import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Admin {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      
      // Fetch all admin roles
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin");

      if (error) {
        console.error("Error fetching admin roles:", error);
        return;
      }

      // Get user emails from auth using the admin API
      // Since we can't directly query auth.users, we'll display user_ids
      // In a real app, you'd have a profiles table with emails
      const adminsWithInfo = roles?.map((role) => ({
        id: role.id,
        user_id: role.user_id,
        email: role.user_id, // Will be replaced if we have profile data
        created_at: role.created_at,
      })) || [];

      setAdmins(adminsWithInfo);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const removeAdmin = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) {
        console.error("Error removing admin:", error);
        return { error };
      }

      // Refresh the list
      await fetchAdmins();
      return { error: null };
    } catch (err) {
      console.error("Error removing admin:", err);
      return { error: err };
    }
  };

  return {
    admins,
    loading,
    removeAdmin,
    refetch: fetchAdmins,
  };
}
