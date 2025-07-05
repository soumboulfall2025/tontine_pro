import React, { useEffect, useState } from "react";
import { getDebts } from "../api";

// Historique des paiements pour un membre et une tontine donnée
const MemberHistory = ({ memberId, tontineId }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId || !tontineId) return;
    setLoading(true);
    getDebts(tontineId).then((allDebts) => {
      setDebts(allDebts.filter(d => d.member === memberId || d.member?._id === memberId));
      setLoading(false);
    });
  }, [memberId, tontineId]);

  if (loading) return <div>Chargement de l'historique...</div>;
  if (!debts.length) return <div>Aucune opération trouvée pour ce membre.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Historique des paiements</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="py-1 px-2">Date</th>
            <th className="py-1 px-2">Montant</th>
            <th className="py-1 px-2">Statut</th>
            <th className="py-1 px-2">Payé par</th>
            <th className="py-1 px-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((d, i) => (
            <tr key={i}>
              <td className="py-1 px-2">{new Date(d.date).toLocaleDateString()}</td>
              <td className="py-1 px-2">{d.amount} FCFA</td>
              <td className="py-1 px-2">{d.status}</td>
              <td className="py-1 px-2">{d.paidBy?.name || '-'}</td>
              <td className="py-1 px-2">{d.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberHistory;
