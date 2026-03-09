"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";
import { CSVLink } from "react-csv";

interface BudgetItem {
  id: string;
  zone: string;
  objet: string;
  achevement: string;
  budget_alloue: number;
  budget_previsionnel: number;
  depenses_engagees: number;
  commentaire: string;
}

export default function BudgetPage() {
  const { isLoggedIn, loading } = useAuth();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);

      const { data, error } = await supabase
        .from<"budget_items", BudgetItem>("budget_items")
        .select("*")
        .order("zone", { ascending: true });

      if (!error && data) setItems(data);
      else if (error) console.error(error);

      setLoadingItems(false);
    };

    fetchItems();
  }, []);

  if (loading || loadingItems) return <p>Chargement...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Suivi Budget</h1>

      <CSVLink
        data={items}
        filename="budget_export.csv"
        style={{
          marginBottom: 10,
          display: "inline-block",
          padding: "6px 12px",
          background: "#007bff",
          color: "white",
          borderRadius: 4,
          textDecoration: "none",
        }}
      >
        Export .csv
      </CSVLink>

      <table width="100%" cellPadding={12} style={{ borderCollapse: "collapse" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Zone</th>
            <th>Objet</th>
            <th>Achèvement</th>
            <th>Budget Alloué (€)</th>
            <th>Budget Prévisionnel (€)</th>
            <th>Dépenses Engagées (€)</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{item.zone}</td>
              <td>{item.objet}</td>
              <td>{item.achevement}</td>
              <td>{item.budget_alloue}</td>
              <td>{item.budget_previsionnel}</td>
              <td>{item.depenses_engagees}</td>
              <td>{item.commentaire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}