export default function ExpenseTable({ expenses }: any) {

  return (
    <table>

      <thead>
        <tr>
          <th>Zone</th>
          <th>Objet</th>
          <th>Achèvement</th>
          <th>Budget Alloué</th>
          <th>Budget Prévisionnel</th>
          <th>Dépenses Engagées</th>
          <th>Commentaire</th>
        </tr>
      </thead>

      <tbody>

        {expenses.map((e:any)=>(
          <tr key={e.id}>

            <td>{e.zone}</td>
            <td>{e.objet}</td>
            <td>{e.achevement}%</td>
            <td>{e.budgetAlloue} €</td>
            <td>{e.budgetPrevisionnel} €</td>
            <td>{e.depenses} €</td>
            <td>{e.commentaire}</td>

          </tr>
        ))}

      </tbody>

    </table>
  )
}