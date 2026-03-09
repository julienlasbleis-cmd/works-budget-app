"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD0", "#FF6384"];

export default function DashboardStats() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("Toutes");
  const [loading, setLoading] = useState(true);

  // Totaux
  const totalAlloue = items.reduce((sum, i) => sum + (i.budget_alloue || 0), 0);
  const totalPrevisionnel = items.reduce((sum, i) => sum + (i.budget_previsionnel || 0), 0);
  const totalDepenses = items.reduce((sum, i) => sum + (i.depenses_engagees || 0), 0);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      // ✅ Supabase v2 : deux types génériques
      const { data, error } = await supabase
        .from<"budget_items", BudgetItem>("budget_items")
        .select("*");

      if (!error && data) {
        setItems(data);

        // Extraire les zones uniques
        const uniqueZones = Array.from(new Set(data.map(i => i.zone).filter(Boolean))).sort();
        setZones(["Toutes", ...uniqueZones]);
      } else if (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) return <p>Chargement...</p>;

  // Filtrage par zone
  const filteredItems = selectedZone === "Toutes"
    ? items
    : items.filter(i => i.zone === selectedZone);

  // Pie Chart : Dépenses par objet
  const pieData = filteredItems
    .reduce<Record<string, number>>((acc, i) => {
      acc[i.objet] = (acc[i.objet] || 0) + (i.depenses_engagees || 0);
      return acc;
    }, {});
  const pieChartData = Object.entries(pieData).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 space-y-6">

      <h1 className="text-2xl font-bold mb-6 text-center">Statistiques Budget</h1>

      <div className="flex items-center gap-2">
        <label className="font-medium">Filtrer par zone :</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border rounded p-1"
        >
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      {/* Pie Chart */}
      <div className="flex-1 border p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-center mb-2">
          Dépenses engagées par objet
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
<Tooltip
  formatter={(value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
    } else if (typeof value === "string") {
      const num = parseFloat(value);
      if (!isNaN(num))
        return num.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
      return value;
    }
    return "";
  }}
/>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}