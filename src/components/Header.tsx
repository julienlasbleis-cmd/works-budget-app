"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";

export default function Header() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirige vers la page de login
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Titre cliquable */}
      <h1
        onClick={goToDashboard}
        className="text-lg font-bold cursor-pointer hover:text-gray-300"
      >
        WorksBudget
      </h1>

      {isLoggedIn && (
        <div className="flex items-center space-x-4">
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}