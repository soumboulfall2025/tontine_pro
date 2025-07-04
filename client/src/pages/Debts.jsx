import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getDebts, getMembers, addDebt, markDebtPaid } from "../api";

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ member: "", amount: "", description: "", date: "", status: "non payée" });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDebt(form);
    setShowModal(false);
    setForm({ member: "", amount: "", description: "", date: "", status: "non payée" });
    fetchData();
  };

  const handleMarkPaid = async (id) => {
    await markDebtPaid(id);
    fetchData();
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dettes / Cotisations</h1>
            {isAdmin && (
              <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Ajouter une dette</button>
            )}
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 px-2">Membre</th>
                    <th className="py-2 px-2">Montant</th>
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Statut</th>
                    <th className="py-2 px-2">Description</th>
                    {isAdmin && <th className="py-2 px-2">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {debts.map((d, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium">{members.find(m => m._id === d.member)?.name || "-"}</td>
                      <td className="py-2 px-2">{d.amount} FCFA</td>
                      <td className="py-2 px-2">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'payée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                      </td>
                      <td className="py-2 px-2">{d.description}</td>
                      {isAdmin && (
                        <td className="py-2 px-2">
                          {d.status === 'non payée' && (
                            <button onClick={() => handleMarkPaid(d._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Marquer comme payée</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
        <BottomNav />
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-2">Ajouter une dette</h2>
              <select name="member" value={form.member} onChange={handleChange} required className="p-2 rounded border">
                <option value="">Sélectionner un membre</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
              <input name="amount" type="number" placeholder="Montant" value={form.amount} onChange={handleChange} required className="p-2 rounded border" />
              <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-2 rounded border" />
              <input name="date" type="date" value={form.date} onChange={handleChange} required className="p-2 rounded border" />
              <select name="status" value={form.status} onChange={handleChange} className="p-2 rounded border">
                <option value="payée">Payée</option>
                <option value="non payée">Non payée</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Ajouter</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debts;
