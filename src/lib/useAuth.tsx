"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  role: string;
}

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndProfile = async () => {
      setLoading(true);

      // Récupérer l'utilisateur Supabase
      const {
        data: { user: supaUser },
      } = await supabase.auth.getUser();

      if (!supaUser) {
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(supaUser);

      // Récupère le profile depuis la table "profiles"
      const { data: profileData, error } = await supabase
        .from("profiles") // ❌ pas de <UserProfile>
        .select("*")
        .eq("id", supaUser.id)
        .single();

      const typedProfile = profileData as UserProfile | null;

      if (error) {
        console.error("Erreur récupération profile :", error.message);
        setProfile(null);
        setRole(null);
      } else if (typedProfile) {
        // ✅ utiliser setProfile ici
        setProfile(typedProfile);
        setRole(typedProfile.role);
      }

      // Logs pour debug
      console.log("User connecté :", supaUser);
      console.log("Profile récupéré :", typedProfile);
      console.log("Role récupéré :", typedProfile?.role);

      setLoading(false);
    };

    getUserAndProfile();

    // Abonnement aux changements de session
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          getUserAndProfile();
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, role, loading, isLoggedIn: !!user };
}