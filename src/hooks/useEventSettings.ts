import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEventSettings() {
  const [isEventActive, setIsEventActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventStatus();
  }, []);

  const fetchEventStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "event_active")
        .single();

      if (error) {
        console.error("Error fetching event status:", error);
        setIsEventActive(false);
      } else {
        const value = data?.value as { active: boolean } | null;
        setIsEventActive(value?.active ?? false);
      }
    } catch (err) {
      console.error("Error fetching event status:", err);
      setIsEventActive(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventStatus = async () => {
    const newStatus = !isEventActive;
    
    const { error } = await supabase
      .from("app_settings")
      .update({ value: { active: newStatus } })
      .eq("key", "event_active");

    if (error) {
      console.error("Error updating event status:", error);
      return { error };
    }

    setIsEventActive(newStatus);
    return { error: null };
  };

  return {
    isEventActive,
    loading,
    toggleEventStatus,
    refetch: fetchEventStatus,
  };
}
