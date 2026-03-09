"use client";

import { useState } from "react";

export default function AddExpense({ onAdd }: any) {

  const [zone, setZone] = useState("");
  const [objet, setObjet] = useState("");
  const [achevement, setAchevement] = useState(0);
  const [budgetAlloue, setBudgetAlloue] = useState("");
  const [budgetPrev, setBudgetPrev] = useState("");
  const [depenses, setDepenses] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newRow = {
      id: Date.now(),
      zone,
      objet,
      achevement,
      budgetAlloue: Number(budgetAlloue),
      budgetPrevisionnel: Number(budgetPrev),
      depenses: Number(depenses),
      commentaire
    };

    onAdd(newRow);
  };

  return (
    <form onSubmit={handleSubmit}>

      <select value={zone} onChange={(e)=>setZone(e.target.value)}>
        <option value="">Zone</option>
        <option value="Cuisine">Cuisine</option>
        <option value="Salon">Salon</option>
        <option value="Salle de bain">Salle de bain</option>
      </select>

      <input
        placeholder="Objet"
        value={objet}
        onChange={(e)=>setObjet(e.target.value)}
      />

      <input
        type="number"
        placeholder="Achèvement %"
        value={achevement}
        onChange={(e)=>setAchevement(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Budget alloué"
        value={budgetAlloue}
        onChange={(e)=>setBudgetAlloue(e.target.value)}
      />

      <input
        type="number"
        placeholder="Budget prévisionnel"
        value={budgetPrev}
        onChange={(e)=>setBudgetPrev(e.target.value)}
      />

      <input
        type="number"
        placeholder="Dépenses engagées"
        value={depenses}
        onChange={(e)=>setDepenses(e.target.value)}
      />

      <input
        placeholder="Commentaire"
        value={commentaire}
        onChange={(e)=>setCommentaire(e.target.value)}
      />

      <button type="submit">Ajouter</button>

    </form>
  );
}