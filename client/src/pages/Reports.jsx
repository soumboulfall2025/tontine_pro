import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getDebts, getMembers } from "../api";

const Reports = () => {
  const [debts, setDebts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const d = await getDebts();
    const m = await getMembers();
    setDebts(d);
    setMembers(m);
    setLoading(false);
  };

  const totalPaid = debts.filter((d) => d.status === "payée").reduce((sum, d) => sum + d.amount, 0);
  const totalUnpaid = debts.filter((d) => d.status === "non payée").reduce((sum, d) => sum + d.amount, 0);

  // Correction du top membres endettés : calculer la somme des dettes par membre
  const memberDebts = members.map((m) => {
    const debtsOfMember = debts.filter((d) => d.member === m._id);
    const total = debtsOfMember.reduce((sum, d) => sum + d.amount, 0);
    return { name: m.name, total };
  });
  const topMembers = memberDebts.sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen max-w-full">
          <h1 className="text-2xl font-bold mb-6">Rapports</h1>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-full">
                <h2 className="text-lg font-semibold mb-2">Statistiques générales</h2>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>Total membres :</span>
                    <span className="font-bold">{members.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total dettes :</span>
                    <span className="font-bold">{debts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dettes payées :</span>
                    <span className="font-bold text-green-600">{totalPaid} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dettes impayées :</span>
                    <span className="font-bold text-red-600">{totalUnpaid} FCFA</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-full">
                <h2 className="text-lg font-semibold mb-2">Top membres endettés</h2>
                <ul className="divide-y">
                  {topMembers.map((m, i) => (
                    <li key={i} className="py-2 flex justify-between">
                      <span>{m.name}</span>
                      <span className="font-bold">{m.total} FCFA</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Reports;
