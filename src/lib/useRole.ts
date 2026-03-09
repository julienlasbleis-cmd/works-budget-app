import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function useRole() {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.user.id)
        .single();

      setRole(data?.role ?? "user");
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}