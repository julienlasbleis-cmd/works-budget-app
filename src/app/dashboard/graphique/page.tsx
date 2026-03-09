"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";
import BudgetTotals from "@/components/BudgetTotals";
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

const COLORS = [
  "#0088FE","#00C49F","#FFBB28","#FF8042","#A28DD0","#FF6384",
  "#36A2EB","#FF9F40","#4BC0C0","#9966FF"
];

export default function StatistiquesPage() {
  const { isLoggedIn, loading } = useAuth();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [zones, setZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("Toutes");

  const [totalAlloue, setTotalAlloue] = useState(0);
  const [totalPrevisionnel, setTotalPrevisionnel] = useState(0);
  const [totalDepenses, setTotalDepenses] = useState(0);

  useEffect(() => {
    if (!loading && !isLoggedIn) window.location.href = "/dashboard";
  }, [isLoggedIn, loading]);

  const computeTotals = (data: BudgetItem[]) => {
    setTotalAlloue(data.reduce((sum, i) => sum + (i.budget_alloue || 0), 0));
    setTotalPrevisionnel(data.reduce((sum, i) => sum + (i.budget_previsionnel || 0), 0));
    setTotalDepenses(data.reduce((sum, i) => sum + (i.depenses_engagees || 0), 0));
    const zonesSet = Array.from(new Set(data.map((i) => i.zone))).sort();
    setZones(["Toutes", ...zonesSet]);
  };

  const fetchItems = async () => {
    // ✅ Supabase v2 : deux types génériques, RowType = any, SelectReturnType = BudgetItem[]
    const { data, error } = await supabase
      .from<any, BudgetItem[]>("budget_items")
      .select("*");
    if (!error && data) {
      setItems(data);
      computeTotals(data);
    }
    setLoadingItems(false);
  };

useEffect(() => {
  // wrapper async pour fetch
  const fetchData = async () => {
    await fetchItems();
  };
  fetchData();

  // subscription Supabase
  const channel = supabase
    .channel("budget_items_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "budget_items" },
      () => fetchItems()
    )
    .subscribe();

  // cleanup à la destruction du composant
  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  if (!isLoggedIn || loading || loadingItems) return <p>Chargement...</p>;

  const filteredItems =
    selectedZone === "Toutes"
      ? items
      : items.filter((i) => i.zone === selectedZone);

  const pieData = Array.from(
    filteredItems.reduce((map, item) => {
      map.set(item.objet, (map.get(item.objet) || 0) + item.depenses_engagees);
      return map;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

  const objets = Array.from(new Set(filteredItems.map(i => i.objet)));

  const barData: any[] = [
    {
      name: "Budget Alloué",
      ...objets.reduce((acc, obj) => {
        acc[obj] = filteredItems.filter(i => i.objet === obj).reduce((sum, i) => sum + i.budget_alloue, 0);
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "Prévisionnel",
      ...objets.reduce((acc, obj) => {
        acc[obj] = filteredItems.filter(i => i.objet === obj).reduce((sum, i) => sum + i.budget_previsionnel, 0);
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "Dépenses",
      ...objets.reduce((acc, obj) => {
        acc[obj] = filteredItems.filter(i => i.objet === obj).reduce((sum, i) => sum + i.depenses_engagees, 0);
        return acc;
      }, {} as Record<string, number>),
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Statistiques Budget</h1>

      <BudgetTotals
        totalAlloue={totalAlloue}
        totalPrevisionnel={totalPrevisionnel}
        totalDepenses={totalDepenses}
      />

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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 border p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center mb-2">Dépenses par objet</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => typeof value === "number" ? value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : ""}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 border p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center mb-2">
            Budget vs Prévisionnel vs Dépenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: any) => typeof value === "number" ? value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : ""}
              />
              <Legend />
              {objets.map((obj, index) => (
                <Bar key={obj} dataKey={obj} stackId="stack" fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}