"use client";

import { useEffect, useState } from "react";
import useAuth from "@/lib/useAuth";
import { supabase } from "@/lib/supabaseClient";

type ListType = "zones" | "objets" | "achevements";

interface ListItem {
  id: string;
  name: string;
}

export default function AdminListsPage() {
  const { isLoggedIn, loading, role } = useAuth();
  const [listType, setListType] = useState<ListType>("zones");
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItem, setNewItem] = useState("");

  // redirection si non connecté ou pas admin
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || role !== "admin") window.location.href = "/dashboard";
    }
  }, [isLoggedIn, loading, role]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from(listType)
      .select("*")
      .order("name", { ascending: true });
    if (!error && data) setItems(data);
  };

  useEffect(() => {
    if (!loading && role === "admin") fetchItems();
  }, [listType, loading, role]);

  const addItem = async () => {
    if (!newItem) return;
    const { error } = await supabase.from(listType).insert([{ name: newItem }]);
    if (!error) {
      setNewItem("");
      fetchItems();
    } else {
      alert("Erreur ajout : " + error.message);
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from(listType).delete().eq("id", id);
    if (!error) fetchItems();
    else alert("Erreur suppression : " + error.message);
  };

  if (!isLoggedIn || loading || role !== "admin") return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin – Gestion des listes</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Liste à afficher :</label>
        <select
          value={listType}
          onChange={(e) => setListType(e.target.value as ListType)}
          className="border p-1 rounded"
        >
          <option value="zones">Zones</option>
          <option value="objets">Objets</option>
          <option value="achevements">Achèvements</option>
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Nouvelle valeur"
          className="border p-1 rounded flex-1"
        />
        <button
          onClick={addItem}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Ajouter
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td className="border p-2">{i.name}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteItem(i.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}