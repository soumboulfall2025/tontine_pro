import React from "react";

const RecentDebtsTable = ({ debts }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h3 className="text-lg font-bold mb-2">Dettes récentes</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2">Client</th>
            <th className="py-2">Montant</th>
            <th className="py-2">Date</th>
            <th className="py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((d, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2 font-medium">{d.client}</td>
              <td className="py-2">{d.amount} FCFA</td>
              <td className="py-2">{d.date}</td>
              <td className="py-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'payée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentDebtsTable;
