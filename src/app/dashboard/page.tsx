"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/useAuth";

interface BudgetItem {
  id?: string;
  zone: string;
  objet: string;
  achevement: string;
  budget_alloue: number;
  budget_previsionnel: number;
  depenses_engagees: number;
  commentaire: string;
}

const defaultZones = [
  "Entrée","Salon","Salle à manger","Cuisine","Arrière cuisine","Chambre 1","Chambre 2",
  "Chambre 3","Salle de bain RDC","WC RDC","Couloir","SDB suite parentale","Annexe",
  "Studio","Pool house","Atelier","Appentis","Cabanon de jardin","Espaces verts","Allée extérieure",
  "Outillage","Toiture principale","Toiture annexe"
].sort();

const defaultAchevement = [
  "MO sous-traitance",
  "MO auto-réalisation",
  "Equipement à neuf",
  "Décoration"
].sort();

const defaultObjets = [
  "parquet","sous couche parquet","plinthes","barre de seuil","carrelage intérieur","lames vinyle/PVC",
  "peinture","placo-plâtre","douche l'italienne","extracteur/VMC","vasque","joints","chauffe-serviette",
  "sable","ciment","bastaing","linteau","planche de rive","tuiles","carrelage extérieur",
  "pistolet à peinture","papier de verre","quincaillerie","aérogommeuse","ponceuse à bande",
  "bandes pour ponceuse à bande","compresseur","micro-ondes","lave vaisselle","aspirateur"
].sort();

export default function DashboardPage() {

  const { isLoggedIn, loading } = useAuth();

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [zones, setZones] = useState([...defaultZones]);
  const [objets, setObjets] = useState([...defaultObjets]);
  const [achevements, setAchevements] = useState([...defaultAchevement]);

  const totalAlloue = items.reduce((sum, i) => sum + Number(i.budget_alloue), 0);
  const totalPrevisionnel = items.reduce((sum, i) => sum + Number(i.budget_previsionnel), 0);
  const totalDepenses = items.reduce((sum, i) => sum + Number(i.depenses_engagees), 0);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn, loading]);

  useEffect(() => {

    const fetchItems = async () => {

      const { data, error } = await supabase
        .from("budget_items")
        .select("*");

      if (!error && data) {
        setItems(data as BudgetItem[]);
      }

      setLoadingItems(false);
    };

    fetchItems();

  }, []);

  const addRow = () => {

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        zone: "",
        objet: "",
        achevement: "",
        budget_alloue: 0,
        budget_previsionnel: 0,
        depenses_engagees: 0,
        commentaire: ""
      }
    ]);
  };

  const updateItem = (index: number, key: keyof BudgetItem, value: any) => {

    const newItems = [...items];

    (newItems[index] as any)[key] = value;

    setItems(newItems);

    if (key === "zone" && value && !zones.includes(value)) {
      setZones([...zones, value].sort());
    }

    if (key === "objet" && value && !objets.includes(value)) {
      setObjets([...objets, value].sort());
    }

    if (key === "achevement" && value && !achevements.includes(value)) {
      setAchevements([...achevements, value].sort());
    }
  };

  const deleteRow = async (index: number) => {

    const item = items[index];

    if (item.id) {
      await supabase
        .from("budget_items")
        .delete()
        .eq("id", item.id);
    }

    const newItems = [...items];

    newItems.splice(index, 1);

    setItems(newItems);
  };

  const saveItems = async () => {

    const cleanedItems = items.map((item: any) => {

      const newItem = { ...item };

      delete newItem.created_at;

      return newItem;
    });

    const { error } = await supabase
      .from("budget_items")
      .upsert(cleanedItems, { onConflict: "id" });

    if (error) {
      console.error(error);
      alert("Erreur Supabase : " + error.message);
    } else {
      alert("Données sauvegardées !");
    }
  };

  if (!isLoggedIn || loading || loadingItems) {
    return <p>Chargement...</p>;
  }

  return (

    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      <div className="flex gap-4 mb-4">

        <div className="bg-gray-200 p-3 rounded w-1/3 text-center">
          <div className="text-gray-500">Estimatifs globaux</div>
          <div className="text-2xl font-bold">{totalAlloue.toFixed(2)} €</div>
        </div>

        <div className="bg-gray-200 p-3 rounded w-1/3 text-center">
          <div className="text-gray-500">Prévisionnel</div>
          <div className="text-2xl font-bold">{totalPrevisionnel.toFixed(2)} €</div>
        </div>

        <div className="bg-gray-200 p-3 rounded w-1/3 text-center">
          <div className="text-gray-500">Consommé</div>
          <div className="text-2xl font-bold">{totalDepenses.toFixed(2)} €</div>
        </div>

      </div>

      <button onClick={addRow} className="mb-2 bg-green-600 text-white px-3 py-1 rounded">
        Ajouter une ligne
      </button>

      <button onClick={saveItems} className="mb-2 ml-2 bg-blue-600 text-white px-3 py-1 rounded">
        Sauvegarder
      </button>

      {/* DATAlists restaurées */}

      <datalist id="zones-list">
        {zones.map(z => <option key={z} value={z} />)}
      </datalist>

      <datalist id="objets-list">
        {objets.map(o => <option key={o} value={o} />)}
      </datalist>

      <datalist id="achevement-list">
        {achevements.map(a => <option key={a} value={a} />)}
      </datalist>

      <table className="w-full border-collapse border border-gray-300 mt-2">

        <thead>

          <tr className="bg-gray-200">
            <th className="border p-2">Zone</th>
            <th className="border p-2">Objet</th>
            <th className="border p-2">Achèvement</th>
            <th className="border p-2">Budget Alloué (€)</th>
            <th className="border p-2">Budget Prévisionnel (€)</th>
            <th className="border p-2">Dépenses Engagées (€)</th>
            <th className="border p-2">Commentaire</th>
            <th className="border p-2">Actions</th>
          </tr>

        </thead>

        <tbody>

          {items.map((item, i) => (

            <tr key={item.id ?? i}>

              <td className="border p-1">
                <input list="zones-list" value={item.zone} onChange={e => updateItem(i,"zone",e.target.value)} className="w-full"/>
              </td>

              <td className="border p-1">
                <input list="objets-list" value={item.objet} onChange={e => updateItem(i,"objet",e.target.value)} className="w-full"/>
              </td>

              <td className="border p-1">
                <input list="achevement-list" value={item.achevement} onChange={e => updateItem(i,"achevement",e.target.value)} className="w-full"/>
              </td>

              <td className="border p-1">
                <input type="number" value={item.budget_alloue} onChange={e => updateItem(i,"budget_alloue",Number(e.target.value))} className="w-full"/>
              </td>

              <td className="border p-1">
                <input type="number" value={item.budget_previsionnel} onChange={e => updateItem(i,"budget_previsionnel",Number(e.target.value))} className="w-full"/>
              </td>

              <td className="border p-1">
                <input type="number" value={item.depenses_engagees} onChange={e => updateItem(i,"depenses_engagees",Number(e.target.value))} className="w-full"/>
              </td>

              <td className="border p-1">
                <input type="text" value={item.commentaire} onChange={e => updateItem(i,"commentaire",e.target.value)} className="w-full"/>
              </td>

              <td className="border p-1 text-center">
                <button onClick={() => deleteRow(i)} className="bg-red-600 text-white px-2 py-1 rounded">
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