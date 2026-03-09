"use client";

import { useEffect } from "react";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isLoggedIn, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (role !== "admin") {
        router.push("/dashboard"); // redirige si pas admin
      }
    }
  }, [isLoggedIn, loading, role, router]);

  if (loading || !role) return <p>Chargement...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Administration</h1>

      <ul className="space-y-2">
        <li className="border p-3 rounded hover:bg-gray-100 cursor-pointer">
          👥 Gestion des utilisateurs
        </li>
        <li className="border p-3 rounded hover:bg-gray-100 cursor-pointer">
          📋 Gestion des listes (Zones / Objets / Achèvements)
        </li>
        <li className="border p-3 rounded hover:bg-gray-100 cursor-pointer">
          📥 Imports en masse
        </li>
      </ul>
    </div>
  );
}