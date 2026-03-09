"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: { role?: string };
}

export default function UsersPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.user_metadata?.role === "admin";

const fetchUsers = async () => {
  setLoadingUsers(true);
  try {
    // Supprime le type générique
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("email", { ascending: true });

    if (error) throw error;

    // cast des données pour TypeScript
    setUsers((data as User[]) || []);
  } catch (err: any) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoadingUsers(false);
  }
};

  useEffect(() => {
    if (isLoggedIn && isAdmin) fetchUsers();
  }, [isLoggedIn, isAdmin]);

  const createUser = async () => {
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setEmail("");
      setPassword("");
      setRole("user");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    try {
      await fetch("/api/users", {
        method: "DELETE",
        body: JSON.stringify({ id: selectedUser }),
      });
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const updateRole = async (id: string, role: string) => {
    try {
      await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ id, role }),
      });
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;
  if (!isAdmin) return <p style={{ padding: 20 }}>Accès réservé aux admins</p>;

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Gestion des utilisateurs</h1>

      {/* FORMULAIRE CREATION */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
          marginBottom: 30,
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Créer un utilisateur</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />

          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={createUser}
            style={{
              padding: "8px 16px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Créer
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>

      {/* TABLEAU UTILISATEURS */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 15,
            background: "#111",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Utilisateurs</span>

          <button
            onClick={deleteUser}
            style={{
              background: "#e63946",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Supprimer sélection
          </button>
        </div>

        {loadingUsers ? (
          <p style={{ padding: 20 }}>Chargement...</p>
        ) : (
          <table width="100%" cellPadding={12}>
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th></th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Créé le</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>
                    <input
                      type="radio"
                      name="selectedUser"
                      onChange={() => setSelectedUser(u.id)}
                    />
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <select
                      value={u.user_metadata?.role || "user"}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      style={{ padding: 5 }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}