import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import ClientsList from "../components/ClientsList";
import { getMembers, getDebtsByMember } from "../api";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Clients = () => {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const memberId = query.get("member");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [memberId]);

  const fetchData = async () => {
    setLoading(true);
    const m = await getMembers();
    setMembers(m);
    if (memberId) {
      const d = await getDebtsByMember(memberId);
      setDebts(d);
    } else {
      setDebts([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Clients / Membres</h1>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <>
              <ClientsList members={members} onViewDebts={() => {}} />
              {memberId && debts.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold mb-2">Dettes de ce membre</h2>
                  <table className="min-w-full bg-white rounded-xl shadow">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2 px-2">Montant</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Statut</th>
                        <th className="py-2 px-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debts.map((d, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 px-2">{d.amount} FCFA</td>
                          <td className="py-2 px-2">{new Date(d.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'payée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                          </td>
                          <td className="py-2 px-2">{d.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Clients;
