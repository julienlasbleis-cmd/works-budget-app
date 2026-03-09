"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, loading, router]);

  const handleLogin = async () => {
    setError(null);
    setLoadingLogin(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoadingLogin(false);
      return;
    }

    // Redirection vers le dashboard
    router.push("/dashboard");
  };

  if (loading || isLoggedIn) {
    return <p className="text-center mt-20">Chargement...</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4 text-center">Connexion</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loadingLogin}
          className={`w-full text-white py-2 rounded ${
            loadingLogin ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loadingLogin ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </main>
  );
}