"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type Item = {
  zone: string;
  budget_previsionnel: number;
};

export default function BudgetCharts() {

  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {

    const { data, error } = await supabase
      .from("budget_items")
      .select("zone, budget_previsionnel");

    if (error) {
      console.error(error);
      return;
    }

    const grouped: any = {};

    data.forEach((item) => {
      if (!grouped[item.zone]) grouped[item.zone] = 0;
      grouped[item.zone] += item.budget_previsionnel || 0;
    });

    const chartData = Object.keys(grouped).map((zone) => ({
      name: zone,
      value: grouped[zone],
    }));

    setData(chartData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Répartition du budget</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}