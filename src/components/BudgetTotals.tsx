"use client";

interface Props {
  totalAlloue: number;
  totalPrevisionnel: number;
  totalDepenses: number;
}

export default function BudgetTotals({
  totalAlloue,
  totalPrevisionnel,
  totalDepenses,
}: Props) {
  return (
    <div className="flex justify-center gap-16 my-8">
      <div className="text-center">
        <p className="text-sm text-gray-500 uppercase">
          Estimatif Global
        </p>
        <p className="text-4xl font-bold">
          {totalAlloue.toFixed(2)} €
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 uppercase">
          Prévisionnel
        </p>
        <p className="text-4xl font-bold">
          {totalPrevisionnel.toFixed(2)} €
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 uppercase">
          Consommé
        </p>
        <p className="text-4xl font-bold">
          {totalDepenses.toFixed(2)} €
        </p>
      </div>
    </div>
  );
}