"use client";

import Link from "next/link";
import useAuth from "@/lib/useAuth";

export default function Navbar() {
  const { isLoggedIn, user } = useAuth();

  const isAdmin = user?.user_metadata?.role === "admin";

  return (
    <nav style={{
      padding: "15px",
      background: "#111",
      color: "white",
      display: "flex",
      gap: "20px"
    }}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/budget">Budget</Link>
      <Link href="/dashboard/graphique">Statistiques</Link>
      {isAdmin && <Link href="/dashboard/users">Utilisateurs</Link>}
    </nav>
  );
}