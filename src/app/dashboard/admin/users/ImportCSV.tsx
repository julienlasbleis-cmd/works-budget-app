"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Papa from "papaparse";

export default function ImportCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return alert("Sélectionnez un fichier CSV");

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: Papa.ParseResult<any>) => {
        for (const row of results.data) {
          const email = row.email?.trim();
          const password = row.password?.trim();
          const role = row.role?.trim() || "user";

          if (!email || !password) continue;

          // Créer l'utilisateur dans Supabase Auth
          const { data, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
          });

          if (authError) {
            console.error("Erreur création Auth:", email, authError);
            continue;
          }

          const id = data.user?.id;
          if (!id) continue;

          // Ajouter ou mettre à jour le profil
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({ id, email, role });

          if (profileError) {
            console.error("Erreur insertion profil:", email, profileError);
          }
        }

        setLoading(false);
        alert("Import CSV terminé !");
        setFile(null);
      },
    });
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-2">Importer utilisateurs (CSV)</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-3 py-1 rounded"
        disabled={loading}
      >
        {loading ? "Import en cours..." : "Importer"}
      </button>
    </div>
  );
}